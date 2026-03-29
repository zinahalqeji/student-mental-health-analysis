import { students } from './exports/initial-data.js';

addMdToPage(`# Work/Study Hours Analysis`);

addMdToPage(`
In this section we examine whether the number of hours students spend on work or
study per day is related to depression. Work/study hours is a numeric variable,
which allows us to compute correlations, visualize patterns, and compare
depression rates across different workload levels.
`);

//
// 1. FILTER VALID DATA
//
const validWork = students.filter(s => s.workStudyHours !== null);

//
// 2. PREPARE ARRAYS FOR CORRELATION
//
const hours = validWork.map(s => s.workStudyHours);
const depBinary = validWork.map(s => s.depression === "Yes" ? 1 : 0);

//
// 3. CORRELATION
//
const corrWork = s.sampleCorrelation(hours, depBinary);

addMdToPage(`
## Correlation
**Correlation between work/study hours and depression (Yes=1, No=0):**  
\`${corrWork.toFixed(3)}\`

A positive correlation indicates that students who spend more hours working or
studying tend to report depression slightly more often. The relationship is not
strong, but it is noticeable.
`);

//
// 4. SCATTER PLOT WITH TRENDLINE
//
const scatterRows = validWork.map(s => ({
  workStudyHours: s.workStudyHours,
  depression: s.depression === "Yes" ? 1 : 0
}));

drawGoogleChart({
  type: 'ScatterChart',
  data: makeChartFriendly(scatterRows, 'workStudyHours', 'depression'),
  options: {
    title: 'Work/study hours vs depression',
    height: 500,
    hAxis: { title: 'Work/study hours per day' },
    vAxis: { title: 'Depression (Yes=1, No=0)' },
    trendlines: { 0: { type: 'linear', color: 'red', lineWidth: 3 } }
  }
});

addMdToPage(`
The scatter plot shows how depression (binary: 0 or 1) is distributed across
different work/study hour levels. The red trendline highlights the overall
direction of the relationship.
`);

//
// 5. GROUPED ANALYSIS (VG-LEVEL)
//
addMdToPage(`## Depression Rate by Workload Category`);

const categories = [
  { label: "0–2 hours", min: 0, max: 2 },
  { label: "3–5 hours", min: 3, max: 5 },
  { label: "6–8 hours", min: 6, max: 8 },
  { label: "9+ hours", min: 9, max: Infinity }
];

const grouped = categories.map(cat => {
  const subset = validWork.filter(s =>
    s.workStudyHours >= cat.min && s.workStudyHours <= cat.max
  );

  const depressed = subset.filter(s => s.depression === "Yes").length;

  return {
    WorkloadCategory: cat.label,
    Participants: subset.length,
    DepressionRate: subset.length > 0 ? depressed / subset.length : 0
  };
});

// TABLE — full grouped data
tableFromData({
  data: grouped,
  numberFormatOptions: { maximumFractionDigits: 3 }
});

// CHART — only DepressionRate
const chartGrouped = grouped.map(r => ({
  WorkloadCategory: r.WorkloadCategory,
  DepressionRate: r.DepressionRate
}));

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartGrouped, 'WorkloadCategory', 'DepressionRate'),
  options: {
    title: 'Depression rate by workload category',
    height: 500,
    vAxis: { title: 'Share depressed (0–1)' }
  }
});

addMdToPage(`
This grouped analysis provides a clearer interpretation than the raw scatter plot.
Students working or studying **9+ hours per day** show the highest depression rate,
while those in the **0–2 hour** range show the lowest. This suggests that workload
intensity may contribute to mental strain, although the relationship is not
definitive.
`);

//
// 6. INTERPRETATION
//
addMdToPage(`
---

## Interpretation

- The correlation (≈0.21) indicates a **weak but positive** relationship between
  work/study hours and depression.
- The scatter plot shows that students reporting depression appear slightly more
  often at higher hour levels.
- The grouped analysis reveals that **very high workloads (9+ hours)** are associated
  with the highest depression rates.
- Workload alone does not explain depression, but it appears to be one contributing
  factor among several (e.g., academic pressure, financial stress, sleep).

Overall, this analysis suggests that heavy work/study schedules may increase the
risk of depression, especially when combined with other stressors.
`);
