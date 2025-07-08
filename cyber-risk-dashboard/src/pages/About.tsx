import { Container, Typography, Card, CardContent, CardMedia, Box, Link, Paper, Chip, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const About = () => {
  const teamMembers = [
    {
      name: "Dongchi (Daniel) Yao",
      role: "Postdoctoral Associate",
      description: "Ph.D. in Computer Science, New York University. Principal researcher in cyber risk assessment methodologies and quantitative risk modeling frameworks.",
      image: "/daniel.jfif",
      linkedin: "https://www.linkedin.com/in/dongchi-yao/"
    },
    {
      name: "Begad Elfackrany",
      role: "Research Assistant & Developer",
      description: "Computer Science, New York University. Technical lead for the Cyber Risk Dashboard implementation, specializing in full-stack development and research integration.",
      image: "/Begad.jfif",
      linkedin: "https://www.linkedin.com/in/begad-elfackrany/"
    },
    {
      name: "Borja Garcia de Soto",
      role: "Professor & Head of SMART Labs",
      description: "Director, SMART Labs, New York University. Principal Investigator overseeing research initiatives in cyber risk assessment and digital transformation.",
      image: "/Borja.jpg",
      linkedin: "https://www.linkedin.com/in/garciadesoto/"
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
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        About Us
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
        Meet the team behind the Cyber Risk Dashboard
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 4, 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        '& > *': {
          flex: '1 1 350px',
          maxWidth: '350px',
          minWidth: '300px'
        }
      }}>
        {teamMembers.map((member) => (
          <Card 
            key={member.name}
            sx={{ 
              height: '600px',
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              }
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={member.image}
              alt={member.name}
              sx={{ 
                objectFit: 'cover',
                height: '300px'
              }}
            />
            <CardContent sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3
            }}>
              <Box>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" align="center" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {member.description}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  LinkedIn Profile
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Research Publications Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Research Publications
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
          Our contributions to cyber risk assessment in the construction industry
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

export default About; 