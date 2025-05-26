import { Container, Typography, Card, CardContent, CardMedia, Box, Link } from '@mui/material';

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
    </Container>
  );
};

export default About; 