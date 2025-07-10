// Helper functions for Theatre.js scene management

export const exportTheatreState = () => {
  if (window.studio) {
    const state = window.studio.createContentOfSaveFile();
    // console.log('Theatre.js State:', JSON.stringify(state, null, 2));
    
    // Download as file
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theatre-state.json';
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Call this in console to export current state
window.exportTheatreState = exportTheatreState;
