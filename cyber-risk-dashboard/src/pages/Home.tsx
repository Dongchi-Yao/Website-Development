import { Box, Container, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import React, { useRef, useEffect, useState } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

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
        opacity: 0.95,
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

const BackgroundElements = () => {
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 3000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -600]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -900]);
  const y4 = useTransform(scrollY, [0, 3000], [0, -450]);
  const y5 = useTransform(scrollY, [0, 3000], [0, -750]);

  // Enhanced vertical line component
  const VerticalLine = ({ left, top, height, gradient, delay, scrollY }: { 
    left: string; 
    top: string; 
    height: number;
    gradient: string;
    delay: number;
    scrollY: any;
  }) => (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top,
        y: scrollY,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1.2,
        delay,
        ease: "easeOut"
      }}
    >
      <Box
        sx={{
          width: '3px',
          height: `${height}px`,
          background: gradient,
          borderRadius: '4px',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 1)',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 1)',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
          }
        }}
      />
    </motion.div>
  );
  
  // Define gradients
  const gradients = {
    blue: 'linear-gradient(180deg, #4F46E5 0%, #06B6D4 50%, #4F46E5 100%)',
    cyan: 'linear-gradient(180deg, #06B6D4 0%, #0EA5E9 50%, #06B6D4 100%)',
    indigo: 'linear-gradient(180deg, #4F46E5 0%, #6366F1 50%, #4F46E5 100%)',
  };
  
  return (
    <Box sx={{ 
      position: 'absolute', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* Left side vertical lines */}
      <VerticalLine left="12%" top="5%" height={300} gradient={gradients.blue} delay={0.2} scrollY={y1} />
      <VerticalLine left="15%" top="25%" height={250} gradient={gradients.cyan} delay={0.3} scrollY={y2} />
      <VerticalLine left="10%" top="50%" height={280} gradient={gradients.indigo} delay={0.4} scrollY={y3} />

      {/* Right side vertical lines */}
      <VerticalLine left="85%" top="8%" height={260} gradient={gradients.indigo} delay={0.6} scrollY={y2} />
      <VerticalLine left="88%" top="35%" height={240} gradient={gradients.blue} delay={0.7} scrollY={y3} />
      <VerticalLine left="82%" top="60%" height={300} gradient={gradients.cyan} delay={0.8} scrollY={y1} />

      {/* Existing background shapes with reduced opacity */}
      {/* Left side elements */}
      <motion.div style={{ position: 'absolute', left: '5%', top: '20%', y: y1 }}>
        <Box sx={{ 
          width: '80px', height: '80px',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)', // Reduced opacity
          transform: 'rotate(45deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '10%', top: '60%', y: y2 }}>
        <Box sx={{ 
          width: '120px', height: '120px',
          border: '20px solid rgba(0, 0, 0, 0.02)',
          borderRadius: '50%'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '3%', top: '85%', y: y4 }}>
        <Box sx={{ 
          width: '90px', height: '90px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '15%', top: '35%', y: y5 }}>
        <Box sx={{ 
          width: '40px', height: '40px',
          border: '8px solid rgba(0, 0, 0, 0.02)',
          transform: 'rotate(30deg)'
        }} />
      </motion.div>

      {/* Right side elements */}
      <motion.div style={{ position: 'absolute', right: '8%', top: '30%', y: y3 }}>
        <Box sx={{ 
          width: '150px', height: '150px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '30px',
          transform: 'rotate(-15deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '15%', top: '70%', y: y1 }}>
        <Box sx={{ 
          width: '60px', height: '60px',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }} />
      </motion.div>

      {/* Additional floating elements */}
      <motion.div style={{ position: 'absolute', left: '20%', top: '40%', y: y2 }}>
        <Box sx={{ 
          width: '40px', height: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '8px',
          transform: 'rotate(30deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '25%', top: '50%', y: y3 }}>
        <Box sx={{ 
          width: '100px', height: '2px',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          transform: 'rotate(-45deg)'
        }} />
      </motion.div>

      {/* New Additional Elements */}
      <motion.div style={{ position: 'absolute', left: '28%', top: '75%', y: y4 }}>
        <Box sx={{ 
          width: '70px', height: '70px',
          border: '15px solid rgba(0, 0, 0, 0.015)',
          borderRadius: '50%',
          transform: 'rotate(15deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '30%', top: '25%', y: y5 }}>
        <Box sx={{ 
          width: '85px', height: '85px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          transform: 'rotate(75deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '35%', top: '15%', y: y2 }}>
        <Box sx={{ 
          width: '120px', height: '3px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          transform: 'rotate(60deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '12%', top: '85%', y: y3 }}>
        <Box sx={{ 
          width: '50px', height: '50px',
          backgroundColor: 'rgba(0, 0, 0, 0.025)',
          borderRadius: '12px',
          transform: 'rotate(-30deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '8%', top: '92%', y: y1 }}>
        <Box sx={{ 
          width: '30px', height: '30px',
          border: '6px solid rgba(0, 0, 0, 0.02)',
          transform: 'rotate(45deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '35%', top: '65%', y: y4 }}>
        <Box sx={{ 
          width: '90px', height: '90px',
          backgroundColor: 'rgba(0, 0, 0, 0.015)',
          clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', left: '40%', top: '55%', y: y5 }}>
        <Box sx={{ 
          width: '60px', height: '60px',
          border: '12px solid rgba(0, 0, 0, 0.02)',
          borderRadius: '50%',
          transform: 'rotate(-15deg)'
        }} />
      </motion.div>

      <motion.div style={{ position: 'absolute', right: '18%', top: '10%', y: y2 }}>
        <Box sx={{ 
          width: '40px', height: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          transform: 'rotate(180deg)'
        }} />
      </motion.div>
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

const AdditionalHeroShapes = () => {
  return (
    <>
      {/* Floating hexagon */}
      <motion.div
        style={{
          position: 'absolute',
          left: '25%',
          top: '15%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box
          sx={{
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.1)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            backdropFilter: 'blur(8px)',
          }}
        />
      </motion.div>

      {/* Glowing circle */}
      <motion.div
        style={{
          position: 'absolute',
          right: '28%',
          top: '65%',
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 15px rgba(255,255,255,0.1)',
          }}
        />
      </motion.div>

      {/* Rotating square */}
      <motion.div
        style={{
          position: 'absolute',
          left: '55%',
          top: '25%',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Box
          sx={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
          }}
        />
      </motion.div>

      {/* Pulsing triangle */}
      <motion.div
        style={{
          position: 'absolute',
          right: '15%',
          bottom: '20%',
          zIndex: 0,
        }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box
          sx={{
            width: '70px',
            height: '70px',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        />
      </motion.div>
    </>
  );
};

const ModuleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
  padding: theme.spacing(0.5),
  position: 'relative',
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
    <Box sx={{ position: 'relative' }}>
      <BackgroundElements />
      <HeroSection>
        <AnimatedShapes />
        <SecondAnimatedShapes />
        <ThirdAnimatedShapes />
        <FourthAnimatedShapes />
        <AdditionalHeroShapes />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
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
              <Button
                variant="outlined"
                color="primary"
                href="https://nyuad.nyu.edu/en/research/faculty-labs-and-projects/smart-construction-research-group.html"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LanguageIcon />}
              >
                Visit Lab Website
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
                      duration: 25,
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
                style={{ height: '100%' }}
              >
                <ModuleCard
                  sx={{
                    '&:hover .module-icon > *': {
                      transform: 'scale(1.2) rotate(10deg)',
                    }
                  }}
                >
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 1.5, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '200px',
                    justifyContent: 'flex-start'
                  }}>
                    <Box 
                      className="module-icon"
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        '& > *': {
                          transition: 'transform 0.3s ease-in-out',
                        }
                      }}
                    >
                      <motion.div>
                        {module.icon}
                      </motion.div>
                    </Box>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3" 
                      align="center" 
                      sx={{ 
                        fontSize: '1rem', 
                        mb: 2,
                        flexShrink: 0
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography 
                      align="center" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.85rem',
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {module.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ 
                    justifyContent: 'center', 
                    pb: 1, 
                    pt: 0,
                    flexShrink: 0
                  }}>
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