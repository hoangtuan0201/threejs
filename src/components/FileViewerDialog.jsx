import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { getFileType } from '../services/filesService';

const FileViewerDialog = ({ open, onClose, file }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!file) return null;

  const fileType = getFileType(file.name);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError('Failed to load file');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(file.url, '_blank');
  };

  const renderFileContent = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <Box sx={{ width: '100%', height: '70vh', position: 'relative' }}>
            {loading && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <CircularProgress sx={{ color: theme.colors.text.primary }} />
              </Box>
            )}
            <iframe
              src={file.url}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              onLoad={handleLoad}
              onError={handleError}
              title={file.name}
            />
          </Box>
        );

      case 'image':
        return (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: '70vh',
            overflow: 'auto',
            background: theme.colors.background.tertiary,
          }}>
            {loading && <CircularProgress sx={{ color: theme.colors.text.primary }} />}
            <img
              src={file.url}
              alt={file.name}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: loading ? 'none' : 'block'
              }}
              onLoad={handleLoad}
              onError={handleError}
            />
          </Box>
        );

      case 'video':
        return (
          <Box sx={{ width: '100%', maxHeight: '70vh' }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: theme.colors.text.primary }} />
              </Box>
            )}
            <video
              controls
              width="100%"
              style={{ maxHeight: '70vh', display: loading ? 'none' : 'block' }}
              onLoadedData={handleLoad}
              onError={handleError}
            >
              <source src={file.url} />
              Your browser does not support the video tag.
            </video>
          </Box>
        );

      case 'audio':
        return (
          <Box sx={{ width: '100%', py: 4 }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: theme.colors.text.primary }} />
              </Box>
            )}
            <audio
              controls
              style={{ width: '100%', display: loading ? 'none' : 'block' }}
              onLoadedData={handleLoad}
              onError={handleError}
            >
              <source src={file.url} />
              Your browser does not support the audio tag.
            </audio>
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
              Preview not available
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }} gutterBottom>
              This file type cannot be previewed in the browser.
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                mt: 2,
                background: theme.gradients.accent,
                color: theme.colors.text.inverse,
                '&:hover': {
                  background: theme.gradients.secondary,
                },
              }}
            >
              Download to view
            </Button>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: '90vh',
            background: theme.colors.background.primary,
            borderRadius: 2,
          }
        }
      }}
      sx={{
        zIndex: 1400
      }}
    >
      <DialogTitle
        sx={{
          background: theme.colors.background.secondary,
          color: theme.colors.text.primary,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap sx={{ flex: 1, mr: 2, fontWeight: 600 }}>
            {file.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleOpenInNewTab}
              title="Open in new tab"
              sx={{ color: theme.colors.text.secondary }}
            >
              <FullscreenIcon />
            </IconButton>
            <IconButton
              onClick={handleDownload}
              title="Download"
              sx={{ color: theme.colors.text.secondary }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              onClick={onClose}
              title="Close"
              sx={{ color: theme.colors.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          background: theme.colors.background.tertiary,
        }}
      >
        {error ? (
          <Alert
            severity="error"
            sx={{
              m: 2,
              background: theme.isDark ? 'rgba(255, 86, 86, 0.1)' : 'rgba(255, 86, 86, 0.05)',
              color: theme.colors.text.primary,
            }}
          >
            {error}
          </Alert>
        ) : (
          renderFileContent()
        )}
      </DialogContent>

      <DialogActions
        sx={{
          background: theme.colors.background.secondary,
          borderTop: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <Typography variant="caption" sx={{ color: theme.colors.text.tertiary, mr: 'auto' }}>
          {file.size} • {file.date}
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            color: theme.colors.text.secondary,
            '&:hover': {
              background: theme.colors.background.tertiary,
            },
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          variant="contained"
          sx={{
            background: theme.gradients.accent,
            color: theme.colors.text.inverse,
            '&:hover': {
              background: theme.gradients.secondary,
            },
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerDialog;
