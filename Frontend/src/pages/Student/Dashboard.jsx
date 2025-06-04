import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Import Student dashboard components
import DashboardHeader from '../../components/Dashboard/Header';
import DashboardSidebar from '../../components/Dashboard/Sidebar';

// Import Student dashboard pages
import DashboardHome from './DashboardHome';
import CompetitionsPage from './CompetitionListPage';
import CompetitionExamPage from './CompetitionExamPage';
import CompetitionResultPage from './CompetitionResultsPage';
import ProfilePage from './ProfilePage';
import PracticePage from './PracticePage';
import NotFoundPage from '../Error404/Error404Page';


// Current date and time
const CURRENT_DATE_TIME = "";
const CURRENT_USER = "";

const Dashboard = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [title, setTitle] = useState('Dashboard');

    // Update title based on current route
    useEffect(() => {
        const path = location.pathname;

        // Simplified route titles
        if (path === '/student' || path === '/student/dashboard') {
            setTitle('Dashboard');
        } else if (path.includes('/student/profile')) {
            setTitle('My Profile');
        } else if (path.includes('/student/competitions/') && path.includes('/exam')) {
            setTitle('Competition Exam');
        } else if (path.includes('/student/competitions')) {
            setTitle('Competitions');
        } else if (path.includes('/student/results')) {
            setTitle('Competition Result');
        } else if (path.includes('/student/practice')) {
            setTitle('Practice');
        }

    }, [location]);

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Determine if the current route should hide the sidebar and header
    // For example, during an exam
    const shouldHideSidebarAndHeader = location.pathname.includes('/exam');

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--background-color)',
            }}
        >
            {/* Dashboard Sidebar */}
            {!shouldHideSidebarAndHeader && (
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    onToggle={toggleSidebar}
                    currentUser={CURRENT_USER}
                />
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    transition: theme => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: {
                        xs: 0,
                        md: shouldHideSidebarAndHeader ? 0 : (isSidebarOpen ? 0 : -240)
                    },
                    width: {
                        xs: '100%',
                        md: shouldHideSidebarAndHeader ? '100%' : (isSidebarOpen ? 'calc(100% - 240px)' : '100%')
                    },
                    marginTop: shouldHideSidebarAndHeader ? 0 : { xs: '64px', md: '64px' }
                }}
            >
                {/* Dashboard Header */}
                {!shouldHideSidebarAndHeader && (
                    <DashboardHeader
                        title={title}
                        onToggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                        currentDateTime={CURRENT_DATE_TIME}
                        currentUser={CURRENT_USER}
                    />
                )}

                {/* Dashboard Content */}
                <Box
                    sx={{
                        p: shouldHideSidebarAndHeader ? 0 : { xs: 2, md: 3 },
                        pt: shouldHideSidebarAndHeader ? 0 : { xs: 10, sm: 11 }
                    }}
                >
                    <Routes>
                        {/* Dashboard Home */}
                        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
                        <Route
                            path="/dashboard"
                            element={
                                <DashboardHome
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Competitions Routes */}
                        <Route
                            path="/competitions"
                            element={
                                <CompetitionsPage
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Competition Exam Route */}
                        <Route
                            path="/competition/:id/exam"
                            element={
                                <CompetitionExamPage
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Competition Result Route */}
                        <Route
                            path="/results"
                            element={
                                <CompetitionResultPage
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Profile Page */}
                        <Route
                            path="/profile"
                            element={
                                <ProfilePage
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Practice Page */}
                        <Route
                            path="/practice"
                            element={
                                <PracticePage
                                    currentDateTime={CURRENT_DATE_TIME}
                                    currentUser={CURRENT_USER}
                                />
                            }
                        />

                        {/* Catch All Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;