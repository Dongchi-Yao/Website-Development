import { Container, Typography, Box, Paper, Chip, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  const sampleProjects = [
    {
      title: "Project A",
      description: "Enterprise Infrastructure Security Assessment",
      date: "March 2024"
    },
    {
      title: "Project B",
      description: "Cloud Migration Risk Analysis",
      date: "April 2024"
    },
    {
      title: "Project C",
      description: "IoT Security Framework Implementation",
      date: "Q2 2024"
    }
  ];

  const researchPapers = [
    {
      title: "Mitigating Malicious Insider Threats to Common Data Environments in the Architecture, Engineering, and Construction Industry",
      status: "Published",
      date: "January 2025",
      journal: "Journal of Cybersecurity and Privacy",
      hasDownload: true,
      pdfPath: "/Mitigating Malicious Insider Threats to Common Data Environments in the Architecture, Engineering, and Construction Industry An Incomplete Information Game Approach.pdf"
    },
    {
      title: "Enhancing cyber risk identification in the construction industry using language models",
      status: "Published",
      date: "September 2024",
      journal: "Automation in Construction",
      hasDownload: true,
      pdfPath: "/Enhancing cyber risk identification in the construction industry using language models.pdf"
    },
    {
      title: "Integrating Machine Learning for Cyber Risk Analysis in Construction 4.0",
      status: "Published",
      date: "August 2024",
      journal: "International Conference on Computing in Civil and Building Engineering",
      hasDownload: true,
      pdfPath: "/Integrating Machine Learning for Cyber Risk Analysis in Construction 4.0.pdf"
    },
    {
      title: "Cyber Risk Assessment Framework for the Construction Industry Using Machine Learning Techniques",
      status: "Published",
      date: "May 2024",
      journal: "Buildings",
      hasDownload: true,
      pdfPath: "/Cyber Risk Assessment Framework for the Construction Industry Using Machine Learning Techniques.pdf"
    },
    {
      title: "A corpus database for cybersecurity topic modeling in the construction industry",
      status: "Published",
      date: "2023",
      journal: "ISARC. Proceedings of the International Symposium on Automation and Robotics in Construction",
      hasDownload: true,
      pdfPath: "/Identifying cyber risk factors associated with construction projects.pdf"
    },
    {
      title: "Smart Construction: Cybersecurity Framework for Modern Building Projects",
      status: "Draft",
      date: "April 2024",
      journal: "In Development",
      hasDownload: false
    }
  ];

  const handleProjectClick = (projectTitle: string) => {
    // Navigate to project details page
    navigate(`/project-details/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleDownload = (title: string, pdfPath?: string) => {
    if (!pdfPath) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    // Remove the leading slash for the PDF path
    link.href = pdfPath.startsWith('/') ? pdfPath.substring(1) : pdfPath;
    // Use the original PDF filename instead of generating one
    link.download = pdfPath.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Reports & Research
      </Typography>
      
      {/* Projects Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Analyzed Projects
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sampleProjects.map((project, index) => (
            <Paper 
              key={index} 
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
              onClick={() => handleProjectClick(project.title)}
            >
              <Typography variant="h6" gutterBottom>
                {project.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {project.date}
              </Typography>
              <Typography>
                {project.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Research Papers Section */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Research Publications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {researchPapers.map((paper, index) => (
            <Paper key={index} elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">{paper.title}</Typography>
                <Chip 
                  label={paper.status} 
                  color={paper.status === "Published" ? "success" : "default"}
                />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                {paper.date} • {paper.journal}
              </Typography>
              {paper.hasDownload && (
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(paper.title, paper.pdfPath)}
                  sx={{ mt: 1 }}
                >
                  Download PDF
                </Button>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Reports; 