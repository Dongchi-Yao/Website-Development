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
      title: "Cyber Risk Trends 2025",
      status: "Published",
      date: "January 2024",
      journal: "Journal of Cybersecurity",
      hasDownload: true
    },
    {
      title: "Construction Cyber Attacks: Case Studies",
      status: "Published",
      date: "March 2024",
      journal: "International Security Review",
      hasDownload: true
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

  const handleDownload = (title: string) => {
    // TODO: Implement actual PDF download
    console.log(`Downloading ${title}`);
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
                  onClick={() => handleDownload(paper.title)}
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