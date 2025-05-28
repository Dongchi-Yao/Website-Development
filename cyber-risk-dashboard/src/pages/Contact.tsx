import { Box, Container, Typography, Button, Grid, Paper, Link } from '@mui/material';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          {/* Lab Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                S.M.A.R.T. Construction Research Group
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Our goal is to generate high-impact scholarly work while ensuring a pragmatic viewpoint to guarantee a successful integration in the way we manage the planning, design, construction, operation and maintenance, inspection, retrofit, and repair of the infrastructure and communities of the future.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Research Areas:
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li><strong>S</strong>ustainable and resilient construction</li>
                <li><strong>M</strong>odularization and lean construction</li>
                <li><strong>A</strong>rtificial intelligence</li>
                <li><strong>R</strong>obotic systems and automation</li>
                <li><strong>T</strong>echnology integration and information modeling</li>
              </Typography>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Typography>
                    <strong>Email:</strong>{' '}
                    <Link href="mailto:garcia.de.soto@nyu.edu">
                      garcia.de.soto@nyu.edu
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Typography>
                    <strong>Phone:</strong>{' '}
                    <Link href="tel:+97126284978">
                      +971 2-628-4978
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Typography>
                    <strong>Location:</strong> New York University Abu Dhabi
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LanguageIcon color="primary" />
                  <Typography>
                    <strong>Lab Website:</strong>{' '}
                    <Link 
                      href="https://nyuad.nyu.edu/en/research/faculty-labs-and-projects/smart-construction-research-group.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit our lab website
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinkedInIcon color="primary" />
                  <Typography>
                    <strong>LinkedIn:</strong>{' '}
                    <Link 
                      href="https://www.linkedin.com/company/smart-construction-research-group/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Follow us on LinkedIn
                    </Link>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Lab Director
                </Typography>
                <Typography variant="body1">
                  Borja García de Soto, PhD, PE<br />
                  Associate Professor of Civil & Urban Engineering
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Contact; 