import { students, fieldDescriptions } from './exports/initial-data.js';

addMdToPage(`# Data Dictionary`);

addMdToPage(`
This page documents all variables in the dataset and shows how frequently each
response appears. Understanding the structure and distribution of each field is
important for interpreting the results in later analysis pages.

In the context of our story — **what makes a student vulnerable to depression?** —
some variables (such as academic pressure, sleep duration, and work/study hours)
play a central role, while others provide important background context.
`);

for (let [key, description] of Object.entries(fieldDescriptions)) {
  addMdToPage(`## ${key}`);
  addMdToPage(description);

  // Special handling for CGPA (numeric)
  if (key === 'cgpa') {
    const cgpas = students.map(x => x.cgpa);
    const nonZero = cgpas.filter(x => x !== 0);

    tableFromData({
      data: [
        { measurement: 'Number of 0 values (likely missing)', value: cgpas.filter(x => x === 0).length },
        { measurement: 'Mean (including 0 values)', value: s.mean(cgpas) },
        { measurement: 'Mean (excluding 0 values)', value: s.mean(nonZero) },
        { measurement: 'Min (excluding 0 values)', value: s.min(nonZero) },
        { measurement: 'Max', value: s.max(cgpas) }
      ],
      numberFormatOptions: { maximumFractionDigits: 4 }
    });

    addMdToPage(`
CGPA is one of the few numeric variables in the dataset. Many students report a
value of 0, which likely represents missing or unreported data. For this reason,
we compute statistics both including and excluding zero values.
    `);

    continue;
  }

  // For categorical variables
  const counts = {};
  for (const student of students) {
    const answer = student[key];
    if (!counts[answer]) counts[answer] = 0;
    counts[answer]++;
  }

  const rows = Object.entries(counts)
    .map(([answer, count]) => ({ answer, count }))
    .toSorted((a, b) => b.count - a.count);

  tableFromData({ data: rows });

  addMdToPage(`
The distribution above shows how students responded to **${key}**. This helps us
understand the context in which later analyses take place. For example, if most
students report high academic pressure or short sleep duration, this shapes the
overall patterns we observe in depression rates.
  `);
}

addMdToPage(`
---

By documenting each variable and its distribution, this data dictionary provides
a transparent foundation for the analyses that follow. It also highlights which
variables are central to our story about student mental health.
`);
