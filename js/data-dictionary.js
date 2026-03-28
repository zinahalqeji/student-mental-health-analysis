import { students, fieldDescriptions } from './exports/initial-data.js';

addMdToPage(`# Data Dictionary`);

addMdToPage(`
This page documents the variables in the dataset, including descriptions and
the distribution of responses for each field.
`);

for (let [key, description] of Object.entries(fieldDescriptions)) {
  addMdToPage(`## ${key}`);
  addMdToPage(description);

  if (key === 'cgpa') {
    let cgpas = students.map(x => x.cgpa);
    tableFromData({
      data: [
        { measurement: 'Number of 0 values', value: cgpas.filter(x => x === 0).length },
        { measurement: 'Mean (including 0 values)', value: s.mean(cgpas) },
        { measurement: 'Mean (excluding 0 values)', value: s.mean(cgpas.filter(x => x !== 0)) },
        { measurement: 'Min (excluding 0 values)', value: s.min(cgpas.filter(x => x !== 0)) },
        { measurement: 'Max', value: s.max(cgpas) }
      ],
      numberFormatOptions: { maximumFractionDigits: 4 }
    });
    continue;
  }

  let answerCount = {};
  for (let student of students) {
    let answer = student[key];
    if (!answerCount[answer]) answerCount[answer] = 0;
    answerCount[answer]++;
  }

  let rows = Object.entries(answerCount)
    .map(([answer, count]) => ({ answer, count }))
    .toSorted((a, b) => b.count - a.count);

  tableFromData({ data: rows });
}
