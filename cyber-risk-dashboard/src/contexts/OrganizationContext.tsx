import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface Organization {
  _id: string;
  name: string;
  code: string;
  manager: string;
  members: Member[];
  industry?: string;
  size?: string;
  description?: string;
  memberCount?: number;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface OrganizationProject {
  id: string;
  projectName: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  projectType: string;
  companyScale: string;
  averageRisk: number;
  riskLevel: string;
}

interface OrganizationMetrics {
  totalProjects: number;
  projectsByUser: Record<string, number>;
  averageRiskByUser: Record<string, number>;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

interface OrganizationStats {
  totalMembers: number;
  totalProjects: number;
  averageRiskScore: number;
  riskTrend: any[];
  topRisks: Record<string, number>;
  mitigationProgress: number;
}

interface OrganizationContextType {
  organization: Organization | null;
  projects: OrganizationProject[];
  metrics: OrganizationMetrics | null;
  stats: OrganizationStats | null;
  isLoading: boolean;
  error: string | null;
  fetchOrganization: () => Promise<void>;
  fetchOrganizationProjects: () => Promise<void>;
  fetchOrganizationStats: () => Promise<void>;
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<OrganizationProject[]>([]);
  const [metrics, setMetrics] = useState<OrganizationMetrics | null>(null);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const fetchOrganization = useCallback(async () => {
    if (!user?.organization?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/organizations/${user.organization._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      } else {
        throw new Error('Failed to fetch organization');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchOrganizationProjects = useCallback(async () => {
    if (!user?.organization?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/organizations/${user.organization._id}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setMetrics(data.metrics || null);
      } else {
        throw new Error('Failed to fetch organization projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchOrganizationStats = useCallback(async () => {
    if (!user?.organization?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/organizations/${user.organization._id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || null);
      } else {
        throw new Error('Failed to fetch organization stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!user?.organization?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/organizations/${user.organization._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setOrganization(data.organization);
      } else {
        throw new Error('Failed to update organization');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    if (!user?.organization?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/organizations/${user.organization._id}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchOrganization();
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: OrganizationContextType = {
    organization,
    projects,
    metrics,
    stats,
    isLoading,
    error,
    fetchOrganization,
    fetchOrganizationProjects,
    fetchOrganizationStats,
    updateOrganization,
    removeMember,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}; 