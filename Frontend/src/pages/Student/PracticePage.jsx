import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Paper, Button, CircularProgress,
    Tab, Tabs, Divider, Grid, IconButton,
    Breadcrumbs, Link, Select, MenuItem, FormControl, InputLabel,
    Card, CardContent, Stack, Tooltip, alpha, useTheme,
    Chip, LinearProgress
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import {
    Refresh, Save, Delete, NavigateNext, Code as CodeIcon,
    EmojiEvents as TrophyIcon, Assignment, Timer as TimerIcon,
    PlayArrow, Bookmarks, Warning, Info, Psychology, LightbulbOutlined,
    Terminal, AccessTime, CloudSync, Storage, 
    AutoAwesome
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Gemini AI API for question generation
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// Fix for Vite environment variables
const GEMINI_API_KEY = "AIzaSyDTUU-VAViQ1ah3Qq_zv7LZOOvR_Dn4TxA";

// Animate components with framer-motion
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const PracticePage = () => {
    // Theme and animation
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (custom) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: custom * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 100
            }
        }),
        hover: {
            y: -5,
            boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.1,
                duration: 0.5
            }
        })
    };

    // State management
    const [activeTab, setActiveTab] = useState(0);
    const [question, setQuestion] = useState('');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
    const [lastSaved, setLastSaved] = useState(null);
    const [showLocalStorageNotice, setShowLocalStorageNotice] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const editorRef = useRef(null);
    const [splitRatio, setSplitRatio] = useState(60); // Default split: 60% editor, 40% output
    const [userName, setUserName] = useState('Coder');

    // Default code templates for different languages
    const defaultCode = {
        javascript: '// Write your JavaScript code here\nconsole.log("Hello World");',
        python: '# Write your Python code here\nprint("Hello World")',
        java: '// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
        c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n  printf("Hello World\\n");\n  return 0;\n}',
        cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n  std::cout << "Hello World" << std::endl;\n  return 0;\n}'
    };

    // Load saved state from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('practicePageData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setQuestion(parsedData.question || '');
                setCode(parsedData.code || defaultCode[language]);
                setLanguage(parsedData.language || 'javascript');
                setActiveTab(parsedData.activeTab || 0);
                setLastSaved(parsedData.lastSaved || new Date().toISOString());
            } catch (error) {
                console.error('Error parsing saved practice data:', error);
                setCode(defaultCode[language]);
            }
        } else {
            setCode(defaultCode[language]);
        }

        // Load user data or name if available
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                if (parsedUserData.name) {
                    setUserName(parsedUserData.name);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        // Auto-save timer
        if (isAutoSaveEnabled) {
            const autoSaveInterval = setInterval(() => {
                saveToLocalStorage(question, code, true);
            }, 60000); // Auto-save every minute

            return () => clearInterval(autoSaveInterval);
        }
    }, [isAutoSaveEnabled]);

    // Handle refreshing stats
    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refreshing stats
        setTimeout(() => {
            setRefreshing(false);
            toast.success('Stats refreshed successfully!');
        }, 1500);
    };

    // Handle editor mounting
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    // Format date utility
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Generate question using AI
    const generateQuestion = async () => {
        try {
            setIsLoading(true);

            // Prepare the prompt for Gemini API
            const prompt = `Generate a single coding practice question for ${language} programming language. 
      The question should be concise and suitable for beginners to intermediate programmers.
      Only provide the question description, no sample code or solution.
      Make sure it's a question that can be solved in about 10-15 minutes of coding.
      Focus on fundamental concepts like loops, conditionals, basic data structures, or algorithms.`;

            // API request to Gemini
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200
                    }
                }
            );

            // Extract the generated question from the response
            let generatedQuestion = '';
            if (response.data &&
                response.data.candidates &&
                response.data.candidates[0] &&
                response.data.candidates[0].content &&
                response.data.candidates[0].content.parts &&
                response.data.candidates[0].content.parts[0]) {
                generatedQuestion = response.data.candidates[0].content.parts[0].text.trim();
            }

            // If we got a valid question, use it
            if (generatedQuestion) {
                setQuestion(generatedQuestion);

                // Reset code to template based on currently selected language
                setCode(defaultCode[language]);
                setOutput('');

                // Save to localStorage
                saveToLocalStorage(generatedQuestion, defaultCode[language]);

                setNotification({
                    open: true,
                    message: 'New AI-generated question ready!',
                    severity: 'success'
                });
            } else {
                useFallbackQuestions();
            }
        } catch (error) {
            console.error('Error generating question:', error);
            useFallbackQuestions();
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback to sample questions if API fails
    const useFallbackQuestions = () => {
        const sampleQuestions = [
            "Create a function that calculates the factorial of a given number.",
            "Write a program to check if a string is a palindrome.",
            "Implement a simple calculator that can add, subtract, multiply, and divide.",
            "Write a function to find the nth Fibonacci number.",
            "Create a program that sorts an array using the bubble sort algorithm."
        ];

        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        setQuestion(randomQuestion);

        // Reset code to template based on currently selected language
        setCode(defaultCode[language]);
        setOutput('');

        // Save to localStorage
        saveToLocalStorage(randomQuestion, defaultCode[language]);

        setNotification({
            open: true,
            message: 'Using sample question (AI API unavailable)',
            severity: 'warning'
        });
    };

    // Run the code
    const runCode = async () => {
        try {
            setIsRunning(true);
            setOutput('Running code...');

            const response = await axios.post('http://localhost:3000/run', {
                language: language,
                code: code
            });

            if (response.data.error) {
                setOutput(`Error:\n${response.data.error}`);
            } else {
                setOutput(`Output:\n${response.data.output}`);
            }
        } catch (error) {
            setOutput(`Error running code: ${error.message}`);
            console.error('Error running code:', error);
        } finally {
            setIsRunning(false);
        }
    };

    // Save current state to localStorage
    const saveToLocalStorage = (currentQuestion = question, currentCode = code, isAutoSave = false) => {
        const now = new Date().toISOString();

        localStorage.setItem('practicePageData', JSON.stringify({
            question: currentQuestion,
            code: currentCode,
            language: language,
            activeTab: activeTab,
            lastSaved: now
        }));

        setLastSaved(now);

        if (!isAutoSave) {
            toast.success('Progress saved to browser storage');
        }
    };

    // Clear all saved data
    const clearAll = () => {
        localStorage.removeItem('practicePageData');
        setQuestion('');
        setCode(defaultCode[language]);
        setOutput('');
        setLastSaved(null);

        toast.info('All progress cleared');
    };

    // Handle language change
    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);

        // If there's no custom code yet or user is switching to a new tab, load the template
        if (!code || code === defaultCode[language]) {
            setCode(defaultCode[newLanguage]);
        }
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Split view resizing
    const handleResize = (e) => {
        const container = e.currentTarget.parentElement;
        const x = e.clientX - container.getBoundingClientRect().left;
        const newRatio = Math.round((x / container.offsetWidth) * 100);

        // Limit ratio between 20% and 80%
        if (newRatio >= 20 && newRatio <= 80) {
            setSplitRatio(newRatio);
        }
    };

    // Dismiss local storage notice
    const dismissLocalStorageNotice = () => {
        setShowLocalStorageNotice(false);
    };

    return (
        <Box
            sx={{
                backgroundColor: isDark ? 'background.default' : '#f7f9fc',
                minHeight: '100vh',
                pb: 4,
                px: 3,
                pt: 2
            }}
        >
            {/* Toast Container */}
            <Toaster position="top-center" />
            
            {/* Welcome Banner */}
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                    mb: 4,
                    bgcolor: isDark ? 'rgba(9, 9, 9, 0.67)' : 'primary.main',
                    borderRadius: 2,
                    p: 5,
                    boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mb: 1,
                                color: isDark ? '#f47061' : 'white'
                            }}
                        >
                            Code Practice Arena
                        </Typography>
                        <Typography variant="body1" color={isDark ? 'text.secondary' : 'rgba(255,255,255,0.9)'}>
                            Improve your coding skills with interactive practice problems and exercises
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Assignment />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.2,
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                                }}
                                onClick={() => navigate('/student/competitions')}
                            >
                                Browse Competitions
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: isDark ? '#f47061' : 'white',
                                    borderColor: isDark ? '#f47061' : 'white',
                                    px: 3,
                                    py: 1.2,
                                }}
                                onClick={handleRefresh}
                                disabled={refreshing}
                            >
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </MotionBox>

            {/* Local Storage Notice */}
            {showLocalStorageNotice && (
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    sx={{ mb: 3 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: isDark ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.info.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Info color="info" sx={{ mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                                Your code is saved locally in your browser
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Make sure to click the Save button to store your work. Data is not synchronized with our servers.
                            </Typography>
                        </Box>
                        <Button size="small" onClick={dismissLocalStorageNotice}>
                            Dismiss
                        </Button>
                    </Paper>
                </MotionBox>
            )}

            {/* Tabs */}
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5
                        }
                    }}
                >
                    <Tab
                        label="AI-Powered Practice"
                        icon={<LightbulbOutlined />}
                        iconPosition="start"
                    />
                    <Tab
                        label="Free Coding Sandbox"
                        icon={<CodeIcon />}
                        iconPosition="start"
                    />
                </Tabs>
            </MotionCard>

            {/* Tab Content */}
            {/* AI Practice Tab */}
            {activeTab === 0 && (
                <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}
                >
                    <Box
                        sx={{
                            height: 6,
                            width: '100%',
                            bgcolor: theme.palette.primary.main,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}
                    />
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Practice Question
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Solve the problem below using {language}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                                onClick={generateQuestion}
                                disabled={isLoading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.2,
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                                }}
                            >
                                {question ? 'Generate New Question' : 'Generate Question By AI'}
                            </Button>
                        </Box>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.background.paper, 0.7),
                                borderRadius: 2,
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                minHeight: '120px',
                                mb: 2
                            }}
                        >
                            {question ? (
                                <Typography variant="body1">{question}</Typography>
                            ) : (
                                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                    <LightbulbOutlined sx={{ color: 'text.disabled', fontSize: 40, mb: 2 }} />
                                    <Typography color="text.secondary" align="center">
                                        Click the 'Generate Question' button to get an AI-powered coding challenge
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Last saved indicator */}
                        {lastSaved && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                                <AccessTime sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    Last saved: {formatDate(lastSaved)}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </MotionCard>
            )}

            {/* Language and Controls */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <MotionCard
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        elevation={3}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                height: 6,
                                width: '100%',
                                bgcolor: theme.palette.secondary.main,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <FormControl sx={{ minWidth: 180 }}>
                                    <InputLabel>Programming Language</InputLabel>
                                    <Select
                                        value={language}
                                        onChange={handleLanguageChange}
                                        label="Programming Language"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="javascript">JavaScript</MenuItem>
                                        <MenuItem value="python">Python</MenuItem>
                                        <MenuItem value="java">Java</MenuItem>
                                        <MenuItem value="c">C</MenuItem>
                                        <MenuItem value="cpp">C++</MenuItem>
                                    </Select>
                                </FormControl>

                                <Chip
                                    icon={<Terminal fontSize="small" />}
                                    label={language.charAt(0).toUpperCase() + language.slice(1)}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ ml: 2, fontWeight: 600 }}
                                />
                            </Box>
                        </CardContent>
                    </MotionCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <MotionCard
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                height: 6,
                                width: '100%',
                                bgcolor: theme.palette.success.main,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                        <CardContent sx={{ p: 2.5, width: '100%' }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end" width="100%">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={runCode}
                                    disabled={isRunning}
                                    startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.2,
                                    }}
                                >
                                    {isRunning ? 'Running...' : 'Run Code'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Save />}
                                    onClick={() => saveToLocalStorage()}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Save Locally
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={clearAll}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </CardContent>
                    </MotionCard>
                </Grid>
            </Grid>

            {/* Code Editor and Output Area */}
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={4}
                elevation={3}
                sx={{
                    height: 'calc(100vh - 420px)',
                    minHeight: '400px',
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%'
                    }}
                >
                    {/* Editor */}
                    <Box sx={{
                        width: `${splitRatio}%`,
                        height: '100%',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            pl: 2,
                            bgcolor: isDark ? '#1e1e1e' : '#f5f5f5',
                            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}`
                        }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Code Editor
                            </Typography>
                            <Chip
                                size="small"
                                label={language.charAt(0).toUpperCase() + language.slice(1)}
                                sx={{ height: 24 }}
                            />
                        </Box>
                        <Editor
                            height="calc(100% - 40px)"
                            width="100%"
                            language={language}
                            value={code}
                            onChange={setCode}
                            theme={isDark ? "vs-dark" : "light"}
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                                tabSize: 2,
                                lineNumbers: 'on',
                            }}
                        />
                    </Box>

                    {/* Resizer */}
                    <Box
                        sx={{
                            width: '6px',
                            height: '100%',
                            backgroundColor: isDark ? '#2d2d2d' : '#e0e0e0',
                            cursor: 'col-resize',
                            zIndex: 10,
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            document.addEventListener('mousemove', handleResize);
                            document.addEventListener('mouseup', () => {
                                document.removeEventListener('mousemove', handleResize);
                            }, { once: true });
                        }}
                    />

                    {/* Output */}
                    <Box sx={{
                        width: `${100 - splitRatio}%`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            pl: 2,
                            bgcolor: isDark ? '#1e1e1e' : '#f5f5f5',
                            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}`
                        }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Output Console
                            </Typography>
                            {isRunning && <LinearProgress sx={{ width: 100 }} />}
                        </Box>
                        <Box sx={{
                            overflow: 'auto',
                            backgroundColor: isDark ? '#1e1e1e' : '#f8f8f8',
                            color: isDark ? '#e0e0e0' : '#333',
                            fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                            fontSize: '14px',
                            padding: 2,
                            flex: 1
                        }}>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                {output || '// Code output will appear here after running your code...'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </MotionCard>

            {/* Local Storage Information Card */}
            <MotionBox
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={5}
                sx={{ mt: 3 }}
            >
                <Card
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.warning.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Storage color="warning" sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Your code is saved in local browser storage only
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This data is stored only on your device and is not synchronized with our servers.
                                Remember to save your work frequently and export any important code.
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </MotionBox>
        </Box>
    );
};

export default PracticePage;