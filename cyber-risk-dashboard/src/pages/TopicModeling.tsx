import { Box, Container, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TopicModeling = () => {
  const generatePDF = () => {
    try {
      console.log('Starting PDF generation...');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(24);
      doc.text('Cybersecurity Topic Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // Add Executive Summary
      doc.setFontSize(16);
      doc.text('Executive Summary', 20, 45);
      doc.setFontSize(12);
      doc.text(
        'This analysis examines the cybersecurity posture of the provided documents, identifying key topics and potential risk areas. The analysis was performed using advanced natural language processing and topic modeling techniques.',
        20, 55, { maxWidth: pageWidth - 40 }
      );
      
      // Add Key Findings
      doc.setFontSize(16);
      doc.text('Key Findings', 20, 85);
      
      // Add findings table
      const findings = [
        { topic: 'Network Security', confidence: '89%', description: 'Strong emphasis on network infrastructure protection and monitoring.' },
        { topic: 'Data Privacy', confidence: '85%', description: 'Significant focus on data protection and compliance requirements.' },
        { topic: 'Access Control', confidence: '82%', description: 'Comprehensive access management and authentication protocols.' },
        { topic: 'Threat Detection', confidence: '78%', description: 'Advanced threat detection and incident response capabilities.' },
      ];
      
      autoTable(doc, {
        startY: 95,
        head: [['Topic', 'Confidence', 'Description']],
        body: findings.map(f => [f.topic, f.confidence, f.description]),
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 'auto' }
        }
      });
      
      // Add Recommendations
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(16);
      doc.text('Recommendations', 20, finalY + 20);
      doc.setFontSize(12);
      
      const recommendations = [
        'Implement regular security assessments and penetration testing',
        'Enhance employee security awareness training programs',
        'Review and update access control policies',
        'Strengthen incident response procedures'
      ];
      
      recommendations.forEach((rec, index) => {
        doc.text(`• ${rec}`, 25, finalY + 35 + (index * 10));
      });
      
      console.log('PDF generation completed, saving file...');
      // Save the PDF
      doc.save('cybersecurity-topic-analysis.pdf');
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Cybersecurity Topic Modeling
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center">
          Upload or paste text documents to discover hidden topics and patterns
        </Typography>

        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: 'Upload Documents',
                description: 'Upload your construction project documents, reports, or security logs.',
              },
              {
                title: 'AI Analysis',
                description: 'Our AI analyzes the text to identify key topics and patterns.',
              },
              {
                title: 'Get Insights',
                description: 'Receive detailed insights about potential cyber risks and vulnerabilities.',
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Upload Documents
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Drag and drop your files here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse files
                </Typography>
                <input
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ mt: 2 }}
                  >
                    Select Files
                  </Button>
                </label>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Or Paste Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="Paste your text here..."
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Analyze Text
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Sample Analysis Report
          </Typography>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Executive Summary
              </Typography>
              <Typography variant="body1" paragraph>
                This analysis examines the cybersecurity posture of the provided documents, identifying key topics and potential risk areas. The analysis was performed using advanced natural language processing and topic modeling techniques.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Key Findings
              </Typography>
              <Grid container spacing={3}>
                {[
                  { topic: 'Network Security', confidence: 0.89, description: 'Strong emphasis on network infrastructure protection and monitoring.' },
                  { topic: 'Data Privacy', confidence: 0.85, description: 'Significant focus on data protection and compliance requirements.' },
                  { topic: 'Access Control', confidence: 0.82, description: 'Comprehensive access management and authentication protocols.' },
                  { topic: 'Threat Detection', confidence: 0.78, description: 'Advanced threat detection and incident response capabilities.' },
                ].map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {item.topic}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${item.confidence * 100}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {(item.confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Recommendations
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  Implement regular security assessments and penetration testing
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Enhance employee security awareness training programs
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Review and update access control policies
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Strengthen incident response procedures
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Generated on: {new Date().toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                size="large"
                onClick={generatePDF}
              >
                Download Full Report
              </Button>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default TopicModeling; 