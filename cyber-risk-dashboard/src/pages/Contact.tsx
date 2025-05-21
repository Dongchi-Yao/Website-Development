import { Container, Typography } from '@mui/material';

const Contact = () => (
  <Container maxWidth="lg" sx={{ py: 8 }}>
    <Typography variant="h3" component="h1" gutterBottom align="center">
      Contact Us
    </Typography>
    <Typography variant="h6" color="text.secondary" paragraph align="center">
      Get in touch with our team
    </Typography>
  </Container>
);

export default Contact; 