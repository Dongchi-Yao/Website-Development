import { Box, Container, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import React, { useRef, useEffect, useState } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

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

const ThirdAnimatedShapes = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: '-25%',
        top: '20%',
        width: '70%',
        height: '60%',
        overflow: 'hidden',
        opacity: 0.35,
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
          <filter id="glowEffect3">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 180 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Diamond pattern */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <motion.path
              key={`diamond-${index}`}
              d={`M400,300 L${400 + Math.cos(angle * Math.PI / 180) * 100},${300 + Math.sin(angle * Math.PI / 180) * 100} 
                  L${400 + Math.cos((angle + 45) * Math.PI / 180) * 100},${300 + Math.sin((angle + 45) * Math.PI / 180) * 100} 
                  L${400 + Math.cos((angle + 90) * Math.PI / 180) * 100},${300 + Math.sin((angle + 90) * Math.PI / 180) * 100} Z`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              filter="url(#glowEffect3)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.2 }}
            />
          ))}

          {/* Pulsing circles */}
          {[0, 72, 144, 216, 288].map((angle, index) => (
            <motion.circle
              key={`pulse-${index}`}
              cx={400 + Math.cos(angle * Math.PI / 180) * 120}
              cy={300 + Math.sin(angle * Math.PI / 180) * 120}
              r="8"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              filter="url(#glowEffect3)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3
              }}
            />
          ))}

          {/* Zigzag lines */}
          {[0, 120, 240].map((angle, index) => (
            <motion.path
              key={`zigzag-${index}`}
              d={`M${400 + Math.cos(angle * Math.PI / 180) * 50},${300 + Math.sin(angle * Math.PI / 180) * 50} 
                  L${400 + Math.cos((angle + 30) * Math.PI / 180) * 100},${300 + Math.sin((angle + 30) * Math.PI / 180) * 100}
                  L${400 + Math.cos((angle + 60) * Math.PI / 180) * 50},${300 + Math.sin((angle + 60) * Math.PI / 180) * 50}
                  L${400 + Math.cos((angle + 90) * Math.PI / 180) * 100},${300 + Math.sin((angle + 90) * Math.PI / 180) * 100}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              filter="url(#glowEffect3)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.4 }}
            />
          ))}
        </motion.g>
      </motion.svg>
    </Box>
  );
};

const FourthAnimatedShapes = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: '0%',
        top: '45%',
        width: '85%',
        height: '75%',
        overflow: 'hidden',
        opacity: 0.25,
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
          <filter id="glowEffect4">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {/* Star pattern */}
          {[0, 72, 144, 216, 288].map((angle, index) => (
            <motion.path
              key={`star-${index}`}
              d={`M400,300 L${400 + Math.cos(angle * Math.PI / 180) * 150},${300 + Math.sin(angle * Math.PI / 180) * 150} 
                  L${400 + Math.cos((angle + 36) * Math.PI / 180) * 75},${300 + Math.sin((angle + 36) * Math.PI / 180) * 75}
                  L${400 + Math.cos((angle + 72) * Math.PI / 180) * 150},${300 + Math.sin((angle + 72) * Math.PI / 180) * 150} Z`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3.5"
              filter="url(#glowEffect4)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.2 }}
            />
          ))}

          {/* Orbital dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <motion.circle
              key={`orbit-${index}`}
              cx={400 + Math.cos(angle * Math.PI / 180) * 120}
              cy={300 + Math.sin(angle * Math.PI / 180) * 120}
              r="8"
              fill="#06B6D4"
              filter="url(#glowEffect4)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1
              }}
            />
          ))}

          {/* Spiral lines */}
          {[0, 120, 240].map((angle, index) => (
            <motion.path
              key={`spiral-${index}`}
              d={`M${400 + Math.cos(angle * Math.PI / 180) * 60},${300 + Math.sin(angle * Math.PI / 180) * 60} 
                  Q${400 + Math.cos((angle + 60) * Math.PI / 180) * 120},${300 + Math.sin((angle + 60) * Math.PI / 180) * 120}
                  ${400 + Math.cos((angle + 120) * Math.PI / 180) * 180},${300 + Math.sin((angle + 120) * Math.PI / 180) * 180}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3.5"
              filter="url(#glowEffect4)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.3 }}
            />
          ))}

          {/* Pulsing hexagons */}
          {[0, 60, 120, 180, 240, 300].map((angle, index) => (
            <motion.path
              key={`hex-${index}`}
              d={`M${400 + Math.cos(angle * Math.PI / 180) * 80},${300 + Math.sin(angle * Math.PI / 180) * 80} 
                  L${400 + Math.cos((angle + 60) * Math.PI / 180) * 80},${300 + Math.sin((angle + 60) * Math.PI / 180) * 80}
                  L${400 + Math.cos((angle + 120) * Math.PI / 180) * 80},${300 + Math.sin((angle + 120) * Math.PI / 180) * 80}
                  L${400 + Math.cos((angle + 180) * Math.PI / 180) * 80},${300 + Math.sin((angle + 180) * Math.PI / 180) * 80}
                  L${400 + Math.cos((angle + 240) * Math.PI / 180) * 80},${300 + Math.sin((angle + 240) * Math.PI / 180) * 80}
                  L${400 + Math.cos((angle + 300) * Math.PI / 180) * 80},${300 + Math.sin((angle + 300) * Math.PI / 180) * 80} Z`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3.5"
              filter="url(#glowEffect4)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2
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

interface Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const Home = () => {
  const modules: Module[] = [
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
        <ThirdAnimatedShapes />
        <FourthAnimatedShapes />
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
          Cyber Risk
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center', mb: 4 }}>
              As construction projects become increasingly digitized, they face sophisticated cybersecurity threats. From Building Information Modeling (BIM) systems to IoT-enabled equipment, each digital touchpoint represents a potential vulnerability that malicious actors could exploit, leading to operational disruptions, financial losses, and compromised safety.
            </Typography>
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center' }}>
              The industry's growing reliance on cloud-based collaboration tools and connected devices amplifies security risks. Without proper safeguards, unauthorized access to project data, intellectual property, and operational systems could have severe consequences for project timelines, costs, and reputations.
            </Typography>
          </motion.div>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Platform
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center', mb: 4 }}>
              Our comprehensive cyber risk management platform empowers construction professionals to proactively identify, assess, and mitigate cybersecurity threats. Through advanced AI-driven analysis and real-time monitoring, we provide actionable insights to protect your digital infrastructure and project data.
            </Typography>
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center' }}>
              With features like automated risk assessment, threat modeling, and customized security recommendations, our platform helps you maintain robust cybersecurity practices throughout your project lifecycle, ensuring the safety and integrity of your construction operations.
            </Typography>
          </motion.div>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Lab
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h3" gutterBottom align="center" color="primary">
              S.M.A.R.T. Construction Research Group
            </Typography>
            <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center' }}>
              Our goal is to generate high-impact scholarly work while ensuring a pragmatic viewpoint to guarantee a successful integration in the way we manage the planning, design, construction, operation and maintenance, inspection, retrofit, and repair of the infrastructure and communities of the future.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                href="https://www.linkedin.com/company/smart-construction-research-group/"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LinkedInIcon />}
              >
                Visit Our LinkedIn
              </Button>
            </Box>
          </motion.div>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Collaborators
        </Typography>
        <Box sx={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden', mt: 4 }}>
          {/* Seamless infinite carousel */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {(() => {
              const companies = [
                { img: '/ALEC_Logo.jfif', name: 'ALEC', url: 'https://www.alec.ae/' },
                { img: '/Petrochina_logo.svg', name: 'PetroChina', url: 'https://www.petrochina.com.cn/' },
                { img: '/China_State_Construction_Engineering_Corporation_logo.svg.png', name: 'China State Construction Engineering Corporation', url: 'https://english.cscec.com/' },
              ];
              // Use state and ref to measure width
              const [width, setWidth] = useState(0);
              const rowRef = useRef<HTMLDivElement>(null);
              useEffect(() => {
                if (rowRef.current) {
                  setWidth(rowRef.current.offsetWidth / 2);
                }
              }, []);
              return (
                <motion.div
                  ref={rowRef}
                  style={{
                    display: 'flex',
                    gap: '100px',
                    alignItems: 'center',
                    position: 'absolute',
                    willChange: 'transform',
                  }}
                  animate={width ? { x: [0, -width] } : false}
                  transition={width ? {
                    x: {
                      repeat: Infinity,
                      repeatType: 'loop',
                      duration: 12,
                      ease: 'linear',
                    },
                  } : {}}
                >
                  {Array(10).fill(companies).flat().map((company, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(company.url, '_blank')}
                    >
                      <Box
                        component="img"
                        src={company.img}
                        alt={company.name}
                        sx={{
                          height: 100,
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease-in-out',
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              );
            })()}
          </Box>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Modules
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
          {modules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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