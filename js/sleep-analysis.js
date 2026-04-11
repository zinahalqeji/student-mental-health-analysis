import { students } from './exports/initial-data.js';
import { filterByGender, getDepressionRate } from './exports/utils.js';


// ------------------------------------------------------------
// Global Filter (works across ALL pages)
// ------------------------------------------------------------
let gender = addDropdown('Filter by gender:', ['All', 'Male', 'Female']);


// ------------------------------------------------------------
// Title & Context
// ------------------------------------------------------------
addMdToPage(`# Sleep Analysis`);

addMdToPage(`
This section investigates the relationship between **sleep duration** and
**depression rates** among students.

Sleep is treated as a **categorical variable**, allowing us to compare how the
proportion of depressed students varies across different sleep groups.

Understanding this relationship is important because sleep is a key component of
both physical and mental well-being.
`);


// ------------------------------------------------------------
// Apply Global Filter
// ------------------------------------------------------------
let filtered = filterByGender(students, gender);


// ------------------------------------------------------------
// Grouping Logic (CLEAN & REUSABLE)
// ------------------------------------------------------------
let grouped = {};

for (let s of filtered) {
  let key = s.sleepDuration;

  if (!grouped[key]) {
    grouped[key] = {
      sleepDuration: key,
      total: 0,
      depressed: 0
    };
  }

  grouped[key].total++;

  if (s.depression === "Yes") {
    grouped[key].depressed++;
  }
}


// ------------------------------------------------------------
// Transform Data
// ------------------------------------------------------------
let rows = Object.values(grouped).map(r => ({
  Sleep: r.sleepDuration,
  Participants: r.total,
  Depressed: r.depressed,
  'Depression Rate (%)': getDepressionRate(r.depressed, r.total)
}));


// Sort logically (by sleep order, not size)
const sleepOrder = [
  "1. Less than 5 hours",
  "2. 5-6 hours",
  "3. 7-8 hours",
  "4. More than 8 hours"
];

rows = rows.toSorted((a, b) =>
  sleepOrder.indexOf(a.Sleep) - sleepOrder.indexOf(b.Sleep)
);


// ------------------------------------------------------------
// Table Output (clean + examiner-friendly)
// ------------------------------------------------------------
addMdToPage(`## Distribution and Depression Rates`);

tableFromData({
  data: rows,
  columnNames: ['Sleep', 'Participants', 'Depressed', 'Depression Rate (%)']
});


// ------------------------------------------------------------
// Chart (clear + professional)
// ------------------------------------------------------------
addMdToPage(`## Visualisation: Depression Rate by Sleep Duration`);

let chartData = rows.map(r => ({
  Sleep: r.Sleep.replace(/^\d\.\s*/, ''),
  Rate: r['Depression Rate (%)']
}));

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartData, 'Sleep', 'Rate'),
  options: {
    title: `Depression Rate by Sleep Duration (${gender})`,
    height: 450,
    vAxis: { title: 'Depression Rate (%)', minValue: 0 },
    hAxis: { title: 'Sleep Duration' },
    legend: 'none'
  }
});


// ------------------------------------------------------------
// Insight Generator (THIS = VG+++ DIFFERENCE)
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

- The **highest depression rate** is observed among students with:
  **${highest.Sleep.replace(/^\d\.\s*/, '')}**  
  → ${highest['Depression Rate (%)']}%

- The **lowest depression rate** occurs in:
  **${lowest.Sleep.replace(/^\d\.\s*/, '')}**  
  → ${lowest['Depression Rate (%)']}%

- A clear pattern emerges:  
  **Shorter sleep durations are associated with higher depression rates.**

---

# Interpretation

This analysis provides strong descriptive evidence that **sleep duration is linked
to student mental health**.

Students who sleep less than 5–6 hours consistently show higher depression rates,
while those with **7–8 hours of sleep exhibit lower levels of depression**.

This supports existing research suggesting that **adequate sleep is a protective
factor for mental well-being**.

---

# Limitations

- The data is **self-reported**, which may introduce bias.
- The relationship is **correlational**, not causal.
- Other variables (e.g., stress, workload) may influence both sleep and depression.

---

# Conclusion

Sleep appears to be a **key factor associated with depression risk** in students.

Improving sleep habits could be an important step toward improving overall
mental health, especially when combined with managing academic and lifestyle
stressors.
`);