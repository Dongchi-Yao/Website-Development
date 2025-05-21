import { Box, Container, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';

const AnimatedShapes = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: '-15%',
        top: 0,
        width: '90%',
        height: '100%',
        overflow: 'hidden',
        opacity: 0.3,
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        initial="hidden"
        animate="visible"
      >
        {/* Glowing background effect */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
          <filter id="glowEffect">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main rotating container */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* Central hexagon */}
          <motion.path
            d="M400,200 L450,250 L450,350 L400,400 L350,350 L350,250 Z"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            filter="url(#glowEffect)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Orbital rings */}
          <motion.circle
            cx="400"
            cy="300"
            r="150"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeDasharray="4 4"
            filter="url(#glowEffect)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* Dynamic connections */}
          {[0, 60, 120, 180, 240, 300].map((angle, index) => (
            <motion.g key={index}>
              <motion.path
                d={`M400,300 L${400 + Math.cos(angle * Math.PI / 180) * 200},${300 + Math.sin(angle * Math.PI / 180) * 200}`}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2"
                filter="url(#glowEffect)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
              <motion.circle
                cx={400 + Math.cos(angle * Math.PI / 180) * 200}
                cy={300 + Math.sin(angle * Math.PI / 180) * 200}
                r="6"
                fill="#06B6D4"
                filter="url(#glowEffect)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 1 }}
              />
            </motion.g>
          ))}

          {/* Floating particles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <motion.circle
              key={`particle-${index}`}
              cx={400 + Math.cos(angle * Math.PI / 180) * 100}
              cy={300 + Math.sin(angle * Math.PI / 180) * 100}
              r="3"
              fill="#06B6D4"
              filter="url(#glowEffect)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}

          {/* Outer hexagon */}
          <motion.path
            d="M400,100 L500,150 L500,350 L400,400 L300,350 L300,150 Z"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeDasharray="4 4"
            filter="url(#glowEffect)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </motion.g>
      </motion.svg>
    </Box>
  );
};

const SecondAnimatedShapes = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: '-45%',
        top: 0,
        width: '90%',
        height: '100%',
        overflow: 'hidden',
        opacity: 0.45,
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        initial="hidden"
        animate="visible"
      >
        <defs>
          <filter id="glowEffect2">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {/* Spiral structure */}
          <motion.path
            d="M400,300 Q500,200 600,300 T800,300"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            filter="url(#glowEffect2)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Concentric circles */}
          {[1, 2, 3].map((scale, index) => (
            <motion.circle
              key={`circle-${index}`}
              cx="400"
              cy="300"
              r={100 * scale}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeDasharray="2 4"
              filter="url(#glowEffect2)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.3 }}
            />
          ))}

          {/* Wave patterns */}
          {[0, 1, 2].map((index) => (
            <motion.path
              key={`wave-${index}`}
              d={`M300,${300 + index * 50} Q400,${250 + index * 50} 500,${300 + index * 50}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              filter="url(#glowEffect2)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.4 }}
            />
          ))}

          {/* Pulsing nodes */}
          {[0, 72, 144, 216, 288].map((angle, index) => (
            <motion.circle
              key={`node-${index}`}
              cx={400 + Math.cos(angle * Math.PI / 180) * 150}
              cy={300 + Math.sin(angle * Math.PI / 180) * 150}
              r="5"
              fill="#06B6D4"
              filter="url(#glowEffect2)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}

          {/* Floating lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <motion.line
              key={`line-${index}`}
              x1={400 + Math.cos(angle * Math.PI / 180) * 50}
              y1={300 + Math.sin(angle * Math.PI / 180) * 50}
              x2={400 + Math.cos(angle * Math.PI / 180) * 100}
              y2={300 + Math.sin(angle * Math.PI / 180) * 100}
              stroke="#06B6D4"
              strokeWidth="2"
              filter="url(#glowEffect2)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1
              }}
            />
          ))}
        </motion.g>
      </motion.svg>
    </Box>
  );
};

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)',
  color: 'white',
  padding: theme.spacing(10, 0, 12, 0),
  textAlign: 'left',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  minHeight: '420px',
  position: 'relative',
  overflow: 'hidden',
}));

const ModuleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
  padding: theme.spacing(0.5),
}));

const NewsTicker = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  background: theme.palette.background.paper,
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const Home = () => {
  const modules = [
    {
      title: 'Cybersecurity Topic Modeling',
      description: 'Upload or paste text documents to discover hidden topics.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      path: '/topic-modeling',
    },
    {
      title: 'Cyber Risk Identification',
      description: 'Chat with an AI to identify potential cyber threats.',
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      path: '/risk-identification',
    },
    {
      title: 'Risk Quantification',
      description: 'Enter project data and calculate your cyber risk score.',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/risk-quantification',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <AnimatedShapes />
        <SecondAnimatedShapes />
        <Box sx={{ maxWidth: '700px', mx: { xs: 2, md: 12 }, px: { xs: 2, md: 0 }, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.5rem' }, lineHeight: 1.1 }}>
              Manage Cyber Risks in Construction Projects
            </Typography>
            <Typography variant="h5" paragraph sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 400, mb: 4 }}>
              Proactively identify vulnerabilities, assess threats, and enhance defenses
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/risk-identification"
              sx={{ mt: 2, px: 5, py: 1.5, fontWeight: 700, fontSize: '1.15rem', borderRadius: 3, boxShadow: 2 }}
            >
              Start Now
            </Button>
          </motion.div>
        </Box>
      </HeroSection>

      <Box sx={{ width: '100%', py: 8, px: { xs: 2, md: 4, lg: 8 }, boxSizing: 'border-box', maxWidth: '100vw', mx: 'auto' }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Quick Overview of Cyber Risk
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            'Construction projects face heightened cybersecurity threats as digital tools and IoT devices proliferate.',
            'Vulnerabilities in building management systems and project data can lead to costly disruptions or data breaches.',
            'Phishing scams and ransomware attacks threaten timelines, finances, and reputations.',
            'Large, complex supply chains amplify risks of unauthorized access.',
          ].map((text, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Typography variant="body1" paragraph>
                  {text}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Modules
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {modules.map((module, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ModuleCard>
                  <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                      {module.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h3" align="center" sx={{ fontSize: '1rem', mb: 0.5 }}>
                      {module.title}
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {module.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 1, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={module.path}
                      size="small"
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </ModuleCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 