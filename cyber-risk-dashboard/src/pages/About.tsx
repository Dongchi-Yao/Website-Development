import { Container, Typography } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        About Us
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph align="center">
        Learn more about our mission and team
      </Typography>
    </Container>
  );
};

export default About; 