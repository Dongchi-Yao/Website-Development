import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Chip, Button, CircularProgress, Alert, Grid, Card, CardContent, Switch, FormControlLabel, Tabs, Tab, IconButton, Snackbar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SavedProject {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  projectType: string;
  companyScale: string;
  averageRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy?: {
    initialRisk: number;
    finalRisk: number;
    totalReduction: number;
    totalReductionPercentage: number;
  };
}

const Reports = () => {
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { projects: orgProjects, metrics: orgMetrics, fetchOrganizationProjects, isLoading: orgLoading } = useOrganization();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [detailedProjects, setDetailedProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useDummyData, setUseDummyData] = useState(false);
  const [viewMode, setViewMode] = useState<'personal' | 'organization'>(isManager() ? 'organization' : 'personal');
  const [codeCopied, setCodeCopied] = useState(false);

  // Dummy data for presentation
  const dummyProjects: SavedProject[] = [
    {
      id: 'dummy-1',
      projectName: 'Smart City Infrastructure Hub',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      projectType: 'Smart Infrastructure',
      companyScale: 'Large',
      averageRisk: 0.25,
      riskLevel: 'low'
    },
    {
      id: 'dummy-2',
      projectName: 'Corporate Office Complex',
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-25T11:20:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Medium',
      averageRisk: 0.45,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-3',
      projectName: 'Residential Tower Development',
      createdAt: '2024-02-02T16:00:00Z',
      updatedAt: '2024-02-08T13:30:00Z',
      projectType: 'Residential Building',
      companyScale: 'Large',
      averageRisk: 0.35,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-4',
      projectName: 'IoT Manufacturing Plant',
      createdAt: '2024-02-10T08:45:00Z',
      updatedAt: '2024-02-15T17:10:00Z',
      projectType: 'Industrial Facility',
      companyScale: 'Large',
      averageRisk: 0.65,
      riskLevel: 'high'
    },
    {
      id: 'dummy-5',
      projectName: 'Data Center Expansion',
      createdAt: '2024-02-20T12:20:00Z',
      updatedAt: '2024-02-25T10:55:00Z',
      projectType: 'Critical Infrastructure',
      companyScale: 'Large',
      averageRisk: 0.75,
      riskLevel: 'critical'
    },
    {
      id: 'dummy-6',
      projectName: 'Small Business Office',
      createdAt: '2024-03-01T14:10:00Z',
      updatedAt: '2024-03-05T09:40:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Small',
      averageRisk: 0.20,
      riskLevel: 'low'
    },
    {
      id: 'dummy-7',
      projectName: 'Smart Hospital Network',
      createdAt: '2024-03-08T11:25:00Z',
      updatedAt: '2024-03-12T15:15:00Z',
      projectType: 'Healthcare Facility',
      companyScale: 'Large',
      averageRisk: 0.55,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-8',
      projectName: 'Warehouse Automation Hub',
      createdAt: '2024-03-15T07:30:00Z',
      updatedAt: '2024-03-20T16:45:00Z',
      projectType: 'Industrial Facility',
      companyScale: 'Medium',
      averageRisk: 0.40,
      riskLevel: 'medium'
    },
    {
      id: 'dummy-9',
      projectName: 'School District IT Infrastructure',
      createdAt: '2024-03-22T13:15:00Z',
      updatedAt: '2024-03-28T12:30:00Z',
      projectType: 'Educational Facility',
      companyScale: 'Medium',
      averageRisk: 0.30,
      riskLevel: 'low'
    },
    {
      id: 'dummy-10',
      projectName: 'Financial Services Building',
      createdAt: '2024-04-01T10:00:00Z',
      updatedAt: '2024-04-05T14:20:00Z',
      projectType: 'Commercial Building',
      companyScale: 'Large',
      averageRisk: 0.70,
      riskLevel: 'high'
    }
  ];

  useEffect(() => {
    console.log('Reports useEffect - user:', user);
    console.log('Reports useEffect - user.organization:', user?.organization);
    console.log('Reports useEffect - viewMode:', viewMode);
    
    if (!useDummyData) {
      if (viewMode === 'personal') {
        fetchSavedProjects();
      } else if (viewMode === 'organization' && user?.organization) {
        fetchOrganizationProjects();
      }
    } else {
      setIsLoading(false);
      setError(null);
    }
  }, [useDummyData, viewMode, user?.organization]);

  const fetchSavedProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projects = await projectService.getUserProjects();
      setSavedProjects(projects);
      
      // Fetch detailed data for metrics calculation
      await fetchDetailedProjects(projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load your projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailedProjects = async (projects: SavedProject[]) => {
    try {
      const detailedProjectsData = await Promise.all(
        projects.map(async (project) => {
          try {
            const detailedProject = await projectService.getProject(project.id);
            return {
              ...project,
              mitigationStrategy: detailedProject.mitigationStrategy || null
            };
          } catch (err) {
            console.warn(`Failed to fetch details for project ${project.id}:`, err);
            return project; // Return basic project data if detailed fetch fails
          }
        })
      );
      setDetailedProjects(detailedProjectsData);
    } catch (err) {
      console.error('Failed to fetch detailed projects:', err);
      setDetailedProjects(projects); // Fallback to basic project data
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (useDummyData) {
      // Don't actually delete dummy data, just show a message
      alert('Demo mode: Project deletion disabled for dummy data');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      setSavedProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  // Get the current projects data based on view mode
  const currentProjects = useDummyData 
    ? dummyProjects 
    : (viewMode === 'organization' ? orgProjects : savedProjects);
  
  // Use detailed projects for metrics calculation when available
  const metricsProjects = useDummyData 
    ? dummyProjects 
    : (viewMode === 'organization' ? orgProjects : detailedProjects);

  // Dashboard metrics calculations
  const getDashboardMetrics = () => {
    if (!metricsProjects || metricsProjects.length === 0) {
      return {
        totalProjects: 0,
        totalRiskMitigated: 0,
        averageRiskScore: 0,
        highRiskProjects: 0,
        riskDistribution: [],
        projectTypeDistribution: [],
        companyScaleDistribution: [],
        monthlyTrends: []
      };
    }

    const totalProjects = metricsProjects.length;
    
    // Calculate total risk score with proper null checks and validation
    const totalRiskScore = metricsProjects.reduce((sum, project) => {
      const risk = project.averageRisk || 0;
      const validRisk = isNaN(risk) ? 0 : Math.min(Math.max(risk, 0), 1); // Clamp between 0 and 1
      return sum + validRisk;
    }, 0);
    
    const averageRiskScore = totalProjects > 0 ? totalRiskScore / totalProjects : 0;
    const highRiskProjects = metricsProjects.filter(p => 
      p.riskLevel === 'high' || p.riskLevel === 'critical'
    ).length;
    
    // Calculate actual risk mitigation from saved mitigation strategies
    const totalRiskMitigated = useDummyData ? 
      // For dummy data, simulate reasonable mitigation percentages
      metricsProjects.reduce((sum, project) => {
        const risk = project.averageRisk || 0;
        // Simulate mitigation: higher risk projects get more mitigation
        const simulatedMitigation = risk > 0.6 ? 0.4 : risk > 0.3 ? 0.25 : 0.15;
        return sum + simulatedMitigation;
      }, 0) / totalProjects : 
      // For real data, calculate actual mitigation based on initial vs current risk
      (() => {
        const projectsWithMitigation = metricsProjects.filter(project => 
          project.mitigationStrategy?.initialRisk && project.mitigationStrategy?.finalRisk
        );
        

        
        if (projectsWithMitigation.length === 0) {
          return 0; // No mitigation has been done
        }
        
        // Calculate actual mitigation based on initial risk vs current risk
        const totalActualMitigation = projectsWithMitigation.reduce((sum, project) => {
          const initialRisk = project.mitigationStrategy?.initialRisk || 0;
          const currentRisk = project.averageRisk || 0;
          
          // Only count positive mitigation (risk reduction)
          if (initialRisk > currentRisk && initialRisk > 0) {
            const actualMitigationPercentage = ((initialRisk - currentRisk) / initialRisk);
            return sum + actualMitigationPercentage;
          }
          return sum; // No actual mitigation applied
        }, 0);
        
        return totalActualMitigation / projectsWithMitigation.length;
      })();

    // Risk level distribution
    const riskCounts = metricsProjects.reduce((acc, project) => {
      const level = project.riskLevel || 'unknown';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskDistribution = Object.entries(riskCounts).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: level === 'low' ? '#4caf50' : level === 'medium' ? '#ff9800' : '#f44336'
    }));

    // Project type distribution
    const typeCounts = metricsProjects.reduce((acc, project) => {
      const type = project.projectType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));

    // Company scale distribution
    const scaleCounts = metricsProjects.reduce((acc, project) => {
      const scale = project.companyScale || 'Unknown';
      acc[scale] = (acc[scale] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const companyScaleDistribution = Object.entries(scaleCounts).map(([scale, count]) => ({
      name: scale,
      projects: count
    }));

    // Monthly trends (last 6 months)
    const monthlyData = metricsProjects.reduce((acc, project) => {
      if (!project.createdAt) return acc;
      
      const month = new Date(project.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { month, projects: 0, avgRisk: 0, totalRisk: 0 };
      }
      acc[month].projects += 1;
      
      const risk = project.averageRisk || 0;
      const validRisk = isNaN(risk) ? 0 : risk;
      acc[month].totalRisk += validRisk;
      acc[month].avgRisk = acc[month].totalRisk / acc[month].projects;
      return acc;
    }, {} as Record<string, any>);

    const monthlyTrends = Object.values(monthlyData).slice(-6);

    return {
      totalProjects,
      totalRiskMitigated: Math.round((isNaN(totalRiskMitigated) ? 0 : totalRiskMitigated) * 100), // Convert to percentage
      averageRiskScore: Math.round((isNaN(averageRiskScore) ? 0 : averageRiskScore) * 100), // Convert to percentage
      highRiskProjects,
      riskDistribution,
      projectTypeDistribution,
      companyScaleDistribution,
      monthlyTrends
    };
  };

  const metrics = getDashboardMetrics();

  // PDF Export Functions
  const exportUserReportPDF = () => {
    if (!user) {
      alert('User data not available for PDF export');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Professional color palette
      const colors = {
        primary: [30, 41, 59] as [number, number, number],
        primaryLight: [51, 65, 85] as [number, number, number],
        accent: [20, 184, 166] as [number, number, number],
        accentLight: [45, 212, 191] as [number, number, number],
        text: [15, 23, 42] as [number, number, number],
        textSecondary: [71, 85, 105] as [number, number, number],
        background: [241, 245, 249] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        success: [22, 163, 74] as [number, number, number],
        warning: [217, 119, 6] as [number, number, number],
        error: [220, 38, 38] as [number, number, number],
      };

      const fonts = {
        body: 'helvetica',
        bold: 'helvetica'
      };

      const safeText = (text: any, fallback = 'N/A'): string => {
        if (text === undefined || text === null) return fallback;
        return String(text).replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
      };

      const drawHeaderOnEveryPage = () => {
        // Header Background
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(...colors.accent);
        doc.rect(0, 40, pageWidth, 2, 'F');

        // Logo
        doc.setTextColor(...colors.white);
        doc.setFont(fonts.bold, 'bold');
        doc.setFontSize(10);
        doc.text('CYBER RISK', margin, 20);
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.text('ASSESSMENT PLATFORM', margin, 27);

        // Main Title
        doc.setTextColor(...colors.white);
        doc.setFont(fonts.bold, 'bold');
        doc.setFontSize(16);
        doc.text('Personal Risk Assessment Report', pageWidth / 2, 25, { align: 'center' });

        // Report Metadata
        const reportDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.text(`User: ${safeText(user.name)}`, pageWidth - margin, 15, { align: 'right' });
        doc.text(`Date: ${reportDate}`, pageWidth - margin, 22, { align: 'right' });
        doc.text(`Report ID: ${Date.now().toString().slice(-8)}`, pageWidth - margin, 29, { align: 'right' });
      };

      const drawFooterOnEveryPage = (data: any) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...colors.textSecondary);

        // Footer Line
        doc.setDrawColor(...colors.accent);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
        
        // Footer Text
        const footerText = 'Confidential | Personal Risk Assessment Report';
        doc.text(footerText, margin, pageHeight - 10);
        const pageNumText = `Page ${data.pageNumber} of ${pageCount}`;
        doc.text(pageNumText, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      const addSectionHeader = (title: string, subtitle: string) => {
        const currentY = (doc as any).lastAutoTable?.finalY || 50;
        
        autoTable(doc, {
          startY: currentY + 15,
          body: [[{ content: title, styles: { cellPadding: { top: 8, bottom: 2, left: 8 } } }]],
          theme: 'plain',
          styles: {
            font: fonts.bold,
            fontStyle: 'bold',
            fontSize: 14,
            textColor: colors.primary,
          },
          didDrawCell: (data: any) => {
            doc.setFillColor(...colors.accent);
            doc.rect(margin, data.cell.y, 3, data.cell.height, 'F');
          },
        });
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY,
          body: [[{ content: subtitle, styles: { cellPadding: { top: 0, bottom: 8, left: 8 } } }]],
          theme: 'plain',
          styles: {
            font: fonts.body,
            fontSize: 10,
            textColor: colors.textSecondary,
          },
        });
      };

      // Start PDF Generation
      const startY = 50;
      
      // Executive Summary
      autoTable(doc, {
        startY: startY,
        body: [
          [
            { content: `Total Projects\n${metrics.totalProjects}`, styles: { halign: 'center' } },
            { content: `Risk Mitigated\n${metrics.totalRiskMitigated}%`, styles: { halign: 'center' } },
            { content: `Average Risk\n${metrics.averageRiskScore}%`, styles: { halign: 'center' } },
            { content: `High Risk Projects\n${metrics.highRiskProjects}`, styles: { halign: 'center' } },
          ]
        ],
        theme: 'grid',
        styles: { font: fonts.bold, fontSize: 12, fontStyle: 'bold', cellPadding: 8, valign: 'middle' },
        headStyles: { fillColor: colors.primary, textColor: colors.white },
        didDrawPage: (data) => {
          drawHeaderOnEveryPage();
          drawFooterOnEveryPage(data);
        }
      });

      // Risk Distribution
      if (metrics.riskDistribution.length > 0) {
        addSectionHeader('Risk Level Distribution', 'Breakdown of risk levels across all projects');
        const riskBody = metrics.riskDistribution.map((item: any) => [
          item.name,
          item.value.toString(),
          `${((item.value / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Risk Level', 'Count', 'Percentage']],
          body: riskBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primary, textColor: colors.white },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
              const riskLevel = data.cell.text[0].toLowerCase();
              if (riskLevel === 'high' || riskLevel === 'critical') {
                doc.setTextColor(...colors.error);
                doc.setFont(fonts.body, 'bold');
              } else if (riskLevel === 'medium') {
                doc.setTextColor(...colors.warning);
                doc.setFont(fonts.body, 'bold');
              } else {
                doc.setTextColor(...colors.success);
                doc.setFont(fonts.body, 'bold');
              }
            }
          }
        });
      }

      // Project Type Distribution
      if (metrics.projectTypeDistribution.length > 0) {
        addSectionHeader('Project Type Analysis', 'Distribution of projects by type');
        const typeBody = metrics.projectTypeDistribution.map((item: any) => [
          item.name,
          item.value.toString(),
          `${((item.value / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Project Type', 'Count', 'Percentage']],
          body: typeBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // Company Scale Distribution
      if (metrics.companyScaleDistribution.length > 0) {
        addSectionHeader('Company Scale Analysis', 'Distribution of projects by company scale');
        const scaleBody = metrics.companyScaleDistribution.map((item: any) => [
          item.name,
          item.projects.toString(),
          `${((item.projects / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Company Scale', 'Count', 'Percentage']],
          body: scaleBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // Project Details
      if (currentProjects.length > 0) {
        addSectionHeader('Project Portfolio', 'Detailed view of all assessed projects');
        const projectBody = currentProjects.map((project: any) => [
          safeText(project.projectName),
          safeText(project.projectType),
          safeText(project.companyScale),
          `${((project.averageRisk || 0) * 100).toFixed(1)}%`,
          (project.riskLevel || 'unknown').toUpperCase(),
          new Date(project.updatedAt).toLocaleDateString()
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Project Name', 'Type', 'Scale', 'Risk Score', 'Risk Level', 'Last Updated']],
          body: projectBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primary, textColor: colors.white },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            5: { cellWidth: 'auto' }
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
              const riskLevel = data.cell.text[0].toLowerCase();
              if (riskLevel === 'high' || riskLevel === 'critical') {
                doc.setTextColor(...colors.error);
                doc.setFont(fonts.body, 'bold');
              } else if (riskLevel === 'medium') {
                doc.setTextColor(...colors.warning);
                doc.setFont(fonts.body, 'bold');
              } else {
                doc.setTextColor(...colors.success);
                doc.setFont(fonts.body, 'bold');
              }
            }
          }
        });
      }

      // Monthly Trends
      if (metrics.monthlyTrends.length > 0) {
        addSectionHeader('Performance Trends', 'Monthly project creation and risk trends');
        const trendsBody = metrics.monthlyTrends.map((trend: any) => [
          trend.month,
          trend.projects.toString(),
          `${(trend.avgRisk * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Month', 'Projects Created', 'Average Risk']],
          body: trendsBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // Add page numbers to all pages
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawFooterOnEveryPage({ pageNumber: i });
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const userName = safeText(user.name, 'user').toLowerCase().replace(/\s/g, '-');
      doc.save(`personal-risk-report-${userName}-${dateStr}.pdf`);

    } catch (error) {
      console.error('User PDF Generation Error:', error);
      alert('Failed to generate user report. See console for details.');
    }
  };

  const exportOrganizationReportPDF = () => {
    if (!user?.organization) {
      alert('Organization data not available for PDF export');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Professional color palette
      const colors = {
        primary: [30, 41, 59] as [number, number, number],
        primaryLight: [51, 65, 85] as [number, number, number],
        accent: [20, 184, 166] as [number, number, number],
        accentLight: [45, 212, 191] as [number, number, number],
        text: [15, 23, 42] as [number, number, number],
        textSecondary: [71, 85, 105] as [number, number, number],
        background: [241, 245, 249] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        success: [22, 163, 74] as [number, number, number],
        warning: [217, 119, 6] as [number, number, number],
        error: [220, 38, 38] as [number, number, number],
      };

      const fonts = {
        body: 'helvetica',
        bold: 'helvetica'
      };

      const safeText = (text: any, fallback = 'N/A'): string => {
        if (text === undefined || text === null) return fallback;
        return String(text).replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
      };

      const drawHeaderOnEveryPage = () => {
        // Header Background
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(...colors.accent);
        doc.rect(0, 40, pageWidth, 2, 'F');

        // Logo
        doc.setTextColor(...colors.white);
        doc.setFont(fonts.bold, 'bold');
        doc.setFontSize(10);
        doc.text('CYBER RISK', margin, 20);
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.text('ASSESSMENT PLATFORM', margin, 27);

        // Main Title
        doc.setTextColor(...colors.white);
        doc.setFont(fonts.bold, 'bold');
        doc.setFontSize(16);
        doc.text('Organization Risk Assessment Report', pageWidth / 2, 25, { align: 'center' });

        // Report Metadata
        const reportDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.text(`Organization: ${safeText(user.organization?.name)}`, pageWidth - margin, 15, { align: 'right' });
        doc.text(`Date: ${reportDate}`, pageWidth - margin, 22, { align: 'right' });
        doc.text(`Report ID: ${Date.now().toString().slice(-8)}`, pageWidth - margin, 29, { align: 'right' });
      };

      const drawFooterOnEveryPage = (data: any) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFont(fonts.body, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...colors.textSecondary);

        // Footer Line
        doc.setDrawColor(...colors.accent);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
        
        // Footer Text
        const footerText = 'Confidential | Organization Risk Assessment Report';
        doc.text(footerText, margin, pageHeight - 10);
        const pageNumText = `Page ${data.pageNumber} of ${pageCount}`;
        doc.text(pageNumText, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      const addSectionHeader = (title: string, subtitle: string) => {
        const currentY = (doc as any).lastAutoTable?.finalY || 50;
        
        autoTable(doc, {
          startY: currentY + 15,
          body: [[{ content: title, styles: { cellPadding: { top: 8, bottom: 2, left: 8 } } }]],
          theme: 'plain',
          styles: {
            font: fonts.bold,
            fontStyle: 'bold',
            fontSize: 14,
            textColor: colors.primary,
          },
          didDrawCell: (data: any) => {
            doc.setFillColor(...colors.accent);
            doc.rect(margin, data.cell.y, 3, data.cell.height, 'F');
          },
        });
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY,
          body: [[{ content: subtitle, styles: { cellPadding: { top: 0, bottom: 8, left: 8 } } }]],
          theme: 'plain',
          styles: {
            font: fonts.body,
            fontSize: 10,
            textColor: colors.textSecondary,
          },
        });
      };

      // Start PDF Generation
      const startY = 50;
      
      // Executive Summary
      autoTable(doc, {
        startY: startY,
        body: [
          [
            { content: `Total Projects\n${metrics.totalProjects}`, styles: { halign: 'center' } },
            { content: `Risk Mitigated\n${metrics.totalRiskMitigated}%`, styles: { halign: 'center' } },
            { content: `Average Risk\n${metrics.averageRiskScore}%`, styles: { halign: 'center' } },
            { content: `High Risk Projects\n${metrics.highRiskProjects}`, styles: { halign: 'center' } },
          ]
        ],
        theme: 'grid',
        styles: { font: fonts.bold, fontSize: 12, fontStyle: 'bold', cellPadding: 8, valign: 'middle' },
        headStyles: { fillColor: colors.primary, textColor: colors.white },
        didDrawPage: (data) => {
          drawHeaderOnEveryPage();
          drawFooterOnEveryPage(data);
        }
      });

      // Team Performance
      if (orgMetrics && orgMetrics.projectsByUser) {
        addSectionHeader('Team Performance', 'Project contributions by team members');
        const teamBody = Object.entries(orgMetrics.projectsByUser).map(([userName, count]) => {
          const avgRisk = orgMetrics.averageRiskByUser?.[userName] || 0;
          return [
            safeText(userName),
            count.toString(),
            `${(avgRisk * 100).toFixed(1)}%`
          ];
        });
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Team Member', 'Projects', 'Avg Risk Score']],
          body: teamBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primary, textColor: colors.white },
          columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' }
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 2) {
              const riskValue = parseFloat(data.cell.text[0]);
              if (riskValue >= 70) {
                doc.setTextColor(...colors.error);
                doc.setFont(fonts.body, 'bold');
              } else if (riskValue >= 40) {
                doc.setTextColor(...colors.warning);
                doc.setFont(fonts.body, 'bold');
              } else {
                doc.setTextColor(...colors.success);
                doc.setFont(fonts.body, 'bold');
              }
            }
          }
        });
      }

      // Risk Distribution
      if (metrics.riskDistribution.length > 0) {
        addSectionHeader('Organization Risk Distribution', 'Breakdown of risk levels across all projects');
        const riskBody = metrics.riskDistribution.map((item: any) => [
          item.name,
          item.value.toString(),
          `${((item.value / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Risk Level', 'Count', 'Percentage']],
          body: riskBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primary, textColor: colors.white },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
              const riskLevel = data.cell.text[0].toLowerCase();
              if (riskLevel === 'high' || riskLevel === 'critical') {
                doc.setTextColor(...colors.error);
                doc.setFont(fonts.body, 'bold');
              } else if (riskLevel === 'medium') {
                doc.setTextColor(...colors.warning);
                doc.setFont(fonts.body, 'bold');
              } else {
                doc.setTextColor(...colors.success);
                doc.setFont(fonts.body, 'bold');
              }
            }
          }
        });
      }

      // Project Type Distribution
      if (metrics.projectTypeDistribution.length > 0) {
        addSectionHeader('Project Type Analysis', 'Distribution of projects by type across organization');
        const typeBody = metrics.projectTypeDistribution.map((item: any) => [
          item.name,
          item.value.toString(),
          `${((item.value / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Project Type', 'Count', 'Percentage']],
          body: typeBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // Company Scale Distribution
      if (metrics.companyScaleDistribution.length > 0) {
        addSectionHeader('Company Scale Analysis', 'Distribution of projects by company scale');
        const scaleBody = metrics.companyScaleDistribution.map((item: any) => [
          item.name,
          item.projects.toString(),
          `${((item.projects / metrics.totalProjects) * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Company Scale', 'Count', 'Percentage']],
          body: scaleBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // All Organization Projects
      if (currentProjects.length > 0) {
        addSectionHeader('Organization Project Portfolio', 'Complete view of all assessed projects');
        const projectBody = currentProjects.map((project: any) => [
          safeText(project.projectName),
          safeText(project.userId?.name || 'Unknown'),
          safeText(project.projectType),
          safeText(project.companyScale),
          `${((project.averageRisk || 0) * 100).toFixed(1)}%`,
          (project.riskLevel || 'unknown').toUpperCase(),
          new Date(project.updatedAt).toLocaleDateString()
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Project Name', 'Team Member', 'Type', 'Scale', 'Risk Score', 'Risk Level', 'Updated']],
          body: projectBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primary, textColor: colors.white },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 'auto' },
            4: { halign: 'right' },
            5: { halign: 'center' },
            6: { cellWidth: 'auto' }
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 5) {
              const riskLevel = data.cell.text[0].toLowerCase();
              if (riskLevel === 'high' || riskLevel === 'critical') {
                doc.setTextColor(...colors.error);
                doc.setFont(fonts.body, 'bold');
              } else if (riskLevel === 'medium') {
                doc.setTextColor(...colors.warning);
                doc.setFont(fonts.body, 'bold');
              } else {
                doc.setTextColor(...colors.success);
                doc.setFont(fonts.body, 'bold');
              }
            }
          }
        });
      }

      // Monthly Trends
      if (metrics.monthlyTrends.length > 0) {
        addSectionHeader('Organization Performance Trends', 'Monthly project creation and risk trends');
        const trendsBody = metrics.monthlyTrends.map((trend: any) => [
          trend.month,
          trend.projects.toString(),
          `${(trend.avgRisk * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          head: [['Month', 'Projects Created', 'Average Risk']],
          body: trendsBody,
          theme: 'striped',
          headStyles: { fillColor: colors.primaryLight, textColor: colors.white }
        });
      }

      // Add page numbers to all pages
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawFooterOnEveryPage({ pageNumber: i });
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const orgName = safeText(user.organization?.name, 'organization').toLowerCase().replace(/\s/g, '-');
      doc.save(`organization-risk-report-${orgName}-${dateStr}.pdf`);

    } catch (error) {
      console.error('Organization PDF Generation Error:', error);
      alert('Failed to generate organization report. See console for details.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProjectClick = (projectId: string) => {
    if (useDummyData) {
      alert('Demo mode: Project navigation disabled for dummy data');
      return;
    }
    // Navigate to project details page
    navigate(`/project-details/${projectId}`);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1">
              Reports & Research
            </Typography>
            {user?.organization && (
              <Typography variant="subtitle1" color="text.secondary">
                {user.organization.name}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Export Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportUserReportPDF}
                size="small"
                sx={{ minWidth: 'auto' }}
              >
                Export Personal Report
              </Button>
              {isManager() && user?.organization && viewMode === 'organization' && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={exportOrganizationReportPDF}
                  size="small"
                  sx={{ minWidth: 'auto' }}
                >
                  Export Organization Report
                </Button>
              )}
            </Box>
            
            {/* Dev Tool Toggle */}
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.50', border: '2px dashed', borderColor: 'grey.300' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeveloperModeIcon color="primary" />
                <FormControlLabel
                  control={
                    <Switch
                      checked={useDummyData}
                      onChange={(e) => setUseDummyData(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {useDummyData ? 'Demo Data' : 'Live Data'}
                    </Typography>
                  }
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {useDummyData ? 'Showing presentation data' : 'Showing real user data'}
              </Typography>
            </Paper>
          </Box>
        </Box>
        
        {/* View Mode Tabs - Only show for managers */}
        {isManager() && user?.organization && (
          <>
            <Paper elevation={1} sx={{ mb: 4 }}>
              <Tabs
                value={viewMode}
                onChange={(e, newValue) => setViewMode(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label="My Projects"
                  value="personal"
                />
                <Tab
                  icon={<GroupIcon />}
                  iconPosition="start"
                  label="Organization Overview"
                  value="organization"
                />
              </Tabs>
            </Paper>
            
            {/* Organization Management Card - Only in organization view */}
            {viewMode === 'organization' && user.organization && (
              <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Organization Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share the organization code with team members to invite them
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupAddIcon color="primary" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Organization Code
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                              {user.organization?.code || ''}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (user.organization?.code) {
                                  navigator.clipboard.writeText(user.organization.code);
                                  setCodeCopied(true);
                                  setTimeout(() => setCodeCopied(false), 2000);
                                }
                              }}
                              title="Copy organization code"
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </Paper>
            )}
          </>
        )}
        
        {/* Dashboard Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Dashboard Overview
          </Typography>
          
          {(viewMode === 'personal' ? isLoading : orgLoading) && !useDummyData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (!useDummyData && error) ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : currentProjects.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No data available yet
              </Typography>
              <Typography color="text.secondary">
                Complete risk assessments to see your dashboard metrics
              </Typography>
            </Paper>
          ) : (
            <Box>
              {/* Key Metrics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {metrics.totalProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Projects
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {metrics.totalRiskMitigated}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Risk Mitigated
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {metrics.averageRiskScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Risk Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {metrics.highRiskProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High Risk Projects
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Charts */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Risk Level Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Risk Level Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={metrics.riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {metrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Project Type Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Projects by Type
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.projectTypeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Company Scale Distribution */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Projects by Company Scale
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.companyScaleDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="projects" fill="#4caf50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Monthly Trends */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Monthly Risk Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metrics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="projects" stroke="#1976d2" name="Projects Created" />
                        <Line type="monotone" dataKey="avgRisk" stroke="#f44336" name="Avg Risk Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Projects Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {viewMode === 'organization' ? 'Organization Projects' : 'Your Saved Projects'}
          </Typography>
          
          {(viewMode === 'personal' ? isLoading : orgLoading) && !useDummyData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (!useDummyData && error) ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : currentProjects.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved projects yet
              </Typography>
              <Typography color="text.secondary">
                Complete a risk assessment to save your first project
              </Typography>
            </Paper>
          ) : (
            <Box>
              {viewMode === 'organization' && orgMetrics && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* User Performance Overview */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Projects by Team Member
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {orgMetrics.projectsByUser && Object.keys(orgMetrics.projectsByUser).length > 0 ? (
                          Object.entries(orgMetrics.projectsByUser).map(([userName, count]) => (
                            <Box key={userName} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">{userName}</Typography>
                              <Chip label={`${count} project${count > 1 ? 's' : ''}`} size="small" />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No project data available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Average Risk by User */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Average Risk Score by Team Member
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {orgMetrics.averageRiskByUser && Object.keys(orgMetrics.averageRiskByUser).length > 0 ? (
                          Object.entries(orgMetrics.averageRiskByUser).map(([userName, avgRisk]) => {
                            const riskValue = typeof avgRisk === 'number' && !isNaN(avgRisk) ? avgRisk : 0;
                            return (
                              <Box key={userName} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">{userName}</Typography>
                                  <Typography variant="body2" color={riskValue < 0.4 ? 'success.main' : riskValue < 0.7 ? 'warning.main' : 'error.main'}>
                                    {(riskValue * 100).toFixed(1)}%
                                  </Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                                  <Box
                                    sx={{
                                      width: `${riskValue * 100}%`,
                                      bgcolor: riskValue < 0.4 ? 'success.main' : riskValue < 0.7 ? 'warning.main' : 'error.main',
                                      borderRadius: 1,
                                      height: '100%',
                                      transition: 'width 0.5s ease-in-out'
                                    }}
                                  />
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No risk data available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentProjects.map((project: any) => (
                  <Paper 
                    key={project.id} 
                    elevation={2} 
                    sx={{ 
                      p: 3,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {project.projectName || 'Unnamed Project'}
                        </Typography>
                        {viewMode === 'organization' && project.userId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {project.userId.name || 'Unknown User'} ({project.userId.email || 'No email'})
                            </Typography>
                          </Box>
                        )}
                        <Typography color="text.secondary" gutterBottom>
                          {project.updatedAt ? formatDate(project.updatedAt) : 'No date'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {project.projectType || 'Unknown Type'} • {project.companyScale || 'Unknown Scale'} Company
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={`${(project.riskLevel || 'unknown').toUpperCase()} RISK`}
                          size="small"
                          color={getRiskLevelColor(project.riskLevel || 'unknown') as any}
                        />
                        {viewMode === 'personal' && (
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Risk Score: {((project.averageRisk || 0) * 100).toFixed(1)}%
                      </Typography>
                      {viewMode === 'organization' && (
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleTimeString() : 'Unknown'}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      
      {/* Snackbar for code copy notification */}
      <Snackbar
        open={codeCopied}
        autoHideDuration={2000}
        onClose={() => setCodeCopied(false)}
        message="Organization code copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default Reports; 