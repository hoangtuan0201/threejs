import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useMobile } from '../hooks/useMobile';
import FileViewerDialog from './FileViewerDialog';
import { getFilesFromFolder, getFileViewUrl, getFileDownloadUrl } from '../services/wasabiService';

const FileManagerPopup = ({ open, onClose, folderName = "Salesperson", userRole = "Engineer" }) => {
  const { theme } = useTheme();
  const mobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (open) {
      loadFilesFromWasabi();
    }
  }, [open]);

  const loadFilesFromWasabi = async () => {
    setLoading(true);
    setError(null);

    // Set a timeout for Wasabi request
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 8000) // 8 seconds
    );

    try {
      // Race between Wasabi request and timeout
      const wasabiFiles = await Promise.race([
        getFilesFromFolder(''), // Load all files (backend already filters by role)
        timeoutPromise
      ]);

      if (wasabiFiles && wasabiFiles.length > 0) {
        // Convert Wasabi files to our format
        const formattedFiles = await Promise.all(
          wasabiFiles.map(async (file, index) => {
            try {
              const viewUrl = await getFileViewUrl(file.key, 3600); // 1 hour expiry
              return {
                id: index + 1,
                name: file.name,
                size: file.size,
                date: new Date(file.lastModified).toLocaleDateString(),
                type: getFileTypeFromName(file.name),
                url: viewUrl,
                key: file.key,
                description: `Document from Wasabi storage`
              };
            } catch (error) {
              // Error processing file
              return null;
            }
          })
        );

        const validFiles = formattedFiles.filter(file => file !== null);
        if (validFiles.length > 0) {
          setFiles(validFiles);
          return;
        }
      }

      // If no files found, show error
      setError('No files found in storage.');
      setFiles([]);

    } catch (error) {
      console.error('Error loading files from Wasabi:', error);
      setError('Failed to load files. Please try again.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeFromName = (fileName) => {
    const extension = fileName.toLowerCase().split('.').pop();
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (['doc', 'docx'].includes(extension)) return 'doc';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    return 'unknown';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#d32f2f' }} />;
      case 'doc':
      case 'docx':
        return <DocIcon sx={{ color: '#1976d2' }} />;
      case 'image':
      case 'jpg':
      case 'png':
        return <ImageIcon sx={{ color: '#388e3c' }} />;
      default:
        return <FileIcon sx={{ color: theme.colors.text.secondary }} />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewFile = (file) => {
    setSelectedFile(file);
  };

  const handleDownloadFile = async (file) => {
    try {
      let downloadUrl = file.url;

      // If file has Wasabi key, generate download URL
      if (file.key) {
        downloadUrl = await getFileDownloadUrl(file.key, 300); // 5 minutes expiry
      }

      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to direct URL
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCloseViewer = () => {
    setSelectedFile(null);
  };

  return (
    <>
      {/* File Manager Dialog */}
      <Dialog
        open={open && !selectedFile}
        onClose={onClose}
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: theme.colors.background.primary,
              borderRadius: 3,
              width: mobile.isMobile ? '95vw' : '90vw',
              height: mobile.isMobile ? '90vh' : '85vh',
              maxWidth: 'none',
              maxHeight: 'none',
            }
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FolderIcon sx={{ color: theme.colors.text.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              My Files - {userRole}
            </Typography>
            <Chip
              label={`${filteredFiles.length} files`}
              size="small"
              sx={{
                background: theme.colors.background.tertiary,
                color: theme.colors.text.secondary,
                fontSize: '0.75rem'
              }}
            />
          </Box>
          <IconButton onClick={onClose} sx={{ color: theme.colors.text.secondary }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Search Bar */}
          <Box sx={{ p: 3, pb: 2, flexShrink: 0 }}>
            <TextField
              fullWidth
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.colors.text.tertiary }} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: theme.colors.background.secondary,
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: theme.colors.border.light,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.colors.border.medium,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.colors.text.primary,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: theme.colors.text.primary,
                  '&::placeholder': {
                    color: theme.colors.text.tertiary,
                  },
                },
              }}
            />
          </Box>

          {/* File List */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress sx={{ color: theme.colors.text.primary, mb: 2 }} />
                <Typography color={theme.colors.text.secondary}>
                  Loading files...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    background: theme.isDark ? 'rgba(255, 86, 86, 0.1)' : 'rgba(255, 86, 86, 0.05)',
                    border: `1px solid ${theme.isDark ? 'rgba(255, 86, 86, 0.3)' : 'rgba(255, 86, 86, 0.2)'}`,
                    borderRadius: 2,
                    p: 3,
                    mb: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#ff5656', mb: 2 }}>
                    ⚠️ {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={loadFilesFromWasabi}
                    sx={{
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.medium,
                      '&:hover': {
                        borderColor: theme.colors.border.dark,
                        background: theme.colors.background.tertiary,
                      },
                    }}
                  >
                    Try Again
                  </Button>
                </Box>
              </Box>
            ) : filteredFiles.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <FolderIcon sx={{ fontSize: 48, color: theme.colors.text.tertiary, mb: 2 }} />
                <Typography color={theme.colors.text.secondary}>
                  No files found
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.tertiary, mt: 1 }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'No files available'}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredFiles.map((file, index) => (
                  <Box key={file.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          background: theme.colors.background.secondary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getFileIcon(file.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              color: theme.colors.text.primary,
                              fontWeight: 500,
                              fontSize: '0.95rem',
                            }}
                          >
                            {file.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color: theme.colors.text.tertiary,
                              fontSize: '0.8rem',
                              mt: 0.5,
                            }}
                          >
                            {file.size} • {file.date}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewFile(file)}
                          sx={{
                            color: theme.colors.text.secondary,
                            '&:hover': {
                              background: theme.colors.background.tertiary,
                              color: theme.colors.text.primary,
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadFile(file)}
                          sx={{
                            color: theme.colors.text.secondary,
                            '&:hover': {
                              background: theme.colors.background.tertiary,
                              color: theme.colors.text.primary,
                            },
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < filteredFiles.length - 1 && (
                      <Divider sx={{ borderColor: theme.colors.border.light }} />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              pt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${theme.colors.border.light}`,
              background: theme.colors.background.secondary,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: theme.colors.text.tertiary }}
            >
              {filteredFiles.length} files in {folderName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: theme.colors.text.secondary,
                  borderColor: theme.colors.border.medium,
                  '&:hover': {
                    borderColor: theme.colors.border.dark,
                    background: theme.colors.background.tertiary,
                  },
                }}
              >
                Close
              </Button>
              
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* File Viewer Dialog */}
      {selectedFile && (
        <FileViewerDialog
          file={selectedFile}
          open={!!selectedFile}
          onClose={handleCloseViewer}
          onDownload={() => handleDownloadFile(selectedFile)}
        />
      )}
    </>
  );
};

export default FileManagerPopup;
