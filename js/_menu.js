createMenu('Student Mental Health Analysis', [

  { name: 'Introduction', script: 'intro.js' },

  { name: 'Overview', script: 'overview.js' },

  { name: 'Data Dictionary', script: 'data-dictionary.js' },

  { name: 'Analysis', sub: [
      { name: 'Academic Pressure', script: 'pressure-analysis.js' },
      { name: 'Sleep Analysis', script: 'sleep-analysis.js' },
      { name: 'Work/Study Hours', script: 'work-analysis.js' }
  ]},

  { name: 'Hypothesis Testing', script: 'hypothesis-testing.js' },

  { name: 'Conclusion', script: 'conclusion.js' }

]);
