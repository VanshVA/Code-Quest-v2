import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Grid,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    AppBar,
    Toolbar,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tabs,
    Tab,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    Snackbar,
    Tooltip,
    useTheme
} from '@mui/material';
import {
    Description,
    PlayArrow,
    Stop,
    RestartAlt,
    ArrowBack,
    ArrowForward,
    Check,
    Close,
    ChevronLeft,
    ChevronRight,
    FullscreenExit,
    MoreVert,
    Settings,
    Warning,
    CheckCircle,
    ArrowRight,
    ArrowDropDown,
    LockOutlined,
    Timer,
    HourglassEmpty
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';

// Custom components
import SecurityCheck from '../../components/competition/SecurityCheck';
import CodeEditorHeader from '../../components/competition/CodeEditorHeader';
import TestCaseRunner from '../../components/competition/TestCaseRunner';

// Motion components
const MotionBox = motion(Box);

// Editor environments
const EDITOR_LANGUAGES = [
    { label: 'JavaScript', value: 'javascript', defaultCode: '// Write your JavaScript code here' },
    { label: 'Python', value: 'python', defaultCode: '# Write your Python code here' },
    { label: 'Java', value: 'java', defaultCode: '// Write your Java code here\nclass Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
    { label: 'C++', value: 'cpp', defaultCode: '#include <iostream>\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}' },
    { label: 'C#', value: 'csharp', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        // Write your C# code here\n    }\n}' },
];

// Default code for test cases
const defaultTests = {
    javascript: '// Test cases will be executed here',
    python: '# Test cases will be executed here',
    java: '// Test cases will be defined here',
    cpp: '// Test cases will be defined here',
    csharp: '// Test cases will be defined here',
};

// Current date and time for display
const CURRENT_DATE_TIME = "2025-05-30 06:59:45";

const CodeEditorScreen = () => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    // State for competition
    const [loading, setLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [userSolutions, setUserSolutions] = useState({});
    const [userLanguages, setUserLanguages] = useState({});

    // State for editor
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [code, setCode] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);

    // State for UI
    const [problemPanelOpen, setProblemPanelOpen] = useState(true);
    const [activeProblemTab, setActiveProblemTab] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [securityDialogOpen, setSecurityDialogOpen] = useState(true);
    const [securityCheckComplete, setSecurityCheckComplete] = useState(false);
    const [tabSwitchWarningOpen, setTabSwitchWarningOpen] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [remainingTime, setRemainingTime] = useState(120 * 60); // 2 hours in seconds

    // Load competition and questions
    useEffect(() => {
        // Disable tab switching
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Simulate API call to fetch competition and questions
        setTimeout(() => {
            setCompetition({
                id: Number(id),
                title: "Algorithm Challenge",
                description: "Test your algorithm skills with complex problems that require optimal solutions. This competition focuses on efficiency and correctness.",
                duration: 120, // 2 hours in minutes
                startTime: Date.now(),
                endTime: Date.now() + 120 * 60 * 1000, // 2 hours from now
            });

            setQuestions([
                {
                    id: 1,
                    title: "Two Sum",
                    difficulty: "Easy",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
                    examples: [
                        {
                            input: "nums = [2,7,11,15], target = 9",
                            output: "[0,1]",
                            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                        },
                        {
                            input: "nums = [3,2,4], target = 6",
                            output: "[1,2]",
                            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
                        },
                        {
                            input: "nums = [3,3], target = 6",
                            output: "[0,1]",
                            explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
                        },
                    ],
                    constraints: [
                        "2 ≤ nums.length ≤ 10^4",
                        "-10^9 ≤ nums[i] ≤ 10^9",
                        "-10^9 ≤ target ≤ 10^9",
                        "Only one valid answer exists."
                    ],
                    testCases: [
                        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
                        { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
                        { input: "[3,3], 6", expectedOutput: "[0,1]" },
                        { input: "[1,2,3,4,5], 9", expectedOutput: "[3,4]" },
                    ],
                    submissionStatus: 'not_attempted',
                    hintData: {
                        hint1: "Consider using a Hash Map/Dictionary to store values you've seen.",
                        hint2: "As you iterate through the array, check if (target - current value) exists in your map.",
                        hint3: "If it exists, you've found your pair. If not, add the current value to your map."
                    }
                },
                {
                    id: 2,
                    title: "Valid Parentheses",
                    difficulty: "Medium",
                    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
                    examples: [
                        { input: "s = \"()\"", output: "true" },
                        { input: "s = \"()[]{}\"", output: "true" },
                        { input: "s = \"(]\"", output: "false" },
                        { input: "s = \"([)]\"", output: "false" },
                        { input: "s = \"{[]}\"", output: "true" },
                    ],
                    constraints: [
                        "1 ≤ s.length ≤ 10^4",
                        "s consists of parentheses only '()[]{}'."
                    ],
                    testCases: [
                        { input: "\"()\"", expectedOutput: "true" },
                        { input: "\"()[]{}\"", expectedOutput: "true" },
                        { input: "\"(]\"", expectedOutput: "false" },
                        { input: "\"([)]\"", expectedOutput: "false" },
                        { input: "\"{[]}\"", expectedOutput: "true" },
                    ],
                    submissionStatus: 'not_attempted',
                    hintData: {
                        hint1: "Consider using a stack data structure.",
                        hint2: "Push opening brackets onto the stack and pop when you find a closing bracket.",
                        hint3: "The stack should be empty at the end for a valid string."
                    }
                },
                {
                    id: 3,
                    title: "Merge Two Sorted Lists",
                    difficulty: "Medium",
                    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
                    examples: [
                        {
                            input: "list1 = [1,2,4], list2 = [1,3,4]",
                            output: "[1,1,2,3,4,4]",
                            explanation: "The lists are merged to form a single, sorted linked list."
                        },
                        {
                            input: "list1 = [], list2 = []",
                            output: "[]",
                            explanation: "Both lists are empty, so the result is an empty list."
                        },
                        {
                            input: "list1 = [], list2 = [0]",
                            output: "[0]",
                            explanation: "The first list is empty, so the result is the second list."
                        },
                    ],
                    constraints: [
                        "The number of nodes in both lists is in the range [0, 50].",
                        "-100 <= Node.val <= 100",
                        "Both list1 and list2 are sorted in non-decreasing order."
                    ],
                    testCases: [
                        { input: "[1,2,4], [1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
                        { input: "[], []", expectedOutput: "[]" },
                        { input: "[], [0]", expectedOutput: "[0]" },
                    ],
                    submissionStatus: 'not_attempted',
                    hintData: {
                        hint1: "Create a dummy node to start your merged list.",
                        hint2: "Compare the values of the two lists and append the smaller value to your result.",
                        hint3: "Don't forget to handle the case when one list is exhausted before the other."
                    }
                },
                {
                    id: 4,
                    title: "Maximum Subarray",
                    difficulty: "Hard",
                    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.",
                    examples: [
                        {
                            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                            output: "6",
                            explanation: "The contiguous subarray [4,-1,2,1] has the largest sum = 6."
                        },
                        { input: "nums = [1]", output: "1" },
                        { input: "nums = [5,4,-1,7,8]", output: "23" },
                    ],
                    constraints: [
                        "1 <= nums.length <= 10^5",
                        "-10^4 <= nums[i] <= 10^4"
                    ],
                    testCases: [
                        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
                        { input: "[1]", expectedOutput: "1" },
                        { input: "[5,4,-1,7,8]", expectedOutput: "23" },
                    ],
                    submissionStatus: 'not_attempted',
                    hintData: {
                        hint1: "Consider using Kadane's algorithm for this problem.",
                        hint2: "Keep track of the current sum and the maximum sum found so far.",
                        hint3: "If the current sum becomes negative, reset it to 0 and start a new subarray."
                    }
                },
                {
                    id: 5,
                    title: "Binary Tree Level Order Traversal",
                    difficulty: "Hard",
                    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
                    examples: [
                        {
                            input: "root = [3,9,20,null,null,15,7]",
                            output: "[[3],[9,20],[15,7]]",
                            explanation: "The tree has three levels: root, level 1, and level 2."
                        },
                        { input: "root = [1]", output: "[[1]]" },
                        { input: "root = []", output: "[]" },
                    ],
                    constraints: [
                        "The number of nodes in the tree is in the range [0, 2000].",
                        "-1000 <= Node.val <= 1000"
                    ],
                    testCases: [
                        { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]" },
                        { input: "[1]", expectedOutput: "[[1]]" },
                        { input: "[]", expectedOutput: "[]" },
                    ],
                    submissionStatus: 'not_attempted',
                    hintData: {
                        hint1: "Consider using a queue for breadth-first traversal.",
                        hint2: "Process nodes level by level by tracking the number of nodes at each level.",
                        hint3: "For each level, collect all node values into a single array before moving to the next level."
                    }
                }
            ]);

            // Initialize user solutions with default code
            const initialSolutions = {};
            const initialLanguages = {};

            for (let i = 0; i < 5; i++) {
                initialSolutions[i] = EDITOR_LANGUAGES[0].defaultCode;
                initialLanguages[i] = 'javascript';
            }

            setUserSolutions(initialSolutions);
            setUserLanguages(initialLanguages);
            setCode(initialSolutions[0]);
            setLoading(false);
        }, 1500);

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [id]);

    // Countdown timer
    useEffect(() => {
        if (!competition || remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [competition, remainingTime]);

    // Format remaining time
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle tab/window switching
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && securityCheckComplete) {
            setTabSwitchCount(prev => prev + 1);
            setTabSwitchWarningOpen(true);

            // If user switches tabs too many times, end the competition
            if (tabSwitchCount >= 2) {
                handleTimeUp();
            }
        }
    };

    // Handle editor ready
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Set editor options
        editor.updateOptions({
            fontSize: 14,
            fontFamily: 'Fira Code, Menlo, Monaco, Consolas, "Courier New", monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            glyphMargin: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
        });
    };

    // Handle code changes
    const handleCodeChange = (value) => {
        setCode(value);

        // Save code for current question
        setUserSolutions(prev => ({
            ...prev,
            [activeQuestion]: value
        }));
    };

    // Handle language change
    const handleLanguageChange = (event) => {
        const newLang = event.target.value;
        setEditorLanguage(newLang);

        // Get default code for new language if user hasn't written any code yet
        const currentCode = userSolutions[activeQuestion];
        const isDefaultCode = EDITOR_LANGUAGES.some(lang => currentCode === lang.defaultCode);

        if (isDefaultCode) {
            const newDefaultCode = EDITOR_LANGUAGES.find(lang => lang.value === newLang)?.defaultCode || '';
            handleCodeChange(newDefaultCode);
        }

        // Save language preference for current question
        setUserLanguages(prev => ({
            ...prev,
            [activeQuestion]: newLang
        }));
    };

    // Handle question change
    const handleChangeQuestion = (index) => {
        // Save current solution
        setUserSolutions(prev => ({
            ...prev,
            [activeQuestion]: code
        }));

        // Switch to new question
        setActiveQuestion(index);
        setCode(userSolutions[index] || EDITOR_LANGUAGES.find(lang => lang.value === userLanguages[index])?.defaultCode);
        setEditorLanguage(userLanguages[index]);
        setActiveProblemTab(0); // Reset to problem description tab
    };

    // Handle run code
    const handleRunCode = () => {
        setIsExecuting(true);

        // Simulate code execution (in a real app, this would send code to a backend)
        setTimeout(() => {
            // Simplified test case checking
            const question = questions[activeQuestion];
            const testCases = question.testCases;

            // Mock execution results for different languages
            const results = testCases.map(testCase => {
                const passed = Math.random() > 0.3; // 70% chance to pass
                return {
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: passed ? testCase.expectedOutput : "Incorrect output",
                    passed,
                };
            });

            setExecutionResult({
                allPassed: results.every(r => r.passed),
                results,
                runtime: `${(Math.random() * 50 + 10).toFixed(2)}ms`,
                memory: `${(Math.random() * 5 + 10).toFixed(2)}MB`
            });

            setIsExecuting(false);

            // Update question status
            if (results.every(r => r.passed)) {
                const updatedQuestions = [...questions];
                updatedQuestions[activeQuestion].submissionStatus = 'passed';
                setQuestions(updatedQuestions);
            }
        }, 2000);
    };

    // Handle submit solution
    const handleSubmitSolution = () => {
        setIsExecuting(true);

        // Simulate submission process
        setTimeout(() => {
            // Mock submission results
            const passed = Math.random() > 0.3; // 70% chance to pass

            setExecutionResult({
                allPassed: passed,
                message: passed
                    ? "Solution passed all test cases!"
                    : "Solution failed on some hidden test cases.",
                runtime: `${(Math.random() * 50 + 10).toFixed(2)}ms`,
                memory: `${(Math.random() * 5 + 10).toFixed(2)}MB`
            });

            // Update question status
            const updatedQuestions = [...questions];
            updatedQuestions[activeQuestion].submissionStatus = passed ? 'passed' : 'failed';
            setQuestions(updatedQuestions);

            setIsExecuting(false);
        }, 3000);
    };

    // Handle security check completion
    const handleSecurityCheckComplete = () => {
        setSecurityCheckComplete(true);
        setSecurityDialogOpen(false);
    };

    // Handle time up
    const handleTimeUp = () => {
        // In a real app, submit all solutions automatically
        navigate(`/dashboard/competition/result/${id}`);
    };

    // Difficulty color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return theme.palette.success.main;
            case 'Medium':
                return theme.palette.warning.main;
            case 'Hard':
                return theme.palette.error.main;
            default:
                return theme.palette.info.main;
        }
    };

    // Get status color for question
    const getStatusColor = (status) => {
        switch (status) {
            case 'passed':
                return theme.palette.success.main;
            case 'failed':
                return theme.palette.error.main;
            case 'in_progress':
                return theme.palette.warning.main;
            case 'not_attempted':
            default:
                return theme.palette.text.disabled;
        }
    };

    // Get status icon for question
    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
            case 'failed':
                return <Close fontSize="small" sx={{ color: theme.palette.error.main }} />;
            case 'in_progress':
                return <HourglassEmpty fontSize="small" sx={{ color: theme.palette.warning.main }} />;
            case 'not_attempted':
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} sx={{ color: 'var(--theme-color)' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            {/* Security Check Dialog */}
            <Dialog
                open={securityDialogOpen}
                disableEscapeKeyDown
                disablePortal
                fullWidth
                maxWidth="sm"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        overflow: 'hidden',
                    }
                }}
            >
                <DialogTitle sx={{ bgcolor: 'var(--theme-color)', color: 'white', display: 'flex', alignItems: 'center' }}>
                    <LockOutlined sx={{ mr: 1 }} />
                    Security Check
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <SecurityCheck onComplete={handleSecurityCheckComplete} />
                </DialogContent>
            </Dialog>

            {/* Tab Switch Warning Dialog */}
            <Snackbar
                open={tabSwitchWarningOpen}
                autoHideDuration={5000}
                onClose={() => setTabSwitchWarningOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setTabSwitchWarningOpen(false)}
                >
                    <Box>
                        <Typography variant="body1" fontWeight="bold" gutterBottom>
                            Warning: Tab Switch Detected!
                        </Typography>
                        <Typography variant="body2">
                            Switching tabs is not allowed during the competition. This incident has been recorded.
                            {tabSwitchCount >= 2 && " Further violations will result in disqualification."}
                        </Typography>
                    </Box>
                </Alert>
            </Snackbar>

            {/* Header with Timer and Controls */}
            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{
                    bgcolor: 'var(--background-color)',
                    borderBottom: '1px solid var(--background-shadow)',
                    zIndex: 1100,
                }}
            >
                <Toolbar sx={{ px: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mr: 2 }}>
                            {competition.title}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 0.5,
                                px: 2,
                                borderRadius: '20px',
                                bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                                border: '1px solid rgba(var(--theme-color-rgb), 0.2)',
                                color: 'var(--theme-color)',
                            }}
                        >
                            <Timer sx={{ mr: 0.5, fontSize: 20 }} />
                            <Typography
                                variant="body1"
                                fontWeight="bold"
                                color={remainingTime < 300 ? 'error.main' : undefined}
                            >
                                {formatTime(remainingTime)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Language selector */}
                        <FormControl
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 120,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        >
                            <Select
                                value={editorLanguage}
                                onChange={handleLanguageChange}
                                displayEmpty
                                sx={{
                                    '&.MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                    },
                                    fontSize: '0.875rem',
                                }}
                            >
                                {EDITOR_LANGUAGES.map((language) => (
                                    <MenuItem key={language.value} value={language.value}>
                                        {language.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Theme selector */}
                        <FormControl
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 120,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        >
                            <Select
                                value={editorTheme}
                                onChange={(e) => setEditorTheme(e.target.value)}
                                displayEmpty
                                sx={{
                                    '&.MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(0,0,0,0.1)',
                                        },
                                    },
                                    fontSize: '0.875rem',
                                }}
                            >
                                <MenuItem value="vs-dark">Dark</MenuItem>
                                <MenuItem value="vs-light">Light</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Toggle problem panel button */}
                        <Button
                            variant="outlined"
                            onClick={() => setProblemPanelOpen(!problemPanelOpen)}
                            startIcon={problemPanelOpen ? <ChevronLeft /> : <ChevronRight />}
                            sx={{
                                borderRadius: '8px',
                                borderColor: 'rgba(0,0,0,0.1)',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'var(--theme-color)',
                                    bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                },
                            }}
                        >
                            {problemPanelOpen ? 'Hide Problem' : 'Show Problem'}
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitSolution}
                            disabled={isExecuting}
                            sx={{
                                borderRadius: '8px',
                                bgcolor: 'var(--theme-color)',
                                '&:hover': {
                                    bgcolor: 'var(--hover-color)',
                                },
                                fontWeight: 'bold',
                            }}
                        >
                            {isExecuting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </Toolbar>

                {/* Questions navigation */}
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        overflowX: 'auto',
                        px: 2,
                        pb: 1,
                        '&::-webkit-scrollbar': {
                            height: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'rgba(0,0,0,0.05)',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '2px',
                        },
                    }}
                >
                    {questions.map((question, index) => (
                        <Button
                            key={question.id}
                            variant={activeQuestion === index ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleChangeQuestion(index)}
                            startIcon={getStatusIcon(question.submissionStatus)}
                            sx={{
                                mr: 1,
                                mb: 0.5,
                                borderRadius: '8px',
                                ...(activeQuestion === index ? {
                                    bgcolor: 'var(--theme-color)',
                                    '&:hover': {
                                        bgcolor: 'var(--hover-color)',
                                    },
                                } : {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                    color: getStatusColor(question.submissionStatus),
                                    '&:hover': {
                                        borderColor: 'var(--theme-color)',
                                        bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                    },
                                }),
                            }}
                        >
                            {index + 1}. {question.title.length > 15 ? `${question.title.substring(0, 15)}...` : question.title}
                        </Button>
                    ))}
                </Box>
            </AppBar>

            {/* Main Editor Area */}
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {/* Problem Panel */}
                {problemPanelOpen && (
                    <Paper
                        sx={{
                            width: 450,
                            overflow: 'auto',
                            borderRight: '1px solid var(--background-shadow)',
                            borderRadius: 0,
                        }}
                    >
                        {/* Problem Details */}
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {activeQuestion + 1}. {questions[activeQuestion].title}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '12px',
                                        bgcolor: `${getDifficultyColor(questions[activeQuestion].difficulty)}15`,
                                        color: getDifficultyColor(questions[activeQuestion].difficulty),
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {questions[activeQuestion].difficulty}
                                </Box>
                            </Box>

                            {/* Problem tabs */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs
                                    value={activeProblemTab}
                                    onChange={(e, newValue) => setActiveProblemTab(newValue)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab label="Description" />
                                    <Tab label="Examples" />
                                    <Tab label="Hints" />
                                    <Tab label="Submissions" />
                                </Tabs>
                            </Box>

                            {/* Tab content */}
                            <Box>
                                {activeProblemTab === 0 && (
                                    <Box>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                                            {questions[activeQuestion].description}
                                        </Typography>

                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Constraints:
                                        </Typography>
                                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                                            {questions[activeQuestion].constraints.map((constraint, index) => (
                                                <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                                                    {constraint}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {activeProblemTab === 1 && (
                                    <Box>
                                        {questions[activeQuestion].examples.map((example, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    mb: 3,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Example {index + 1}:
                                                </Typography>

                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                        Input:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: '8px',
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.9rem',
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        {example.input}
                                                    </Box>

                                                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                        Output:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: '8px',
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.9rem',
                                                            mb: example.explanation ? 1.5 : 0,
                                                        }}
                                                    >
                                                        {example.output}
                                                    </Box>

                                                    {example.explanation && (
                                                        <>
                                                            <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ mt: 1.5 }}>
                                                                Explanation:
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {example.explanation}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {activeProblemTab === 2 && (
                                    <Box>
                                        <Typography variant="body2" paragraph>
                                            Need help? Here are some hints to guide you towards the solution:
                                        </Typography>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Hint 1:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {questions[activeQuestion].hintData.hint1}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Hint 2:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {questions[activeQuestion].hintData.hint2}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Hint 3:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {questions[activeQuestion].hintData.hint3}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {activeProblemTab === 3 && (
                                    <Box>
                                        <Typography variant="body2" paragraph>
                                            Your previous submissions for this problem:
                                        </Typography>

                                        {questions[activeQuestion].submissionStatus === 'not_attempted' ? (
                                            <Box sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                bgcolor: 'rgba(0,0,0,0.02)',
                                                borderRadius: '12px'
                                            }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    You haven't submitted a solution yet.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: questions[activeQuestion].submissionStatus === 'passed'
                                                        ? 'rgba(76, 175, 80, 0.1)'
                                                        : 'rgba(244, 67, 54, 0.1)',
                                                    border: `1px solid ${questions[activeQuestion].submissionStatus === 'passed'
                                                        ? 'rgba(76, 175, 80, 0.2)'
                                                        : 'rgba(244, 67, 54, 0.2)'}`,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        Submission #1
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: questions[activeQuestion].submissionStatus === 'passed'
                                                                ? theme.palette.success.main
                                                                : theme.palette.error.main
                                                        }}
                                                    >
                                                        {questions[activeQuestion].submissionStatus === 'passed' ? 'PASSED' : 'FAILED'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Language: {EDITOR_LANGUAGES.find(lang => lang.value === userLanguages[activeQuestion])?.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Submitted: Just now
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Code Editor */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Editor */}
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            language={editorLanguage}
                            theme={editorTheme}
                            value={code}
                            onChange={handleCodeChange}
                            onMount={handleEditorDidMount}
                            options={{
                                fontSize: 14,
                                fontFamily: "Fira Code, Menlo, Monaco, Consolas, 'Courier New', monospace",
                                minimap: { enabled: false },
                            }}
                            loading={<Typography sx={{ p: 2 }}>Loading editor...</Typography>}
                        />
                    </Box>

                    {/* Test Cases and Execution Result */}
                    <Paper
                        sx={{
                            height: '240px',
                            overflow: 'auto',
                            borderTop: '1px solid var(--background-shadow)',
                            borderRadius: 0,
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Test Results
                                </Typography>
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={handleRunCode}
                                        startIcon={<PlayArrow />}
                                        disabled={isExecuting}
                                        sx={{
                                            mr: 1,
                                            borderRadius: '8px',
                                            bgcolor: 'var(--theme-color)',
                                            '&:hover': {
                                                bgcolor: 'var(--hover-color)',
                                            },
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Run Code
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<RestartAlt />}
                                        disabled={isExecuting}
                                        sx={{
                                            borderRadius: '8px',
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            color: 'text.primary',
                                            '&:hover': {
                                                borderColor: 'var(--theme-color)',
                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                            },
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Box>
                            </Box>

                            {isExecuting ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CircularProgress size={40} sx={{ color: 'var(--theme-color)' }} />
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Executing your code...
                                    </Typography>
                                </Box>
                            ) : executionResult ? (
                                <Box>
                                    {executionResult.message ? (
                                        <Alert
                                            severity={executionResult.allPassed ? "success" : "error"}
                                            sx={{ mb: 2, borderRadius: '8px' }}
                                        >
                                            {executionResult.message}
                                        </Alert>
                                    ) : null}

                                    {executionResult.results ? (
                                        <Box>
                                            {executionResult.results.map((result, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        mb: 1,
                                                        p: 1.5,
                                                        borderRadius: '8px',
                                                        border: `1px solid ${result.passed ?
                                                            'rgba(76, 175, 80, 0.2)' :
                                                            'rgba(244, 67, 54, 0.2)'}`,
                                                        bgcolor: result.passed ?
                                                            'rgba(76, 175, 80, 0.05)' :
                                                            'rgba(244, 67, 54, 0.05)',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Test Case {index + 1}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: result.passed ? theme.palette.success.main : theme.palette.error.main,
                                                            }}
                                                        >
                                                            {result.passed ? (
                                                                <Check fontSize="small" sx={{ mr: 0.5 }} />
                                                            ) : (
                                                                <Close fontSize="small" sx={{ mr: 0.5 }} />
                                                            )}
                                                            <Typography
                                                                variant="caption"
                                                                fontWeight="bold"
                                                            >
                                                                {result.passed ? 'PASSED' : 'FAILED'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                                        <Grid item xs={4}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Input:
                                                            </Typography>
                                                            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                                                                {result.input}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={4}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Expected:
                                                            </Typography>
                                                            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                                                                {result.expectedOutput}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={4}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Output:
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontFamily="monospace"
                                                                sx={{
                                                                    wordBreak: 'break-all',
                                                                    color: !result.passed ? theme.palette.error.main : 'inherit'
                                                                }}
                                                            >
                                                                {result.actualOutput}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}

                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">
                                                    Runtime: <Box component="span" sx={{ fontWeight: 'bold' }}>{executionResult.runtime}</Box>
                                                </Typography>
                                                <Typography variant="body2">
                                                    Memory: <Box component="span" sx={{ fontWeight: 'bold' }}>{executionResult.memory}</Box>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : null}
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                                        Run your code to see the results
                                    </Typography>
                                    <Typography variant="body2">
                                        Your solution will be tested against the example test cases.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default CodeEditorScreen;