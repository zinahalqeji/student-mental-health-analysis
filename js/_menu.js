createMenu('Student Mental Health Analysis', [
  { name: 'Overview', script: 'overview.js' },

  { name: 'Analysis', sub: [
    { name: 'Sleep Analysis', script: 'sleep-analysis.js' },
    { name: 'Academic Pressure', script: 'pressure-analysis.js' },
    { name: 'Work Hours', script: 'work-analysis.js' }
  ]},

  { name: 'Conclusion', script: 'conclusion.js' }
]);