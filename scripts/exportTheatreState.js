// Script to help export Theatre.js state for multiple scenes
// Run this in browser console when in development mode

// console.log(`
// 🎬 Theatre.js State Export Helper

// To export state for both scenes:

// 1. Open dev tools console
// 2. Navigate through both scenes (main + detail)
// 3. Adjust camera positions as needed
// 4. Run: window.exportTheatreState()

// This will download the complete state JSON file.

// Current available functions:
// - window.exportTheatreState() - Export complete state
// `);

// Helper function to check current state
window.checkTheatreState = () => {
  if (typeof project !== 'undefined') {
    const state = project.getState();
    // console.log('Current Theatre.js State:');
    // console.log('Sheets:', Object.keys(state.sheetsById));
    
    Object.keys(state.sheetsById).forEach(sheetName => {
      const sheet = state.sheetsById[sheetName];
      // console.log(`Sheet "${sheetName}":`, {
      //   hasSequence: !!sheet.sequence,
      //   sequenceLength: sheet.sequence?.length,
      //   objects: Object.keys(sheet.sequence?.tracksByObject || {})
      // });
    });
  } else {
    // console.log('Theatre.js project not available');
  }
};

// Auto-run check
if (typeof window !== 'undefined') {
  setTimeout(() => {
    window.checkTheatreState?.();
  }, 1000);
}
