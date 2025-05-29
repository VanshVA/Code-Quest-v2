import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  Button,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  const faqItems = [
    {
      question: "What is Code-Quest?",
      answer: "Code-Quest is an online assessment tool designed for KITPS (Kothiwal Institute of Technology & Professional Studies) to conduct coding competitions and assessments. It features role-based access control for students, teachers, and administrators, allowing for a comprehensive educational experience in programming."
    },
    {
      question: "How do I create an account on Code-Quest?",
      answer: "To create an account, click on the 'Register' button on the homepage. You'll need to provide your name, email address, and create a password. You'll also need to select your role (student, teacher, or administrator). Note that administrator accounts require approval from existing administrators."
    },
    {
      question: "How do students participate in coding competitions?",
      answer: "Students can view all upcoming and ongoing competitions from their dashboard. To participate, simply click on the competition tile, read the instructions and problem statements, and submit your code within the specified time limit. Your submission will be automatically evaluated, and results will be available on your dashboard."
    },
    {
      question: "How do teachers create coding assessments?",
      answer: "Teachers can create assessments by logging into their accounts and navigating to the 'Create Assessment' section. There, they can add problem statements, test cases, time limits, and other parameters. They can also specify which students or classes should have access to the assessment."
    },
    {
      question: "What programming languages are supported?",
      answer: "Code-Quest currently supports several popular programming languages, including Java, Python, C++, JavaScript, and Ruby. More languages may be added in future updates based on user needs and feedback."
    },
    {
      question: "How are coding submissions evaluated?",
      answer: "Submissions are evaluated automatically through our evaluation engine. The code is run against a series of test cases defined by the assessment creator. It checks for correctness, efficiency, and adherence to any specified constraints. Results are usually available immediately after submission."
    },
    {
      question: "Can I practice before participating in competitions?",
      answer: "Yes! Code-Quest offers a 'Practice' section where students can solve problems from previous competitions or specially curated practice sets. This is an excellent way to prepare for upcoming competitions and improve your coding skills."
    },
    {
      question: "How secure is the platform?",
      answer: "Code-Quest employs industry-standard security measures to ensure user data protection. All passwords are encrypted, and our evaluation engine runs code in isolated containers to prevent security breaches. Additionally, plagiarism detection mechanisms are in place to maintain the integrity of assessments."
    },
    {
      question: "Is there a leaderboard for competitions?",
      answer: "Yes, each competition has its own leaderboard showing participants ranked by their performance. Criteria typically include correctness of solutions, time taken, and efficiency of the code. Leaderboards can be accessed during and after competitions."
    },
    {
      question: "What if I face technical issues during a competition?",
      answer: "If you encounter technical issues during a competition, you can use the 'Report Issue' feature available on the competition page. The system administrators will be notified immediately, and appropriate measures will be taken. Depending on the severity of the issue, time extensions may be granted."
    }
  ];
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Box sx={{ 
      bgcolor: 'var(--background-color)', 
      color: 'var(--text-color)',
      minHeight: '100vh',
      pb: 8
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        py: 10, 
        background: 'var(--background-gradient-light)',
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold"
            align="center"
            sx={{ mb: 2 }}
          >
            Frequently Asked <span style={{color: 'var(--theme-color)'}}>Questions</span>
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            align="center"
            sx={{ mb: 5, color: 'var(--p-color)', maxWidth: '800px', mx: 'auto' }}
          >
            Find answers to common questions about Code-Quest
          </Typography>
          
          <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'var(--p-color)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'var(--dashboard-bg)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--theme-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--theme-color)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'var(--text-color)',
                },
              }}
            />
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <Accordion 
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{ 
                  mb: 2,
                  bgcolor: 'var(--dashboard-bg)',
                  color: 'var(--text-color)',
                  border: 'none',
                  boxShadow: '0 2px 8px var(--background-shadow)',
                  '&:before': {
                    display: 'none',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'var(--theme-color)' }} />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                  sx={{ 
                    borderLeft: expanded === `panel${index}` ? `4px solid var(--theme-color)` : '4px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box sx={{ 
              textAlign: 'center',
              py: 6
            }}>
              <HelpIcon sx={{ fontSize: 60, color: 'var(--p-color)', mb: 2, opacity: 0.6 }} />
              <Typography variant="h5" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
                We couldn't find any FAQ matching "{searchTerm}"
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Additional Help Section */}
        <Box sx={{ py: 6, mb: 4 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Still Have Questions?
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, color: 'var(--p-color)' }}>
            If you couldn't find the answer you were looking for, please reach out to us
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Paper sx={{ 
                p: 4, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: 'var(--dashboard-bg)',
                boxShadow: '0 5px 15px var(--background-shadow)'
              }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(188, 64, 55, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <EmailIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Contact Support
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: 'var(--p-color)', mb: 3 }}>
                  Our support team is always ready to assist you with any questions or issues
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/contact"
                  sx={{ 
                    bgcolor: 'var(--theme-color)', 
                    '&:hover': { bgcolor: 'var(--hover-color)' },
                    mt: 'auto'
                  }}
                >
                  Contact Us
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;