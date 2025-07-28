import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, Stack, CircularProgress, Alert
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { createZendeskTicket } from '../services/zendeskService';

const OPTIONS = [
  {
    key: 'consultation',
    label: 'Request a Private Design Consultation',
    subject: 'Private Design Consultation Request',
    body: 'I would like to request a private design consultation.'
  },
  {
    key: 'virtualTour',
    label: 'Book a Virtual Tour of a High-End AirSmart Home',
    subject: 'Virtual Tour Booking Request',
    body: 'I would like to book a virtual tour of a high-end AirSmart home.'
  },
  {
    key: 'architectPack',
    label: 'Receive a Custom Architectural Pack for Your Designer',
    subject: 'Architect Pack Request',
    body: 'I would like to receive a custom architectural pack for my designer.',
    allowFile: true,
  },
];

export default function MoreFeaturesDialog({ open, onClose }) {
  const { theme } = useTheme();
  const [step, setStep] = useState('select');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '', project: '', file: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (opt) => {
    setSelected(opt);
    setStep('form');
    setForm({
      name: '',
      email: '',
      subject: opt.subject || '',
      body: opt.body || '',
      project: '',
      file: null
    });
    setError('');
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Body sẽ là nội dung người dùng nhập, có thể thêm project nếu có
      let messageBody = form.body;
      if (form.project) {
        messageBody += `\nProject: ${form.project}`;
      }
      await createZendeskTicket({
        name: form.name,
        email: form.email,
        subject: form.subject,
        body: messageBody,
        file: selected.allowFile ? form.file : undefined,
      });
      setSuccess(true);
      setStep('done');
    } catch (err) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelected(null);
    setError('');
    setSuccess(false);
  };

  const textFieldStyles = {
    mb: 2,
    '& label.Mui-focused': {
      color: theme.colors.text.primary,
    },
    '& label': {
      color: theme.colors.text.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        color: theme.colors.text.primary,
      },
      '& fieldset': {
        borderColor: theme.colors.border.medium,
      },
      '&:hover fieldset': {
        borderColor: theme.colors.border.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.colors.text.primary,
      },
    },
    '& .MuiInputBase-input::placeholder': {
        color: theme.colors.text.secondary,
        opacity: 1,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: theme.colors.background.primary,
            borderRadius: 3,
            width: '95vw',
            maxWidth: '420px',
            maxHeight: 'none',
          }
        }
      }}
    >
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
        More Features
      </DialogTitle>
      <DialogContent sx={{ background: theme.colors.background.primary, px: 3, py: 2 }}>
        {step === 'select' && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {OPTIONS.map((opt) => (
              <Button 
                key={opt.key} 
                variant="outlined" 
                onClick={() => handleSelect(opt)} 
                sx={{ 
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.medium,
                  borderRadius: 2,
                  background: theme.colors.background.secondary,
                  '&:hover': {
                    borderColor: theme.colors.border.dark,
                    backgroundColor: theme.colors.background.tertiary
                  }
                }}>
                {opt.label}
              </Button>
            ))}
          </Stack>
        )}
        {step === 'form' && selected && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Message / Body"
              name="body"
              value={form.body}
              onChange={handleChange}
              fullWidth
              required
              multiline
              minRows={3}
              sx={textFieldStyles}
            />
            <TextField
              label="Project (optional)"
              name="project"
              value={form.project}
              onChange={handleChange}
              fullWidth
              sx={textFieldStyles}
            />
            {selected.allowFile && (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  mb: 2,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.medium,
                  borderRadius: 2,
                  background: theme.colors.background.secondary,
                  '&:hover': {
                    borderColor: theme.colors.border.dark,
                    backgroundColor: theme.colors.background.tertiary,
                  },
                }}
              >
                {form.file ? form.file.name : 'Upload PDF (optional)'}
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleChange}
                />
              </Button>
            )}
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, background: theme.isDark ? 'rgba(255, 86, 86, 0.1)' : 'rgba(255, 86, 86, 0.05)', border: `1px solid ${theme.isDark ? 'rgba(255, 86, 86, 0.3)' : 'rgba(255, 86, 86, 0.2)'}` }}>{error}</Alert>}
            <Stack direction="row" spacing={2}>
              <Button onClick={handleBack} disabled={loading} sx={{ color: theme.colors.text.secondary, borderColor: theme.colors.border.medium, borderRadius: 2, '&:hover': { borderColor: theme.colors.border.dark, background: theme.colors.background.tertiary } }}>Back</Button>
              <Button type="submit" variant="contained" disabled={loading} sx={{ borderRadius: 2 }}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Stack>
          </Box>
        )}
        {step === 'done' && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{'Your request has been submitted! Our team will contact you soon.'}</Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ background: theme.colors.background.secondary, borderTop: `1px solid ${theme.colors.border.light}`, px: 3, py: 2, borderRadius: '0 0 24px 24px' }}>
        <Button onClick={onClose} color="secondary" sx={{ color: theme.colors.text.secondary, borderColor: theme.colors.border.medium, borderRadius: 2, '&:hover': { borderColor: theme.colors.border.dark, background: theme.colors.background.tertiary } }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}