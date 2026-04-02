import { students, initialComments } from './exports/initial-data.js';

addMdToPage(`# Overview`);

addMdToPage(initialComments);

const total = students.length;
const depressedCount = students.filter(s => s.depression === "Yes").length;
const depressedPercent = (depressedCount / total) * 100;

addMdToPage(`## Dataset Summary`);

tableFromData({
  data: [
    { metric: "Total students", value: total },
    { metric: "Depressed (count)", value: depressedCount },
    { metric: "Depressed (%)", value: depressedPercent }
  ],
  numberFormatOptions: { maximumFractionDigits: 2 }
});

addMdToPage(`
Roughly **${depressedPercent.toFixed(1)}%** of students report being depressed.
This baseline frames the rest of our story: we now ask which conditions are
associated with higher or lower depression rates.
`);

function countValues(key) {
  const counts = {};
  for (const s of students) {
    const v = s[key];
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
These distributions introduce the main characters in our story: how students
sleep, eat, study, and how pressured they feel.
`);
