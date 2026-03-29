import { students } from './exports/initial-data.js';

addMdToPage(`# Academic Pressure Analysis`);

addMdToPage(`
Here we explore how self-reported academic pressure relates to depression.
Academic pressure is numeric, which allows us to compute averages and correlations.
`);

// Filter out missing values
const validPressure = students.filter(s => 
  s.academicPressure !== null && !isNaN(s.academicPressure)
);

// Prepare arrays for correlation
const pressure = validPressure.map(s => s.academicPressure);
const depBinary = validPressure.map(s => s.depression === "Yes" ? 1 : 0);

// Compute correlation
const corrPressure = s.sampleCorrelation(pressure, depBinary);

addMdToPage(`
**Correlation between academic pressure and depression (Yes=1, No=0):** ${corrPressure.toFixed(3)}
`);

// Group by academic pressure level
const groupedPressure = {};

for (const s of validPressure) {
  const level = s.academicPressure;

  if (!groupedPressure[level]) {
    groupedPressure[level] = { level, participants: 0, depressed: 0 };
  }

  groupedPressure[level].participants++;

  if (s.depression === "Yes") {
    groupedPressure[level].depressed++;
  }
}

// Convert grouped data into rows
let rowsPressure = Object.values(groupedPressure).map(r => ({
  academicPressure: r.level,
  participants: r.participants,
  depressionRate: r.depressed / r.participants
}));

// Sort by pressure level
rowsPressure = rowsPressure.toSorted((a, b) => a.academicPressure - b.academicPressure);

// TABLE — show full data
tableFromData({
  data: rowsPressure,
  numberFormatOptions: { maximumFractionDigits: 3 }
});

// CHART — only include the two needed fields
const chartRows = rowsPressure.map(r => ({
  academicPressure: r.academicPressure,
  depressionRate: r.depressionRate
}));

drawGoogleChart({
  type: 'LineChart',
  data: makeChartFriendly(chartRows, 'academicPressure', 'depressionRate'),
  options: {
    title: 'Depression rate by academic pressure level',
    height: 500,
    hAxis: { title: 'Academic pressure' },
    vAxis: { title: 'Share depressed (0–1)' }
  }
});

addMdToPage(`
A positive correlation and increasing depression rates at higher pressure levels
suggest that perceived academic stress is an important factor for mental health.
`);
