import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  LinearProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  List,
  ListItem,
  Tooltip,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Code,
  DarkMode,
  LightMode,
  Timer,
  Save,
  SyncAlt,
  ArrowForward,
  ArrowBack,
  Check,
  Warning,
  QuestionAnswer,
  Send as SendIcon,
  Terminal
} from '@mui/icons-material';
import axios from 'axios';
import { submitCompetitionAnswers } from '../../services/api';
import CompetitionSuccessPage from '../../pages/Student/CompetitionSuccessPage';

function CodePage({ questions = [], competition = {} }) {
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(competition.duration ? competition.duration * 60 : 600); // Default 10 min if not set
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [output, setOutput] = useState('');
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  // Sample starter templates for different languages
  const languageTemplates = {
    javascript: '// Write your JavaScript code here\n\nfunction solution(input) {\n  // Your code here\n  \n  return result;\n}\n\n// Example usage:\n// console.log(solution(input));',
    python: '# Write your Python code here\n\ndef solution(input):\n    # Your code here\n    \n    return result\n\n# Example usage:\n# print(solution(input))',
    java: '// WARNING: Do not change the class name "Main" or the file structure\n// You must maintain the main method signature\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n        // You can call your solution method from here\n        System.out.println(solution("example input"));\n    }\n    \n    public static String solution(String input) {\n        // Your solution logic here\n        \n        return "result";\n    }\n}',
    cpp: '// WARNING: Do not modify the main function signature or file structure\n// You can add your solution code inside the given structure\n\n#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\n// Write your solution function here\nstring solution(string input) {\n    // Your code here\n    \n    return "result";\n}\n\nint main() {\n    // DO NOT MODIFY THE MAIN FUNCTION\n    string input;\n    getline(cin, input);\n    \n    string result = solution(input);\n    cout << result << endl;\n    \n    return 0;\n}',
    c: '// WARNING: Do not modify the main function signature or file structure\n// You can add your solution code inside the given structure\n\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n// Add any additional headers you need here\n\n// Write your solution function here\nchar* solution(const char* input) {\n    // Allocate memory for result (remember to free this in the calling function)\n    char* result = (char*)malloc(100 * sizeof(char));\n    \n    // Your code here\n    strcpy(result, "result");\n    \n    return result;\n}\n\nint main() {\n    // DO NOT MODIFY THE MAIN FUNCTION\n    char input[1000];\n    fgets(input, 1000, stdin);\n    \n    // Remove trailing newline if present\n    size_t len = strlen(input);\n    if (len > 0 && input[len-1] == \'\\n\') {\n        input[len-1] = \'\\0\';\n    }\n    \n    char* result = solution(input);\n    printf("%s\\n", result);\n    \n    // Free allocated memory\n    free(result);\n    \n    return 0;\n}'
  };

  // Add a warning to be displayed for file structure-sensitive languages
  const fileStructureWarning = {
    java: "Warning: Your code must include a 'Main' class with a 'main' method. Do not change the file structure.",
    c: "Warning: Your code must include a 'solution' function with the specified signature. Do not modify the main function.",
    cpp: "Warning: Your code must include a 'solution' function with the specified signature. Do not modify the main function."
  };

  // Render warning for language - adding the missing function
  const renderWarningForLanguage = () => {
    if (fileStructureWarning[language]) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">{fileStructureWarning[language]}</Typography>
        </Alert>
      );
    }
    return null;
  };

  // Set up timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to execute code via Docker container
  const executeCode = async (code, language) => {
    try {
      setIsRunning(true);
      setOutput('Running code, please wait...');

      // Map language to correct format for API
      let apiLanguage = language.toLowerCase();
      // Special case for C++
      if (apiLanguage === 'cpp') {
        apiLanguage = 'c++';
      }

      const response = await axios.post('http://localhost:3000/run', {
        language: apiLanguage,  // Use the mapped language
        code: code
      });

      if (response.data) {
        let resultOutput = '';

        if (response.data.output) {
          resultOutput += response.data.output;
        }

        if (response.data.error) {
          resultOutput += response.data.error ? `\n${response.data.error}` : '';
        }

        return resultOutput.trim() || 'Code executed with no output';
      } else {
        return 'No response from execution server';
      }
    } catch (error) {
      console.error('Error executing code:', error);
      return `Error: ${error.response?.data?.message || error.message || 'Failed to execute code'}`;
    } finally {
      setIsRunning(false);
    }
  };

  // Handle editor mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Load the current code for this question if it exists
    const questionId = questions[currentQuestion]?._id;
    if (questionId && answers[questionId]) {
      setCode(answers[questionId].code || languageTemplates[language]);
    } else {
      setCode(languageTemplates[language]);
    }
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);

    // If there's no saved code for this question, load the template
    const questionId = questions[currentQuestion]?._id;
    const currentAnswer = answers[questionId];

    if (currentAnswer && currentAnswer.language === newLanguage) {
      // Use saved code for this language if available
      setCode(currentAnswer.code || languageTemplates[newLanguage]);
    } else {
      // Otherwise load the template
      setCode(languageTemplates[newLanguage]);
    }
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  // Update answered questions count when answers change
  useEffect(() => {
    setAnsweredQuestions(Object.keys(answers).length);
  }, [answers]);

  // Save current code
  const saveCurrentCode = () => {
    const questionId = questions[currentQuestion]?._id;
    if (questionId) {
      const currentCode = editorRef.current.getValue();
      setAnswers(prev => ({
        ...prev,
        [questionId]: { code: currentCode, language: language }
      }));
    }
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation between questions
  const handlePrevQuestion = () => {
    saveCurrentCode(); // Save current code before switching
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      loadQuestionCode(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    saveCurrentCode(); // Save current code before switching
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      loadQuestionCode(currentQuestion + 1);
    }
  };

  // Load code for a specific question
  const loadQuestionCode = (questionIndex) => {
    const question = questions[questionIndex];
    if (!question) return;

    const questionId = question._id;
    const savedAnswer = answers[questionId];

    if (savedAnswer) {
      setLanguage(savedAnswer.language || 'javascript');
      setCode(savedAnswer.code || languageTemplates[savedAnswer.language || 'javascript']);
    } else {
      setLanguage('javascript');
      setCode(languageTemplates.javascript);
    }
  };

  // Jump to specific question
  const jumpToQuestion = (index) => {
    saveCurrentCode(); // Save current code before switching
    setCurrentQuestion(index);
    loadQuestionCode(index);
  };

  // Open summary dialog before final submission
  const handleOpenSummary = () => {
    saveCurrentCode(); // Make sure to save current code
    setOpenSummaryDialog(true);
  };

  // Run code to test - Updated to use the Docker container
  const runCode = async () => {
    if (!editorRef.current) return;

    const currentCode = editorRef.current.getValue();

    try {
      // Execute code using the Docker container API
      const result = await executeCode(currentCode, language);
      setOutput(result);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(`Error: ${error.message || 'An unknown error occurred'}`);
    }
  };

  // Submit answers
  const handleSubmit = async () => {
    saveCurrentCode(); // Save current code
    setIsSubmitting(true);

    try {
      // Format answers for submission
      const questionIds = questions.map(q => q._id);
      // For each question, get the code and language or empty string if not answered
      const answersArray = questionIds.map(qId => {
        if (answers[qId]) {
          // Map cpp to c++ before submitting
          let apiLanguage = answers[qId].language || 'javascript';
          if (apiLanguage === 'cpp') {
            apiLanguage = 'c++';
          }
          
          return JSON.stringify({
            code: answers[qId].code || '',
            language: apiLanguage
          });
        }
        return '';
      });

      // Make API call to submit answers using the API service
      const response = await submitCompetitionAnswers(
        competition._id,
        questionIds,
        answersArray
      );

      setSnackbar({
        open: true,
        message: 'Your code solutions have been submitted successfully!',
        severity: 'success'
      });

      console.log("Submission response:", response.data);

      // Prepare submission details for success page
      setSubmissionDetails({
        submissionId: response.data?.submissionId || `SUB-${Date.now()}`,
        problem: competition.competitionName,
        submissionDate: new Date().toLocaleString(),
        completedIn: `${competition.duration - Math.floor(timeLeft / 60)}m ${60 - (timeLeft % 60)}s`,
        score: response.data?.preliminaryScore || "Awaiting evaluation"
      });

      // Close dialog and set submission as complete
      setOpenSummaryDialog(false);
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Error submitting code solutions:', error);

      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit code solutions. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Render the current question
  const renderQuestion = () => {
    if (!questions || questions.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No questions available for this competition.</Typography>
        </Box>
      );
    }

    const question = questions[currentQuestion];

    if (!question) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Question not found.</Typography>
        </Box>
      );
    }

    return (
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Question {currentQuestion + 1}: {question.question}
          </Typography>

          {question.description && (
            <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 3 }}>
              {question.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Question details, examples, constraints would go here */}
          {question.examples && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Examples:</Typography>
              {question.examples.map((example, idx) => (
                <Paper key={idx} sx={{ p: 2, my: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                    {example}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {question.constraints && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Constraints:</Typography>
              <List dense>
                {question.constraints.map((constraint, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon><Check fontSize="small" /></ListItemIcon>
                    <ListItemText primary={constraint} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // If submission is complete, show the success page
  if (submissionComplete) {
    return <CompetitionSuccessPage submissionDetails={submissionDetails} />;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar with Timer */}
      <AppBar position="static" color="default" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {competition.competitionName || 'Coding Competition'}
          </Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: timeLeft < 300 ? 'error.light' : 'primary.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2
          }}>
            <Timer sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontFamily="monospace" fontWeight="bold">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Toolbar>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(answeredQuestions / questions.length) * 100}
          sx={{ height: 6 }}
        />
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2}>
          {/* Left: Question Navigator */}
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionAnswer fontSize="small" sx={{ mr: 1 }} />
                  Question Navigator
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={1}>
                  {questions.map((q, index) => (
                    <Grid item xs={3} sm={2} md={4} key={index}>
                      <Button
                        variant={answers[q._id] ? "contained" : "outlined"}
                        color={answers[q._id] ? "primary" : "inherit"}
                        onClick={() => jumpToQuestion(index)}
                        sx={{
                          minWidth: 0,
                          width: '100%',
                          height: '36px',
                          aspectRatio: '1',
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Questions Answered: {answeredQuestions}/{questions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(answeredQuestions / questions.length) * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleOpenSummary}
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
            >
              Submit All Solutions
            </Button>
          </Grid>

          {/* Right: Question Display and Code Editor */}
          <Grid item xs={12} md={9}>
            {/* Question Display */}
            {renderQuestion()}

            {/* Code Editor Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  label="Language"
                >
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="c">C</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Tooltip title="Toggle light/dark theme">
                  <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
                    {theme === 'vs-dark' ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                  onClick={runCode}
                  disabled={isRunning}
                  sx={{ mr: 1 }}
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={saveCurrentCode}
                >
                  Save
                </Button>
              </Box>
            </Box>

            {/* Warning for file structure sensitive languages */}
            {renderWarningForLanguage()}

            {/* Monaco Editor */}
            <Paper
              elevation={3}
              sx={{
                height: 'calc(100vh - 450px)', // Reduced height to make room for output panel
                minHeight: '300px',
                overflow: 'hidden',
                borderRadius: 2
              }}
            >
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on'
                }}
              />
            </Paper>

            {/* Output Panel */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Terminal sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>Output</Typography>
              </Box>
              <Paper
                elevation={3}
                sx={{
                  height: '150px',
                  overflow: 'auto',
                  borderRadius: 2,
                  p: 2,
                  bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5',
                  color: theme === 'vs-dark' ? '#d4d4d4' : '#333333',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}
              >
                {isRunning ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Running your code...</Typography>
                  </Box>
                ) : output ? (
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      margin: 0
                    }}
                  >
                    {output}
                  </Typography>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Run your code to see output here
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                sx={{ minWidth: 120 }}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                sx={{ minWidth: 120 }}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Submission Summary Dialog */}
      <Dialog
        open={openSummaryDialog}
        onClose={() => !isSubmitting && setOpenSummaryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to submit all your code solutions. Once submitted, you cannot change them.
          </DialogContentText>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Summary:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary={`Questions Answered: ${answeredQuestions} of ${questions.length}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="error" /></ListItemIcon>
                <ListItemText
                  primary={`Questions Unanswered: ${questions.length - answeredQuestions}`}
                  secondary={answeredQuestions < questions.length ? "You still have unanswered questions." : ""}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Timer color="info" /></ListItemIcon>
                <ListItemText primary={`Time Remaining: ${formatTime(timeLeft)}`} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSummaryDialog(false)}
            disabled={isSubmitting}
          >
            Continue Coding
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit All Solutions'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CodePage;