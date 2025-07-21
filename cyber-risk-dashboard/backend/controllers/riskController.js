import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:50004';

// Convert frontend form data to integer array format expected by the ML model
const convertToModelInput = (data) => {
  const duration_map = {"<=3m": 0, "3-6m": 1, "6-12m": 2, "12-24m": 3, ">24m": 4};
  const project_type_map = {
    "transportation": 0, "government": 1, "healthcare": 2, 
    "commercial": 3, "residential": 4, "other": 5
  };
  const yes_no_unsure_map = {"yes": 0, "no": 1, "unsure": 2};
  const company_scale_map = {"<=30": 0, "31-60": 1, "61-100": 2, "101-150": 3, ">150": 4};
  const project_phase_map = {"planning": 0, "design": 1, "construction": 2, "maintenance": 3, "demolition": 4};
  const team_count_map = {"<=10": 0, "11-20": 1, "21-30": 2, "31-40": 3, ">40": 4, "na": 5};
  const percentage_map = {"<=20": 0, "21-40": 1, "41-60": 2, "61-80": 3, "81-100": 4};
  const network_map = {"public": 0, "private": 1, "both": 2};
  const governance_map = {"level1": 0, "level2": 1, "level3": 2, "level4": 3, "level5": 4};
  const yes_no_map = {"yes": 0, "no": 1};
  
  return [
    duration_map[data.projectDuration] || 0,
    project_type_map[data.projectType] || 0,
    yes_no_unsure_map[data.hasCyberLegalTeam] || 0,
    company_scale_map[data.companyScale] || 0,
    project_phase_map[data.projectPhase] || 0,
    team_count_map[data.layer1Teams] || 0,
    team_count_map[data.layer2Teams] || 0,
    team_count_map[data.layer3Teams] || 0,
    percentage_map[data.teamOverlap] || 0,
    yes_no_unsure_map[data.hasITTeam] || 0,
    percentage_map[data.devicesWithFirewall] || 0,
    network_map[data.networkType] || 0,
    percentage_map[data.phishingFailRate] || 0,
    governance_map[data.governanceLevel] || 0,
    yes_no_map[data.allowPasswordReuse] || 0,
    yes_no_map[data.usesMFA] || 0
  ];
};

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
      'layer1Teams', 'layer2Teams', 'layer3Teams', 'teamOverlap', 'hasITTeam', 
      'devicesWithFirewall', 'networkType', 'phishingFailRate',
      'governanceLevel', 'allowPasswordReuse', 'usesMFA'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }
    
    // Map data to format expected by Python service (use predict endpoint)
    const pythonData = {
      user_data: convertToModelInput(req.body)
    };
    
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
      
      // Transform response to match frontend expectations
      const { probabilities, risk_types } = response.data;
      
      // Helper function to determine risk level (matching frontend expectations)
      const getRiskLevel = (score) => {
        if (score < 25) return 'low';        // 0-25%
        if (score < 50) return 'medium';     // 25-50%
        if (score < 75) return 'high';       // 50-75%
        return 'critical';                   // 75-100%
      };
      
      // Helper function to get recommendations based on risk type and level
      const getRecommendations = (riskType, level) => {
        const recommendations = {
          ransomware: {
            low: ['Maintain current backup procedures', 'Regular security awareness training', 'Implement automated backup validation'],
            medium: ['Deploy advanced threat detection', 'Implement network segmentation', 'Enhanced endpoint protection'],
            high: ['Immediate incident response planning', 'Deploy EDR solutions', 'Advanced threat hunting'],
            critical: ['Emergency security audit', 'Implement zero-trust architecture', 'Immediate response team activation']
          },
          phishing: {
            low: ['Basic email security training', 'Standard spam filters', 'Implement DMARC'],
            medium: ['Advanced phishing simulation', 'Deploy email security gateway', 'Enhanced email security awareness'],
            high: ['Intensive security training', 'Multi-factor authentication', 'Advanced email filtering'],
            critical: ['Emergency phishing response plan', 'Advanced email threat protection', 'Immediate user lockdown protocols']
          },
          dataBreach: {
            low: ['Regular data classification', 'Basic access controls', 'Enhanced data encryption'],
            medium: ['Data loss prevention tools', 'Regular access reviews', 'Access logging'],
            high: ['Advanced DLP deployment', 'Privileged access management', 'Continuous data monitoring'],
            critical: ['Emergency data protection audit', 'Zero-trust data access', 'Immediate breach response protocols']
          },
          insiderAttack: {
            low: ['Basic background checks', 'Standard access controls', 'Enhanced user monitoring'],
            medium: ['Behavioral analytics deployment', 'Privileged user monitoring', 'Regular access reviews'],
            high: ['Advanced insider threat detection', 'Continuous monitoring', 'User activity analytics'],
            critical: ['Emergency insider threat response', 'Advanced behavioral analysis', 'Immediate privilege revocation']
          },
          supplyChain: {
            low: ['Basic vendor assessments', 'Standard contracts', 'Enhanced vendor security reviews'],
            medium: ['Third-party risk management', 'Continuous vendor monitoring', 'Supply chain mapping'],
            high: ['Advanced supply chain security', 'Real-time threat intelligence', 'Vendor security audits'],
            critical: ['Emergency supply chain audit', 'Zero-trust supplier access', 'Immediate vendor isolation protocols']
          }
        };
        return recommendations[riskType]?.[level] || ['Consult security experts for specific recommendations'];
      };
      
      // Create formatted response
      const formattedResponse = {};
      
      risk_types.forEach((riskType, index) => {
        const rawScore = probabilities[index];
        const percentageScore = rawScore * 100; // Convert to percentage (0-100 scale)
        const level = getRiskLevel(percentageScore); // Use percentage score for level determination
        const recommendations = getRecommendations(riskType, level);
        
        // Map risk type names to match frontend expectations
        const typeMapping = {
          'ransomware': 'ransomware',
          'phishing': 'phishing', 
          'dataBreach': 'data_breach',
          'insiderAttack': 'insider_attack',
          'supplyChain': 'supply_chain'
        };
        
        const mappedType = typeMapping[riskType] || riskType;
        
        formattedResponse[mappedType] = {
          score: percentageScore,
          level: level,
          recommendations: recommendations
        };
      });
      
      // Add summary information
      formattedResponse.summary = {
        overallRisk: Math.max(...probabilities) * 100, // Convert to percentage
        totalRisks: risk_types.length,
        highestRisk: risk_types[probabilities.indexOf(Math.max(...probabilities))]
      };
      
      // Return the formatted results
      res.json(formattedResponse);
      
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

