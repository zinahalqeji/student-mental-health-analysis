import { students } from './exports/initial-data.js';

addMdToPage(`# Academic Pressure & Depression`);

addMdToPage(`
Academic pressure is often the first factor students mention when talking about
stress. Here we investigate whether higher self‑reported academic pressure is
associated with higher depression rates.
`);

const apValid = students.filter(s =>
  s.academicPressure !== null && !isNaN(s.academicPressure)
);

const ap = apValid.map(s => s.academicPressure);
const apDep = apValid.map(s => s.depression === "Yes" ? 1 : 0);

addMdToPage(`
## Descriptive Statistics

- Mean academic pressure: ${s.mean(ap).toFixed(2)}
- Median academic pressure: ${s.median(ap)}
- Std deviation: ${s.standardDeviation(ap).toFixed(2)}
`);

const apCorr = s.sampleCorrelation(ap, apDep);

addMdToPage(`
## Correlation

Correlation between academic pressure and depression: **${apCorr.toFixed(3)}**

A positive value indicates that students who feel more academic pressure tend to
report depression more often.
`);

const apGrouped = {};

for (const st of apValid) {
  const level = st.academicPressure;
  if (!apGrouped[level]) apGrouped[level] = { level, total: 0, depressed: 0 };
  apGrouped[level].total++;
  if (st.depression === "Yes") apGrouped[level].depressed++;
}

let apRows = Object.values(apGrouped).map(r => ({
  academicPressure: r.level,
  depressionRate: r.depressed / r.total
})).toSorted((a, b) => a.academicPressure - b.academicPressure);

tableFromData({ data: apRows });

drawGoogleChart({
  type: 'LineChart',
  data: makeChartFriendly(apRows, 'academicPressure', 'depressionRate'),
  options: {
    title: 'Depression Rate by Academic Pressure Level',
    height: 500
  }
});

addMdToPage(`
### Interpretation

Our story begins with a clear pattern: as academic pressure increases, so does
the share of students reporting depression. Academic pressure appears to be a
central stressor in student life.
`);
