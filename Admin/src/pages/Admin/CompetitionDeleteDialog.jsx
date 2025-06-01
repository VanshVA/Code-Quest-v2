import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Warning, Delete, Cancel } from '@mui/icons-material';

const CompetitionDeleteDialog = ({ open, onClose, onConfirm, competition, loading }) => {
  const theme = useTheme();

  if (!competition) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" sx={{ fontSize: 24 }} />
        Confirm Competition Deletion
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText color="error.main" sx={{ mb: 2 }}>
          You are about to delete the following competition:
        </DialogContentText>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: 'error.light', 
          color: 'error.contrastText', 
          borderRadius: '8px',
          mb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">
            {competition.competitionName}
          </Typography>
          <Typography variant="body2">
            Competition ID: {competition.id}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Creator: {competition.creatorName}
          </Typography>
          <Typography variant="body2">
            Rounds: {competition.roundsCount}
          </Typography>
        </Box>
        
        <DialogContentText fontWeight="medium" color="error.main" sx={{ mb: 1 }}>
          This action cannot be undone. Are you sure you want to proceed?
        </DialogContentText>
        
        <DialogContentText variant="body2">
          Deleting this competition will:
        </DialogContentText>
        
        <Box component="ul" sx={{ mt: 1 }}>
          <Typography component="li" variant="body2">
            Remove all competition data permanently
          </Typography>
          <Typography component="li" variant="body2">
            Delete all rounds and questions
          </Typography>
          <Typography component="li" variant="body2">
            Remove all participant records for this competition
          </Typography>
          {competition.hasWinner && (
            <Typography component="li" variant="body2" fontWeight="medium">
              Delete all winner information and results
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          startIcon={<Cancel />}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
          sx={{ borderRadius: '8px' }}
        >
          {loading ? 'Deleting...' : 'Delete Competition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompetitionDeleteDialog;