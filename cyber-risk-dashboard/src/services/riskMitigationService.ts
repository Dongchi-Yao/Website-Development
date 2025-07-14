import type { ProjectInfo } from '../types/project';

export interface RiskMitigationRecommendation {
  featureGroup: string;
  featureName: string;
  currentOption: string;
  recommendedOption: string;
  optionIndex: number;
  description: string;
  enhancedDescription?: string;
  costLevel?: number;
  importance?: string;
  riskReduction?: number;
  riskReductionPercentage?: number;
  calculatedRiskReduction?: number; // Individual risk reduction calculation
}

export interface RiskMitigationRound {
  roundNumber: number;
  features: string[];
  currentRisk: number;
  projectedRisk: number;
  riskReduction: number;
  reductionPercentage: number;
  recommendations: RiskMitigationRecommendation[];
}

export interface RiskMitigationStrategy {
  initialRisk: number;
  finalRisk: number;
  totalReduction: number;
  totalReductionPercentage: number;
  rounds: RiskMitigationRound[];
  implementationPriority: 'high' | 'medium' | 'low';
}

export interface RecommendationRiskReductionRequest {
  user_data: number[];
  featureGroup: string;
  featureName: string;
  currentOption: string;
  recommendedOption: string;
  current_risk?: number;  // Override for consistent risk calculation
}

export interface RecommendationRiskReductionResponse {
  featureGroup: string;
  featureName: string;
  currentOption: string;
  recommendedOption: string;
  riskReduction: number;
  riskReductionPercentage: number;
}

class RiskMitigationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async generateMitigationStrategy(projectInfo: ProjectInfo, currentRisk?: number): Promise<RiskMitigationStrategy> {
    // Convert project info to model input array
    const modelInput = this.convertProjectInfoToModelInput(projectInfo);
    
    // Prepare request body with optional current risk override
    const requestBody: any = { user_data: modelInput };
    if (currentRisk !== undefined) {
      requestBody.current_risk = currentRisk;
    }
    
    return this.makeRequest<RiskMitigationStrategy>('/mitigation-strategy', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async calculateRecommendationRiskReduction(
    request: RecommendationRiskReductionRequest
  ): Promise<RecommendationRiskReductionResponse> {
    return this.makeRequest<RecommendationRiskReductionResponse>('/recommendation-risk-reduction', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  private convertProjectInfoToModelInput(projectInfo: ProjectInfo): number[] {
    return [
      // 1.1 Project Duration (0-4 scale)
      ['<=3m', '3-6m', '6-12m', '12-24m', '>24m']
        .indexOf(projectInfo.projectDuration),

      // 1.2 Project Type (0-5 scale)
      ['transportation', 'government', 'healthcare', 'commercial', 'residential', 'other']
        .indexOf(projectInfo.projectType),

      // 1.3 Has Cyber Legal Team (0-2 scale)
      ['yes', 'no', 'unsure'].indexOf(projectInfo.hasCyberLegalTeam),

      // 1.4 Company Scale (0-4 scale)
      ['<=30', '31-60', '61-100', '101-150', '>150']
        .indexOf(projectInfo.companyScale),

      // 1.5 Project Phase (0-4 scale)
      ['planning', 'design', 'construction', 'maintenance', 'demolition']
        .indexOf(projectInfo.projectPhase),

      // 2.1.1 Layer 1 Teams (0-5 scale)
      ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
        .indexOf(projectInfo.layer1Teams),

      // 2.1.2 Layer 2 Teams (0-5 scale)
      ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
        .indexOf(projectInfo.layer2Teams),

      // 2.1.3 Layer 3 Teams (0-5 scale)
      ['<=10', '11-20', '21-30', '31-40', '>40', 'na']
        .indexOf(projectInfo.layer3Teams),

      // 2.2 Team Overlap (0-4 scale)
      ['<=20', '21-40', '41-60', '61-80', '81-100']
        .indexOf(projectInfo.teamOverlap),

      // 3.1 Has IT Team (0-2 scale)
      ['yes', 'no', 'unsure'].indexOf(projectInfo.hasITTeam),

      // 3.2 Devices with Firewall (0-4 scale)
      ['<=20', '21-40', '41-60', '61-80', '81-100']
        .indexOf(projectInfo.devicesWithFirewall),

      // 3.3 Network Type (0-2 scale)
      ['public', 'private', 'both'].indexOf(projectInfo.networkType),

      // 3.4 Phishing Fail Rate (0-4 scale)
      ['<=20', '21-40', '41-60', '61-80', '81-100']
        .indexOf(projectInfo.phishingFailRate),

      // 4.1 Governance Level (0-4 scale)
      ['level1', 'level2', 'level3', 'level4', 'level5']
        .indexOf(projectInfo.governanceLevel),

      // 4.2 Allow Password Reuse (0-1 scale)
      ['yes', 'no'].indexOf(projectInfo.allowPasswordReuse),

      // 4.3 Uses MFA (0-1 scale)
      ['yes', 'no'].indexOf(projectInfo.usesMFA),
    ];
  }
}

export const riskMitigationService = new RiskMitigationService(); 