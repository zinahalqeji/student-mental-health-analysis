import { students, initialComments } from './exports/initial-data.js';

addMdToPage(`# Overview`);

addMdToPage(`
This dashboard provides an overview of the Student Mental Health dataset.
It summarizes the population, highlights key variables, and prepares the
reader for deeper analysis in the following sections.
`);

//
// BASIC SUMMARY
//
let total = students.length;
let depressedCount = students.filter(s => s.depression === "Yes").length;
let depressedPercent = depressedCount / total;

addMdToPage(`## Dataset Summary`);

tableFromData({
  data: [
    { metric: "Total Students", value: total },
    { metric: "Depressed (%)", value: depressedPercent }
  ],
  numberFormatOptions: { maximumFractionDigits: 3 }
});

//
// HELPER FUNCTION
//
function countValues(key) {
  let counts = {};
  for (let s of students) {
    let v = s[key];
    if (!counts[v]) counts[v] = 0;
    counts[v]++;
  }
  return Object.entries(counts)
    .map(([answer, count]) => ({ answer, count }))
    .toSorted((a, b) => b.count - a.count);
}

//
// KEY VARIABLE DISTRIBUTIONS
//
addMdToPage(`## Key Variable Distributions`);

addMdToPage(`### Gender`);
tableFromData({ data: countValues('gender') });

addMdToPage(`### Sleep Duration`);
tableFromData({ data: countValues('sleepDuration') });

addMdToPage(`### Dietary Habits`);
tableFromData({ data: countValues('dietaryHabits') });

addMdToPage(`### Academic Pressure`);
tableFromData({ data: countValues('academicPressure') });

addMdToPage(`### Work/Study Hours`);
tableFromData({ data: countValues('workStudyHours') });

addMdToPage(`
---

## Interpretation

This overview highlights the main characteristics of the dataset:
- The proportion of students reporting depression
- How sleep, diet, and pressure are distributed
- Which variables may influence mental health

Use the **Analysis** section to explore each factor in depth.
`);
