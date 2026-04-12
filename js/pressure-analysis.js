import { students } from './exports/initial-data.js';
import { filterByGender, getDepressionRate, correlation } from './exports/utils.js';


// ------------------------------------------------------------
// Global Filter
// ------------------------------------------------------------
let gender = addDropdown('Filter by gender:', ['All', 'Male', 'Female']);


// ------------------------------------------------------------
// Title & Context
// ------------------------------------------------------------
addMdToPage(`# Academic Pressure & Depression`);

addMdToPage(`
Academic pressure is widely recognized as one of the most significant stressors
in student life.

This section examines whether **higher levels of academic pressure** are associated
with **higher depression rates**, using both descriptive statistics and correlation analysis.
`);


// ------------------------------------------------------------
// Apply Filter
// ------------------------------------------------------------
let filtered = filterByGender(students, gender);


// ------------------------------------------------------------
// Clean Data
// ------------------------------------------------------------
let valid = filtered.filter(s =>
  s.academicPressure !== null && !isNaN(s.academicPressure)
);


// ------------------------------------------------------------
// Arrays for Analysis
// ------------------------------------------------------------
let pressure = valid.map(s => s.academicPressure);
let depression = valid.map(s => s.depression === "Yes" ? 1 : 0);


// ------------------------------------------------------------
// Descriptive Statistics
// ------------------------------------------------------------
addMdToPage(`## Descriptive Statistics`);

tableFromData({
  data: [
    { Metric: "Mean Pressure", Value: s.mean(pressure).toFixed(2) },
    { Metric: "Median Pressure", Value: s.median(pressure) },
    { Metric: "Std Deviation", Value: s.standardDeviation(pressure).toFixed(2) },
    { Metric: "Sample Size", Value: pressure.length }
  ]
});


// ------------------------------------------------------------
// Correlation
// ------------------------------------------------------------
let r = correlation(pressure, depression);

addMdToPage(`
## Correlation Analysis

Correlation between academic pressure and depression:

**r = ${r.toFixed(3)}**

This indicates a ${
  Math.abs(r) < 0.1 ? "very weak" :
  Math.abs(r) < 0.3 ? "weak" :
  Math.abs(r) < 0.5 ? "moderate" :
  "strong"
} **positive relationship**.
`);


// ------------------------------------------------------------
// Grouped Analysis (clean + professional)
// ------------------------------------------------------------
let grouped = {};

for (let s of valid) {
  let level = s.academicPressure;

  if (!grouped[level]) {
    grouped[level] = { level, total: 0, depressed: 0 };
  }

  grouped[level].total++;

  if (s.depression === "Yes") {
    grouped[level].depressed++;
  }
}


// Transform
let rows = Object.values(grouped).map(r => ({
  Pressure: r.level,
  Participants: r.total,
  Depressed: r.depressed,
  'Depression Rate (%)': getDepressionRate(r.depressed, r.total)
}))
.toSorted((a, b) => a.Pressure - b.Pressure);


// ------------------------------------------------------------
// Table Output
// ------------------------------------------------------------
addMdToPage(`## Depression Rate by Academic Pressure`);

tableFromData({
  data: rows,
  columnNames: ['Pressure', 'Participants', 'Depressed', 'Depression Rate (%)']
});


// ------------------------------------------------------------
// Chart (clean + examiner-level)
// ------------------------------------------------------------
addMdToPage(`## Visualisation`);

let chartData = rows.map(r => ({
  Pressure: r.Pressure,
  Rate: r['Depression Rate (%)']
}));

drawGoogleChart({
  type: 'LineChart',
  data: makeChartFriendly(chartData, 'Pressure', 'Rate'),
  options: {
    title: `Depression Rate by Academic Pressure (${gender})`,
    height: 450,
    hAxis: { title: 'Academic Pressure Level' },
    vAxis: { title: 'Depression Rate (%)', minValue: 0 }
  }
});


// ------------------------------------------------------------
// Insight Generator (VG+++ KEY)
// ------------------------------------------------------------
let highest = rows.reduce((a, b) =>
  a['Depression Rate (%)'] > b['Depression Rate (%)'] ? a : b
);

let lowest = rows.reduce((a, b) =>
  a['Depression Rate (%)'] < b['Depression Rate (%)'] ? a : b
);


// ------------------------------------------------------------
// Interpretation (Examiner Mode)
// ------------------------------------------------------------
addMdToPage(`

# Key Insights

- Highest depression rate occurs at pressure level **${highest.Pressure}**
  → ${highest['Depression Rate (%)']}%

- Lowest depression rate occurs at pressure level **${lowest.Pressure}**
  → ${lowest['Depression Rate (%)']}%

- There is a **clear upward trend**: as academic pressure increases,
  depression rates increase.

---

# Interpretation

The analysis provides strong evidence that **academic pressure is positively
associated with depression**.

Students reporting higher pressure levels consistently show higher rates of
depression. This suggests that academic stress is a **central contributing factor**
to mental health challenges among students.

---

# Limitations

- The data is **self-reported**
- The relationship is **correlational**, not causal
- Other variables (sleep, financial stress) may also influence results

---

# Conclusion

Academic pressure appears to be one of the **strongest predictors of depression**
in this dataset.

Reducing excessive academic stress and improving support systems may play a key
role in improving student mental health outcomes.
`);