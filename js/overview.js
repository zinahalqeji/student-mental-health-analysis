import { students, initialComments } from './exports/initial-data.js';

addMdToPage(`# Overview`);

addMdToPage(initialComments);

//
// BASIC SUMMARY
//
let total = students.length;
let depressedCount = students.filter(s => s.depression === "Yes").length;
let depressedPercent = depressedCount / total;

addMdToPage(`## Dataset Summary`);

tableFromData({
  data: [
    { metric: "Total students", value: total },
    { metric: "Depressed (%)", value: depressedPercent }
  ],
  numberFormatOptions: { maximumFractionDigits: 3 }
});

//
// HELPER: COUNT VALUES
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

addMdToPage(`## Key Variable Distributions`);

addMdToPage(`### Gender`);
tableFromData({ data: countValues('gender') });

addMdToPage(`### Sleep duration`);
tableFromData({ data: countValues('sleepDuration') });

addMdToPage(`### Dietary habits`);
tableFromData({ data: countValues('dietaryHabits') });

addMdToPage(`### Academic pressure`);
tableFromData({ data: countValues('academicPressure') });

addMdToPage(`### Work/study hours`);
tableFromData({ data: countValues('workStudyHours') });

addMdToPage(`
---

This overview provides a first impression of the population and the main variables.
Use the **Analysis** section to explore specific factors in more depth.
`);
