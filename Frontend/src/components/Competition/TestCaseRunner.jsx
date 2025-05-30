import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme
} from '@mui/material';
import { 
  CheckCircleOutline, 
  HighlightOff,
  PlayArrow,
  RestartAlt
} from '@mui/icons-material';

const TestCaseRunner = ({ language, code, testCases, onRun, onReset, isRunning, results }) => {
  const theme = useTheme();
  
  const getStatusColor = (status) => {
    return status ? theme.palette.success.main : theme.palette.error.main;
  };
  
  const getStatusIcon = (status) => {
    return status ? (
      <CheckCircleOutline sx={{ color: theme.palette.success.main }} />
    ) : (
      <HighlightOff sx={{ color: theme.palette.error.main }} />
    );
  };

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Test Cases
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onRun}
            startIcon={<PlayArrow />}
            disabled={isRunning}
            sx={{
              mr: 1,
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': {
                bgcolor: 'var(--hover-color)',
              },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestartAlt />}
            onClick={onReset}
            disabled={isRunning}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
      
      {/* Test Results */}
      {isRunning ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2, color: 'var(--theme-color)' }} />
          <Typography variant="body2" color="textSecondary">
            Running test cases...
          </Typography>
        </Box>
      ) : results ? (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: '12px', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Test Case</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Input</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expected</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Output</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          display: 'inline-block',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        {result.input}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          display: 'inline-block',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        {result.expectedOutput}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          display: 'inline-block',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: !result.passed ? theme.palette.error.main : 'inherit',
                        }}
                      >
                        {result.actualOutput}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(result.passed)}
                        label={result.passed ? 'Pass' : 'Fail'} 
                        size="small"
                        sx={{ 
                          bgcolor: `${getStatusColor(result.passed)}15`,
                          color: getStatusColor(result.passed),
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Runtime: <Box component="span" sx={{ fontWeight: 'bold' }}>{results.runtime || 'N/A'}</Box>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Memory: <Box component="span" sx={{ fontWeight: 'bold' }}>{results.memory || 'N/A'}</Box>
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <Typography variant="body2" color="textSecondary">
            Run your code to see test results
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestCaseRunner;