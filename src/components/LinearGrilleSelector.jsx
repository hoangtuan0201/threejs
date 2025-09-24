import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Box,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Home as HomeIcon,
  CropSquare as SquareIcon,
  RadioButtonUnchecked as CircleIcon,
  LinearScale as LinearIcon
} from '@mui/icons-material';
import { useMobile } from '../hooks/useMobile';

const grilleOptions = [
  {
    id: 'original',
    name: 'Original Grille',
    description: 'Original grille model from the scene',
    icon: HomeIcon
  },
  {
    id: 'normal',
    name: 'Normal Grille',
    description: 'Standard basic grille design',
    icon: SquareIcon
  },
  {
    id: 'round',
    name: 'Round Grille',
    description: 'Circular grille design',
    icon: CircleIcon
  },
  {
    id: 'linear-bulkhead',
    name: 'Linear Bulkhead',
    description: 'Linear grille in bulkhead unit',
    icon: LinearIcon
  },
];

export function LinearGrilleSelector({ 
  isVisible, 
  currentGrille, 
  onGrilleChange, 
  selectedHotspot = null
}) {
  const mobile = useMobile();
  const theme = useTheme();
  const [selectedGrille, setSelectedGrille] = useState(currentGrille || 'original');

  // Show selector only when a hotspot with grille config is selected
  const shouldShow = isVisible && selectedHotspot && selectedHotspot.grilleConfig && selectedHotspot.grilleConfig.hasGrilleSelector;

  useEffect(() => {
    if (currentGrille) {
      setSelectedGrille(currentGrille);
    }
  }, [currentGrille]);

  const handleGrilleSelect = (grilleId) => {
    setSelectedGrille(grilleId);
    onGrilleChange?.(grilleId);
  };

  if (!shouldShow) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: mobile.isMobile ? 20 : 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: mobile.isMobile ? '90vw' : 800,
        width: mobile.isMobile ? 'auto' : '100%'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          p: mobile.isMobile ? 2 : 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>

          <Chip 
            label="Grille Options" 
            size="large" 
            variant="outlined"
            sx={{ 
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main
            }}
          />
        </Box>
        
        <Grid 
          container 
          spacing={mobile.isMobile ? 1.5 : 2}
          justifyContent="center"
          alignItems="stretch"
        >
          {grilleOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedGrille === option.id;
            
            return (
              <Grid 
                item 
                xs={mobile.isMobile ? 6 : 3} 
                sm={3} 
                md={3} 
                key={option.id}
                sx={{ display: 'flex' }}
              >
                <Card
                  elevation={isSelected ? 4 : 1}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                    border: isSelected 
                      ? `2px solid ${theme.palette.primary.main}` 
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: isSelected 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : theme.palette.background.paper,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      elevation: 6,
                      borderColor: isSelected 
                        ? theme.palette.primary.main 
                        : alpha(theme.palette.primary.main, 0.3)
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleGrilleSelect(option.id)}
                    sx={{
                      height: '100%',
                      p: mobile.isMobile ? 1.5 : 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: mobile.isMobile ? 120 : 140,
                      flex: 1
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        textAlign: 'center', 
                        p: 0, 
                        '&:last-child': { pb: 0 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%'
                      }}
                    >
                      <IconComponent 
                        sx={{ 
                          fontSize: mobile.isMobile ? 28 : 36,
                          color: isSelected 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          mb: 1
                        }} 
                      />
                      <Typography 
                        variant={mobile.isMobile ? "caption" : "body2"}
                        component="h3"
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          color: isSelected 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary,
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}
                      >
                        {option.name}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{ 
                          color: theme.palette.text.secondary,
                          lineHeight: 1.2,
                          fontSize: mobile.isMobile ? '0.65rem' : '0.7rem',
                          textAlign: 'center',
                          display: mobile.isMobile ? 'none' : 'block'
                        }}
                      >
                        {option.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        

      </Paper>
    </Box>
  );
}