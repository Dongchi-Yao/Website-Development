import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:50004';

// Map camelCase frontend keys to snake_case Python service keys
const mapToSnakeCase = (data) => {
  return {
    project_duration: data.projectDuration,
    project_type: data.projectType,
    has_cyber_legal_team: data.hasCyberLegalTeam,
    company_scale: data.companyScale,
    project_phase: data.projectPhase,
    layer1_teams: data.layer1Teams,
    layer2_teams: data.layer2Teams,
    layer3_teams: data.layer3Teams,
    layer4_teams: data.layer4Teams,
    layer5_teams: data.layer5Teams,
    layer6_teams: data.layer6Teams,
    layer7_teams: data.layer7Teams,
    layer8_teams: data.layer8Teams,
    team_overlap: data.teamOverlap,
    has_it_team: data.hasITTeam,
    devices_with_firewall: data.devicesWithFirewall,
    network_type: data.networkType,
    phishing_fail_rate: data.phishingFailRate,
    governance_level: data.governanceLevel,
    allow_password_reuse: data.allowPasswordReuse,
    uses_mfa: data.usesMFA
  };
};

export const calculateRisk = async (req, res) => {
  try {
    console.log('Received risk calculation request:', req.body);
    
    // Validate required fields
    const requiredFields = [
      'projectDuration', 'projectType', 'hasCyberLegalTeam', 'companyScale', 'projectPhase',
      'teamOverlap', 'hasITTeam', 'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }
    
    // Check if at least one team layer is specified
    const teamLayers = ['layer1Teams', 'layer2Teams', 'layer3Teams', 'layer4Teams', 
                       'layer5Teams', 'layer6Teams', 'layer7Teams', 'layer8Teams'];
    const hasTeamData = teamLayers.some(layer => 
      req.body[layer] && req.body[layer] !== 'na' && req.body[layer] !== ''
    );
    
    if (!hasTeamData) {
      return res.status(400).json({
        error: 'At least one team layer must be specified (not N/A)'
      });
    }
    
    // Map data to snake_case for Python service
    const pythonData = mapToSnakeCase(req.body);
    
    console.log('Sending to Python service:', pythonData);
    
    // Call Python service
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/predict`, pythonData, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Python service response:', response.data);
      
      // Return the risk analysis results
      res.json(response.data);
      
    } catch (pythonError) {
      console.error('Python service error:', pythonError.response?.data || pythonError.message);
      
      if (pythonError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Risk analysis service is unavailable',
          message: 'The AI model service is currently offline. Please try again later.'
        });
      }
      
      return res.status(500).json({
        error: 'Risk calculation failed',
        message: pythonError.response?.data?.detail || 'Internal server error'
      });
    }
    
  } catch (error) {
    console.error('Risk calculation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const healthCheck = async (req, res) => {
  try {
    // Check if Python service is running
    const response = await axios.get(`${PYTHON_SERVICE_URL}/health`, {
      timeout: 5000
    });
    
    res.json({
      status: 'healthy',
      pythonService: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Python service unavailable',
      timestamp: new Date().toISOString()
    });
  }
}; 