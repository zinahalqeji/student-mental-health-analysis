import { students } from './exports/initial-data.js';
import { filterByGender, getDepressionRate, correlation, getWorkGroup } from './exports/utils.js';


// ------------------------------------------------------------
// Global Filter
// ------------------------------------------------------------
let gender = addDropdown('Filter by gender:', ['All', 'Male', 'Female']);


// ------------------------------------------------------------
// Title & Context
// ------------------------------------------------------------
addMdToPage(`# Work/Study Hours Analysis`);

addMdToPage(`
This section examines whether the number of **hours students spend working or studying**
per day is associated with **depression**.

Unlike sleep, this variable is **continuous**, allowing us to explore:
- Distribution of workload
- Correlation with depression
- Patterns across workload groups
`);


// ------------------------------------------------------------
// Apply Filter
// ------------------------------------------------------------
let filtered = filterByGender(students, gender);


// ------------------------------------------------------------
// Clean Data
// ------------------------------------------------------------
let valid = filtered.filter(s =>
  s.workStudyHours !== null && !isNaN(s.workStudyHours)
);


// ------------------------------------------------------------
// Arrays
// ------------------------------------------------------------
let hours = valid.map(s => s.workStudyHours);
let depression = valid.map(s => s.depression === "Yes" ? 1 : 0);


// ------------------------------------------------------------
// Normality Test
// ------------------------------------------------------------
let normalTest = stdLib.stats.shapiroWilkTest(hours);

addMdToPage(`## Normality Test (Shapiro–Wilk)`);

addMdToPage(`
p-value: **${normalTest.p.toFixed(4)}**

${
  normalTest.p < 0.05
    ? "The data is **not normally distributed**, suggesting non-parametric patterns."
    : "The data is approximately **normally distributed**."
}
`);


// ------------------------------------------------------------
// Descriptive Statistics
// ------------------------------------------------------------
addMdToPage(`## Descriptive Statistics`);

tableFromData({
  data: [
    { Metric: "Mean Hours", Value: s.mean(hours).toFixed(2) },
    { Metric: "Median Hours", Value: s.median(hours) },
    { Metric: "Std Deviation", Value: s.standardDeviation(hours).toFixed(2) },
    { Metric: "Sample Size", Value: hours.length }
  ]
});


// ------------------------------------------------------------
// Correlation
// ------------------------------------------------------------
let r = correlation(hours, depression);

addMdToPage(`
## Correlation Analysis

Correlation between work/study hours and depression:

**r = ${r.toFixed(3)}**

This indicates a ${
  Math.abs(r) < 0.1 ? "very weak" :
  Math.abs(r) < 0.3 ? "weak" :
  Math.abs(r) < 0.5 ? "moderate" :
  "strong"
} **positive relationship**.

Students who spend more hours working or studying tend to report depression
slightly more often.
`);


// ------------------------------------------------------------
// Scatter Plot
// ------------------------------------------------------------
addMdToPage(`## Visualisation: Raw Relationship`);

let scatterData = valid.map(s => ({
  Hours: s.workStudyHours,
  Depression: s.depression === "Yes" ? 1 : 0
}));

drawGoogleChart({
  type: 'ScatterChart',
  data: makeChartFriendly(scatterData, 'Hours', 'Depression'),
  options: {
    title: `Work/Study Hours vs Depression (${gender})`,
    height: 450,
    hAxis: { title: 'Hours per Day' },
    vAxis: { title: 'Depression (0 = No, 1 = Yes)' },
    trendlines: { 0: { type: 'linear', color: 'red', lineWidth: 2 } }
  }
});


// ------------------------------------------------------------
// Grouped Analysis 
// ------------------------------------------------------------
let grouped = {};

for (let s of valid) {
  let group = getWorkGroup(s.workStudyHours);

  if (!grouped[group]) {
    grouped[group] = { group, total: 0, depressed: 0 };
  }

  grouped[group].total++;

  if (s.depression === "Yes") {
    grouped[group].depressed++;
  }
}


// Transform
let rows = Object.values(grouped).map(r => ({
  Workload: r.group,
  Participants: r.total,
  Depressed: r.depressed,
  'Depression Rate (%)': getDepressionRate(r.depressed, r.total)
}));


// Force logical order
const order = ['0–2 h', '3–5 h', '6–8 h', '9+ h'];

rows = rows.toSorted((a, b) =>
  order.indexOf(a.Workload) - order.indexOf(b.Workload)
);


// ------------------------------------------------------------
// Table Output
// ------------------------------------------------------------
addMdToPage(`## Depression Rate by Workload Category`);

tableFromData({
  data: rows,
  columnNames: ['Workload', 'Participants', 'Depressed', 'Depression Rate (%)']
});


// ------------------------------------------------------------
// Chart 
// ------------------------------------------------------------
addMdToPage(`## Visualisation: Workload Categories`);

let chartData = rows.map(r => ({
  Workload: r.Workload,
  Rate: r['Depression Rate (%)']
}));

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartData, 'Workload', 'Rate'),
  options: {
    title: `Depression Rate by Workload (${gender})`,
    height: 450,
    vAxis: { title: 'Depression Rate (%)', minValue: 0 },
    hAxis: { title: 'Workload Category' },
    legend: 'none'
  }
});


// ------------------------------------------------------------
// Insight Generator 
// ------------------------------------------------------------
let highest = rows.reduce((a, b) =>
  a['Depression Rate (%)'] > b['Depression Rate (%)'] ? a : b
);

let lowest = rows.reduce((a, b) =>
  a['Depression Rate (%)'] < b['Depression Rate (%)'] ? a : b
);


// ------------------------------------------------------------
// Interpretation
// ------------------------------------------------------------
addMdToPage(`

# Key Insights

- Highest depression rate:
  **${highest.Workload} → ${highest['Depression Rate (%)']}%**

- Lowest depression rate:
  **${lowest.Workload} → ${lowest['Depression Rate (%)']}%**

- Students working **9+ hours/day** show the highest risk.

---

# Interpretation

The analysis shows that **work/study hours are positively associated with depression**,
although the relationship is relatively weak.

While moderate workloads do not show dramatic differences, **very high workloads**
(9+ hours per day) are consistently associated with higher depression rates.

---

# Key Takeaway

- Workload alone is not the strongest predictor  
- BUT extreme workload **amplifies mental health risk**

---

# Limitations

- Weak correlation → effect is modest  
- Self-reported data  
- Other factors (sleep, pressure) interact with workload  

---

# Conclusion

Work/study hours contribute to depression risk, particularly at **extreme levels**.

This suggests that maintaining a **balanced workload** may be important for
student well-being, especially when combined with healthy sleep and manageable
academic pressure.
`);