import Project from '../models/Project.js';

// Save a new project
export const saveProject = async (req, res) => {
  try {
    const {
      projectName,
      projectInfo,
      riskResults,
      mitigationStrategy,
      conversations
    } = req.body;

    // Check if project name already exists for this user
    const existingProject = await Project.findOne({
      userId: req.user.id,
      projectName: projectName
    });

    if (existingProject) {
      return res.status(400).json({
        error: 'Project name already exists',
        message: 'Please choose a different project name'
      });
    }

    // Create new project with organization
    const project = new Project({
      userId: req.user.id,
      organization: req.user.organization, // Add organization from authenticated user
      projectName,
      projectInfo,
      riskResults,
      mitigationStrategy,
      conversations: conversations || []
    });

    await project.save();

    res.status(201).json({
      message: 'Project saved successfully',
      project: {
        id: project._id,
        projectName: project.projectName,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Save project error:', error);
    res.status(500).json({
      error: 'Failed to save project',
      message: error.message
    });
  }
};

// Get all projects for a user
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id })
      .select('projectName createdAt updatedAt projectInfo riskResults')
      .sort({ updatedAt: -1 });

    // Calculate average risk score for each project
    const projectsWithRiskSummary = projects.map(project => {
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
        
        averageRisk = risks.reduce((sum, risk) => sum + risk, 0) / risks.length;
        
        if (averageRisk >= 0.8) riskLevel = 'critical';
        else if (averageRisk >= 0.6) riskLevel = 'high';
        else if (averageRisk >= 0.4) riskLevel = 'medium';
        else riskLevel = 'low';
      }

      return {
        id: project._id,
        projectName: project.projectName,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        projectType: project.projectInfo?.projectType || 'N/A',
        companyScale: project.projectInfo?.companyScale || 'N/A',
        averageRisk,
        riskLevel
      };
    });

    res.json(projectsWithRiskSummary);

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Failed to retrieve projects',
      message: error.message
    });
  }
};

// Get a specific project
export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json(project);

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Failed to retrieve project',
      message: error.message
    });
  }
};

// Update an existing project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      projectName,
      projectInfo,
      riskResults,
      mitigationStrategy,
      conversations
    } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    // Check if new project name already exists (excluding current project)
    if (projectName && projectName !== project.projectName) {
      const existingProject = await Project.findOne({
        userId: req.user.id,
        projectName: projectName,
        _id: { $ne: projectId }
      });

      if (existingProject) {
        return res.status(400).json({
          error: 'Project name already exists',
          message: 'Please choose a different project name'
        });
      }
    }

    // Update project fields
    if (projectName) project.projectName = projectName;
    if (projectInfo) project.projectInfo = projectInfo;
    if (riskResults) project.riskResults = riskResults;
    if (mitigationStrategy) project.mitigationStrategy = mitigationStrategy;
    if (conversations) project.conversations = conversations;

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project: {
        id: project._id,
        projectName: project.projectName,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: error.message
    });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: error.message
    });
  }