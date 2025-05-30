import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Divider,
    useTheme,
    Collapse,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    EmojiEvents as CompetitionsIcon,
    Assessment as ResultsIcon,
    Person as ProfileIcon,
    ChevronLeft,
    Code,
    Laptop,
    School,
    BarChart,
    Settings,
    Help,
    KeyboardDoubleArrowRight
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Motion components
const MotionBox = motion(Box);

// Sidebar width
const DRAWER_WIDTH = 260;

const Sidebar = ({ open, onClose, currentPath, isMobile }) => {
    const theme = useTheme();

    // Main navigation items
    const mainNavItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', exact: true },
        { text: 'Competitions', icon: <CompetitionsIcon />, path: '/dashboard/competitions' },
        { text: 'Results', icon: <ResultsIcon />, path: '/dashboard/results' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/dashboard/profile' },
    ];

    // Utility nav items
    const utilityNavItems = [
        { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
        { text: 'Help & Support', icon: <Help />, path: '/dashboard/help' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return currentPath === path;
        }
        return currentPath === path || (currentPath.startsWith(path + '/') && path !== '/dashboard');
    };

    // Animation variants
    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.1 * custom,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo and close button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    height: 70,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            background: 'var(--theme-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        <Laptop />
                    </Box>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                        Code-Quest
                    </Typography>
                </Box>
                {open && (
                    <IconButton onClick={onClose}>
                        <ChevronLeft />
                    </IconButton>
                )}
            </Box>
            <Divider />

            {/* Main navigation */}
            <List sx={{ px: 2 }}>
                {mainNavItems.map((item, index) => (
                    <MotionBox
                        key={item.text}
                        component={motion.div}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={listItemVariants}
                    >
                        <ListItem
                            button
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.5,
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: isActive(item.path, item.exact) ? 'rgba(var(--theme-color-rgb), 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: isActive(item.path, item.exact) ? 'rgba(var(--theme-color-rgb), 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                },
                                ...(isActive(item.path, item.exact) && {
                                    color: 'var(--theme-color)',
                                    fontWeight: 'bold',
                                })
                            }}
                        >
                            {isActive(item.path, item.exact) && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        backgroundColor: 'var(--theme-color)',
                                        borderRadius: 4,
                                    }}
                                />
                            )}
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: isActive(item.path, item.exact) ? 'var(--theme-color)' : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: isActive(item.path, item.exact) ? 600 : 400,
                                }}
                            />
                            {isActive(item.path, item.exact) && (
                                <KeyboardDoubleArrowRight
                                    fontSize="small"
                                    sx={{
                                        color: 'var(--theme-color)',
                                        opacity: 0.6
                                    }}
                                />
                            )}
                        </ListItem>
                    </MotionBox>
                ))}
            </List>

            {/* Secondary navigation */}
            <Typography
                variant="overline"
                sx={{
                    px: 3,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    letterSpacing: '0.08em',
                }}
            >
                Utility Navigation
            </Typography>

            {/* Utility navigation */}
            <Divider />
            <List sx={{ px: 2 }}>
                {utilityNavItems.map((item, index) => (
                    <MotionBox
                        key={item.text}
                        component={motion.div}
                        custom={index + mainNavItems.length + utilityNavItems.length}
                        initial="hidden"
                        animate="visible"
                        variants={listItemVariants}
                    >
                        <ListItem
                            button
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.5,
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: isActive(item.path) ? 'rgba(var(--theme-color-rgb), 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: isActive(item.path) ? 'rgba(var(--theme-color-rgb), 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                },
                                ...(isActive(item.path) && {
                                    color: 'var(--theme-color)',
                                    fontWeight: 'bold',
                                })
                            }}
                        >
                            {isActive(item.path) && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        backgroundColor: 'var(--theme-color)',
                                        borderRadius: 4,
                                    }}
                                />
                            )}
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: isActive(item.path) ? 'var(--theme-color)' : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: isActive(item.path) ? 600 : 400,
                                }}
                            />
                            {isActive(item.path) && (
                                <KeyboardDoubleArrowRight
                                    fontSize="small"
                                    sx={{
                                        color: 'var(--theme-color)',
                                        opacity: 0.6
                                    }}
                                />
                            )}
                        </ListItem>
                    </MotionBox>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: open ? DRAWER_WIDTH : 0 }, flexShrink: { md: 0 } }}
        >
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        border: 'none',
                        boxShadow: isMobile ? '0 0 35px rgba(0, 0, 0, 0.1)' : 'none',
                        backgroundColor: 'var(--background-color)',
                        // marginTop:"10vh",
                        ...(isMobile && {
                            boxSizing: 'border-box',
                            background: 'var(--background-color)',
                        }),
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;