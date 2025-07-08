import Organization from '../models/Organization.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

// Get organization details
export const getOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // Handle both object and string organization IDs
    const userOrgId = req.user.organization?._id || req.user.organization;
    
    // Verify user belongs to this organization
    if (!userOrgId || userOrgId.toString() !== organizationId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findById(organizationId)
      .populate('manager', 'name email')
      .populate('members', 'name email role profilePicture');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get organization projects (for managers)
export const getOrganizationProjects = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    console.log('getOrganizationProjects - organizationId:', organizationId);
    console.log('getOrganizationProjects - req.user:', req.user);
    console.log('getOrganizationProjects - req.user.organization:', req.user.organization);
    
    // Handle both object and string organization IDs
    const userOrgId = req.user.organization?._id || req.user.organization;
    
    // Verify user belongs to this organization
    if (!userOrgId || userOrgId.toString() !== organizationId) {
      console.log('Access denied - userOrgId:', userOrgId, 'organizationId:', organizationId);
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user is manager
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const isManager = organization.isManager(req.user.id);
    
    // If not manager, only return their own projects
    const query = isManager 
      ? { organization: organizationId }
      : { organization: organizationId, userId: req.user.id };

    const projects = await Project.find(query)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });

    // Format projects with calculated risk scores
    const formattedProjects = projects.map(project => {
      let averageRisk = 0;
      let riskLevel = 'low';
      
      if (project.riskResults) {
        const risks = [
          project.riskResults.ransomware?.score || 0,
          project.riskResults.phishing?.score || 0,
          project.riskResults.dataBreach?.score || 0,
          project.riskResults.insiderAttack?.score || 0,
          project.riskResults.supplyChain?.score || 0
        ];
        
        const validRisks = risks.filter(risk => !isNaN(risk) && risk !== null);
        if (validRisks.length > 0) {
          averageRisk = validRisks.reduce((sum, risk) => sum + risk, 0) / validRisks.length;
        }
        
        if (averageRisk >= 0.75) riskLevel = 'critical';
        else if (averageRisk >= 0.5) riskLevel = 'high';
        else if (averageRisk >= 0.25) riskLevel = 'medium';
        else riskLevel = 'low';
      }

      return {
        id: project._id,
        projectName: project.projectName || 'Unnamed Project',
        userId: project.userId || { name: 'Unknown User', email: 'unknown@example.com' },
        createdAt: project.createdAt || new Date(),
        updatedAt: project.updatedAt || new Date(),
        projectType: project.projectInfo?.projectType || 'Unknown',
        companyScale: project.projectInfo?.companyScale || 'Unknown',
        averageRisk: isNaN(averageRisk) ? 0 : averageRisk,
        riskLevel
      };
    });

    // Calculate aggregated metrics
    const metrics = {
      totalProjects: projects.length,
      projectsByUser: {},
      averageRiskByUser: {},
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    formattedProjects.forEach(project => {
      // Handle cases where userId might be null or user was deleted
      const userName = project.userId?.name || 'Unknown User';
      
      // Count projects by user
      metrics.projectsByUser[userName] = (metrics.projectsByUser[userName] || 0) + 1;
      
      // Calculate average risk by user
      if (!metrics.averageRiskByUser[userName]) {
        metrics.averageRiskByUser[userName] = { total: 0, count: 0 };
      }
      metrics.averageRiskByUser[userName].total += project.averageRisk || 0;
      metrics.averageRiskByUser[userName].count += 1;
      
      // Count risk levels
      metrics.riskDistribution[project.riskLevel] = (metrics.riskDistribution[project.riskLevel] || 0) + 1;
    });

    // Calculate final averages
    Object.keys(metrics.averageRiskByUser).forEach(userName => {
      const data = metrics.averageRiskByUser[userName];
      metrics.averageRiskByUser[userName] = data.count > 0 ? data.total / data.count : 0;
    });

    res.json({
      organization,
      projects: formattedProjects,
      metrics,
      isManager
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update organization details (manager only)
export const updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name, description, industry, size } = req.body;
    
    // Verify user is the manager
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (!organization.isManager(req.user.id)) {
      return res.status(403).json({ message: 'Only organization managers can update details' });
    }

    // Update fields
    if (name) organization.name = name;
    if (description) organization.description = description;
    if (industry) organization.industry = industry;
    if (size) organization.size = size;

    await organization.save();

    res.json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove member from organization (manager only)
export const removeMember = async (req, res) => {
  try {
    const { organizationId, userId } = req.params;
    
    // Verify user is the manager
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (!organization.isManager(req.user.id)) {
      return res.status(403).json({ message: 'Only organization managers can remove members' });
    }

    // Cannot remove the manager
    if (organization.manager.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove the organization manager' });
    }

    // Remove member
    await organization.removeMember(userId);

    // Update user's organization field
    await User.findByIdAndUpdate(userId, { organization: null });

    res.json({
      message: 'Member removed successfully',
      organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get organization statistics
export const getOrganizationStats = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // Handle both object and string organization IDs
    const userOrgId = req.user.organization?._id || req.user.organization;
    
    // Verify user belongs to this organization
    if (!userOrgId || userOrgId.toString() !== organizationId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const isManager = organization.isManager(req.user.id);
    
    // Get all projects for this organization
    const query = isManager 
      ? { organization: organizationId }
      : { organization: organizationId, userId: req.user.id };

    const projects = await Project.find(query);

    // Calculate statistics
    const stats = {
      totalMembers: organization.members.length,
      totalProjects: projects.length,
      averageRiskScore: 0,
      riskTrend: [],
      topRisks: {},
      mitigationProgress: 0
    };

    if (projects.length > 0) {
      let totalRisk = 0;
      let mitigatedProjects = 0;

      projects.forEach(project => {
        if (project.riskResults) {
          const risks = [
            project.riskResults.ransomware?.score || 0,
            project.riskResults.phishing?.score || 0,
            project.riskResults.dataBreach?.score || 0,
            project.riskResults.insiderAttack?.score || 0,
            project.riskResults.supplyChain?.score || 0
          ];
          const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
          totalRisk += avgRisk;

          // Track top risks
          Object.entries(project.riskResults).forEach(([type, data]) => {
            if (data?.score) {
              stats.topRisks[type] = (stats.topRisks[type] || 0) + data.score;
            }
          });

          // Check if project has mitigation strategy
          if (project.mitigationStrategy?.rounds?.length > 0) {
            mitigatedProjects++;
          }
        }
      });

      stats.averageRiskScore = totalRisk / projects.length;
      stats.mitigationProgress = (mitigatedProjects / projects.length) * 100;

      // Normalize top risks
      Object.keys(stats.topRisks).forEach(risk => {
        stats.topRisks[risk] = stats.topRisks[risk] / projects.length;
      });
    }

    res.json({
      organization: {
        name: organization.name,
        code: organization.code,
        industry: organization.industry,
        size: organization.size
      },
      stats,
      isManager
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 