// Convert frontend risk calculation request to user_data array format for Python service
const convertToUserDataArray = (formData) => {
  // Map frontend form values to the 16 model input features
  const duration_map = {"<=3m": 0, "3-6m": 1, "6-12m": 2, "12-24m": 3, ">24m": 4};
  
  const project_type_map = {
    "transportation": 0, "government": 1, "healthcare": 2, 
    "commercial": 3, "residential": 4, "other": 5
  };
  
  const yes_no_map = {"yes": 1, "no": 0, "unsure": 0};
  const company_scale_map = {"<=30": 0, "31-60": 1, "61-100": 2, "101-150": 3, ">150": 4};
  const project_phase_map = {"planning": 0, "design": 1, "construction": 2, "maintenance": 3, "demolition": 4};
  const team_count_map = {"<=10": 0, "11-20": 1, "21-30": 2, "31-40": 3, ">40": 4, "na": 0};
  const percentage_map = {"<=20": 0, "21-40": 1, "41-60": 2, "61-80": 3, "81-100": 4};
  const network_map = {"public": 0, "private": 1, "both": 2};
  const governance_map = {"level1": 0, "level2": 1, "level3": 2, "level4": 3, "level5": 4};
  
  return [
    duration_map[formData.projectDuration] || 0,
    project_type_map[formData.projectType] || 0,
    yes_no_map[formData.hasCyberLegalTeam] || 0,
    company_scale_map[formData.companyScale] || 0,
    project_phase_map[formData.projectPhase] || 0,
    team_count_map[formData.layer1Teams] || 0,
    team_count_map[formData.layer2Teams] || 0,
    team_count_map[formData.layer3Teams] || 0,
    percentage_map[formData.teamOverlap] || 0,
    yes_no_map[formData.hasITTeam] || 0,
    percentage_map[formData.devicesWithFirewall] || 0,
    network_map[formData.networkType] || 0,
    percentage_map[formData.phishingFailRate] || 0,
    governance_map[formData.governanceLevel] || 0,
    yes_no_map[formData.allowPasswordReuse] || 0,
    yes_no_map[formData.usesMFA] || 0
  ];
};

