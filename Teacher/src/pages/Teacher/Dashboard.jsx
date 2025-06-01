import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Import Teacher dashboard components
import DashboardHeader from '../../components/Dashboard/Header';
import DashboardSidebar from '../../components/Dashboard/Sidebar';

// Import Teacher dashboard pages
import DashboardHome from '../../pages/Teacher/DashboardHome';
import CompetitionManagement from '../../pages/Teacher/CompetitionManagement';
import ResultsManagement from '../../pages/Teacher/ResultsManagement';
import ProfilePage from '../../pages/Teacher/ProfilePage';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 10:33:35";
const CURRENT_USER = "VanshSharmaSDEI";

const Dashboard = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [title, setTitle] = useState('Dashboard');

    // Update title based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/dashboard' || path === '/dashboard/') {
            setTitle('Dashboard');
        } else if (path.includes('/dashboard/competitions')) {
            setTitle('Competition Management');
        } else if (path.includes('/dashboard/results')) {
            setTitle('Results Management');
        } else if (path.includes('/dashboard/profile')) {
            setTitle('Profile');
        }
    }, [location]);

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--background-color)',
            }}
        >
            {/* Dashboard Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onToggle={toggleSidebar}
                currentUser={CURRENT_USER}
            />

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
                    marginLeft: { xs: 0, md: isSidebarOpen ? 0 : -240 },
                    width: { xs: '100%', md: isSidebarOpen ? 'calc(100% - 240px)' : '100%' },
                    marginTop: { xs: '64px', md: '64px' }
                }}
            >
                {/* Dashboard Header */}
                <DashboardHeader
                    title={title}
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    currentDateTime={CURRENT_DATE_TIME}
                    currentUser={CURRENT_USER}
                />

                {/* Dashboard Content */}
                <Box sx={{ p: { xs: 2, md: 3 }, pt: { xs: 10, sm: 11 } }}>
                    <Routes>
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/competitions" element={<CompetitionManagement />} />
                        <Route path="/results" element={<ResultsManagement />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;