export const generateMitigationStrategy = async (req, res) => {
  try {
    console.log('Received mitigation strategy request:', req.body);
    
    // Convert frontend form data to user_data array
    const user_data = convertToUserDataArray(req.body);
    
    const pythonPayload = {
      user_data: user_data,
      current_risk: req.body.current_risk || null
    };
    
    console.log('Sending to Python mitigation service:', pythonPayload);
    
    // Call Python service mitigation endpoint
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/mitigation-strategy`, pythonPayload, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Python mitigation service response:', response.data);
      
      // Return the mitigation strategy results
      res.json(response.data);
      
    } catch (pythonError) {
      console.error('Python mitigation service error:', pythonError.response?.data || pythonError.message);
      
      if (pythonError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Mitigation analysis service is unavailable',
          message: 'The AI model service is currently offline. Please try again later.'
        });
      }
      
      return res.status(500).json({
        error: 'Mitigation strategy generation failed',
        message: pythonError.response?.data?.detail || 'Internal server error'
      });
    }
    
  } catch (error) {
    console.error('Mitigation strategy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const calculateRecommendationRiskReduction = async (req, res) => {
  try {
    console.log('Received recommendation risk reduction request:', req.body);
    
    // Forward the request directly to Python service
    const pythonPayload = {
      user_data: req.body.user_data,
      featureGroup: req.body.featureGroup,
      featureName: req.body.featureName,
      currentOption: req.body.currentOption,
      recommendedOption: req.body.recommendedOption,
      current_risk: req.body.current_risk || null
    };
    
    console.log('Sending to Python recommendation service:', pythonPayload);
    
    // Call Python service recommendation endpoint
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/recommendation-risk-reduction`, pythonPayload, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Python recommendation service response:', response.data);
      
      // Return the recommendation risk reduction results
      res.json(response.data);
      
    } catch (pythonError) {
      console.error('Python recommendation service error:', pythonError.response?.data || pythonError.message);
      
      if (pythonError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Recommendation analysis service is unavailable',
          message: 'The AI model service is currently offline. Please try again later.'
        });
      }
      
      return res.status(500).json({
        error: 'Recommendation risk reduction calculation failed',
        message: pythonError.response?.data?.detail || 'Internal server error'
      });
    }
    
  } catch (error) {
    console.error('Recommendation risk reduction error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}; 

export const streamRiskProbabilities = async (req, res) => {
  try {
    console.log('Starting risk probability stream...');
    
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    // Forward SSE from Python service
    const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/stream`);
    
    if (!pythonResponse.ok) {
      throw new Error(`Python service stream failed: ${pythonResponse.status}`);
    }
    
    // Pipe the stream
    pythonResponse.body.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        }
      })
    ).catch(error => {
      console.error('Stream error:', error);
      res.end();
    });
    
    // Handle client disconnect
    req.on('close', () => {
      console.log('Client disconnected from stream');
      res.end();
    });
    
  } catch (error) {
    console.error('Stream setup error:', error);
    res.status(500).json({
      error: 'Stream unavailable',
      message: error.message
    });
  }
}; 