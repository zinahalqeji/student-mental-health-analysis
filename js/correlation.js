// ------------------------------------------------------------
// Correlation & Association Analysis
// ------------------------------------------------------------

addMdToPage(`
# Correlation & Association Analysis

This section evaluates whether **sleep duration** and **work/study hours** are
associated with **depression**, and whether workload acts as a *confounding
variable* in the sleep–depression relationship.

As established in earlier sections, sleep and workload differ in how they are
measured: sleep is **ordinal**, workload is **continuous**, and depression is
**binary**. These characteristics guide the choice of statistical methods used
here.

### Analytical Methods and Justification
- **Pearson correlations**  
  Used to examine linear relationships. Although depression is binary and sleep
  is ordinal, Pearson’s r provides a useful first approximation of direction and
  strength. However, it may underestimate true associations.
- **Chi-square tests**  
  The most appropriate method for evaluating associations between categorical
  variables (e.g., sleep category × depression).
- **Stratified chi-square tests**  
  Used to determine whether the sleep–depression relationship persists *within*
  different workload groups, helping identify potential confounding.
- **Partial correlation**  
  Quantifies whether sleep has an independent association with depression after
  controlling for work hours.

Together, these analyses help determine whether sleep and workload contribute
independently to depression risk and how strongly each factor matters.
`);


// ------------------------------------------------------------
// Gender filter
// ------------------------------------------------------------
let gender = addDropdown('Filter by gender:', ['All', 'Male', 'Female']);


// ------------------------------------------------------------
// Load data
// ------------------------------------------------------------
dbQuery.use('student-depression');

let query = gender === 'All'
  ? "SELECT sleepDuration, workStudyHours, depression FROM student_depression WHERE sleepDuration != 'Others'"
  : `SELECT sleepDuration, workStudyHours, depression FROM student_depression WHERE sleepDuration != 'Others' AND gender = '${gender}'`;

let data = await dbQuery(query);


// ------------------------------------------------------------
// Convert categories to numeric values
// ------------------------------------------------------------
const sleepMap = {
  '1. Less than 5 hours': 1,
  '2. 5-6 hours': 2,
  '3. 7-8 hours': 3,
  '4. More than 8 hours': 4
};

let sleepArr = [];
let hoursArr = [];
let depressionArr = [];

for (let row of data) {
  let sleepVal = sleepMap[row.sleepDuration];
  if (sleepVal === undefined) continue;
  sleepArr.push(sleepVal);
  hoursArr.push(row.workStudyHours);
  depressionArr.push(row.depression === 'Yes' ? 1 : 0);
}

addMdToPage(`
## Dataset Overview
Number of valid observations: **${sleepArr.length}**

The dataset includes ordinal sleep categories, continuous work/study hours, and
a binary depression indicator. These mixed data types require a combination of
correlation and categorical association tests to fully understand the
relationships.
`);


// ------------------------------------------------------------
// Pairwise correlations
// ------------------------------------------------------------
let rHoursDep = s.sampleCorrelation(hoursArr, depressionArr);
let rSleepDep = s.sampleCorrelation(sleepArr, depressionArr);
let rHoursSleep = s.sampleCorrelation(hoursArr, sleepArr);

addMdToPage(`
## Pairwise Correlations (Pearson’s r)

Pearson’s r provides an initial indication of linear relationships between
variables. Because depression is binary and sleep is ordinal, these correlations
should be interpreted as **approximations**, not precise effect sizes.

For this reason, correlation results are complemented with chi-square tests,
which are more appropriate for categorical associations.
`);

tableFromData({
  data: [
    { Pair: 'Work hours ↔ Depression', 'Pearson r': rHoursDep.toFixed(4) },
    { Pair: 'Sleep ↔ Depression', 'Pearson r': rSleepDep.toFixed(4) },
    { Pair: 'Work hours ↔ Sleep', 'Pearson r': rHoursSleep.toFixed(4) }
  ],
  columnNames: ['Pair', 'Pearson r']
});


// ------------------------------------------------------------
// Chi-square test: Sleep × Depression
// ------------------------------------------------------------
let sleepCategories = Object.keys(sleepMap);

let contingencyTable = sleepCategories.map(kat => {
  let group = data.filter(d => d.sleepDuration === kat);
  let dep = group.filter(d => d.depression === 'Yes').length;
  let notDep = group.length - dep;
  return [notDep, dep];
});

let chiResult = stdLib.stats.chi2test(contingencyTable);
let chiSignificant = chiResult.rejected;

addMdToPage(`
## Chi-Square Test: Sleep × Depression

The chi-square test evaluates whether depression rates differ significantly
across sleep categories. This is the **most appropriate method** for assessing
associations between categorical variables.
`);

let contingencyData = sleepCategories.map((kat, i) => ({
  SleepCategory: kat.replace(/^\d\.\s*/, ''),
  'Not Depressed': contingencyTable[i][0],
  'Depressed': contingencyTable[i][1],
  Total: contingencyTable[i][0] + contingencyTable[i][1]
}));

tableFromData({
  data: contingencyData,
  columnNames: ['SleepCategory', 'Not Depressed', 'Depressed', 'Total']
});

addMdToPage(`
**Result:**  
χ² = **${chiResult.statistic.toFixed(2)}**, df = **${chiResult.df}**,  
p-value = **${chiResult.pValue.toFixed(6)}**

${chiSignificant
  ? `There is a **statistically significant** association between sleep and depression.`
  : `No statistically significant association was detected.`}

### Why this matters  
A significant chi-square result supports the descriptive pattern observed in the
**Sleep Analysis**: insufficient sleep is linked to higher depression rates.
`);


// ------------------------------------------------------------
// Stratified chi-square test by work hour groups
// ------------------------------------------------------------
function workGroupFn(h) {
  if (h <= 2) return '0–2 h';
  if (h <= 5) return '3–5 h';
  if (h <= 8) return '6–8 h';
  return '9+ h';
}

let workGroups = ['0–2 h', '3–5 h', '6–8 h', '9+ h'];

let chiByWork = workGroups.map(gr => {
  let groupedData = data.filter(d => workGroupFn(d.workStudyHours) === gr);
  let table = sleepCategories.map(kat => {
    let group = groupedData.filter(d => d.sleepDuration === kat);
    let dep = group.filter(d => d.depression === 'Yes').length;
    let notDep = group.length - dep;
    return [notDep, dep];
  });
  let res = stdLib.stats.chi2test(table);
  return {
    WorkGroup: gr,
    'χ²': res.statistic.toFixed(2),
    df: res.df,
    'p-value': res.pValue.toFixed(6),
    'Significant (p<0.05)': res.rejected ? 'Yes' : 'No',
    'N': groupedData.length
  };
});

addMdToPage(`
## Stratified Chi-Square Test (Controlling for Work Hours)

This analysis evaluates whether the sleep–depression relationship persists
*within* each workload category.  
If the association remains significant across multiple workload groups, this
suggests that sleep has an **independent association** with depression, not
explained solely by workload.
`);

tableFromData({
  data: chiByWork,
  columnNames: ['WorkGroup', 'χ²', 'df', 'p-value', 'Significant (p<0.05)', 'N']
});


// ------------------------------------------------------------
// Partial correlation
// ------------------------------------------------------------
function partialCorrelation(x, y, z) {
  const rXY = s.sampleCorrelation(x, y);
  const rXZ = s.sampleCorrelation(x, z);
  const rYZ = s.sampleCorrelation(y, z);
  return (rXY - rXZ * rYZ) / Math.sqrt((1 - rXZ ** 2) * (1 - rYZ ** 2));
}

let rPartial = partialCorrelation(sleepArr, depressionArr, hoursArr);
let percentRemaining = rSleepDep !== 0 ? Math.abs(rPartial / rSleepDep) * 100 : 0;

addMdToPage(`
## Partial Correlation (Controlling for Work Hours)

Partial correlation quantifies how much of the sleep–depression relationship
remains after removing the influence of work hours. This helps determine whether
sleep has an **independent effect** beyond workload.
`);

tableFromData({
  data: [
    {
      Measure: 'Original correlation (sleep ↔ depression)',
      Value: rSleepDep.toFixed(4)
    },
    {
      Measure: 'Partial correlation (controlling for work hours)',
      Value: rPartial.toFixed(4)
    },
    {
      Measure: 'Percentage of correlation remaining',
      Value: percentRemaining.toFixed(1) + ' %'
    },
    {
      Measure: 'Chi-square (sleep × depression)',
      Value: 'χ² = ' + chiResult.statistic.toFixed(2) + ', p = ' + chiResult.pValue.toFixed(6)
    }
  ],
  columnNames: ['Measure', 'Value']
});


// ------------------------------------------------------------
// Visualisation 1: Depression rate per sleep category
// ------------------------------------------------------------
let sleepGroups = {};
for (let row of data) {
  let kat = row.sleepDuration;
  if (!sleepMap[kat]) continue;
  if (!sleepGroups[kat]) sleepGroups[kat] = { total: 0, depressed: 0 };
  sleepGroups[kat].total++;
  if (row.depression === 'Yes') sleepGroups[kat].depressed++;
}

let chartData1 = Object.keys(sleepMap).map(kat => ({
  SleepCategory: kat.replace(/^\d\.\s*/, ''),
  'Depressed (%)': sleepGroups[kat]
    ? +(sleepGroups[kat].depressed / sleepGroups[kat].total * 100).toFixed(1)
    : 0
}));

addMdToPage(`
## Visualisation: Depression Rate by Sleep Category
`);

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartData1, 'SleepCategory', 'Depressed (%)'),
  options: {
    title: 'Percentage Depressed by Sleep Category',
    height: 400,
    vAxis: { title: 'Depressed (%)', minValue: 0 },
    hAxis: { title: 'Sleep Category' },
    legend: 'none'
  }
});


// ------------------------------------------------------------
// Visualisation 2: Sleep × Depression by Work Hour Group
// ------------------------------------------------------------
let grouped = {};
let sleepCats = Object.keys(sleepMap);

for (let row of data) {
  let kat = row.sleepDuration;
  if (!sleepMap[kat]) continue;
  let wg = workGroupFn(row.workStudyHours);
  let key = kat + '|' + wg;
  if (!grouped[key]) grouped[key] = { total: 0, depressed: 0 };
  grouped[key].total++;
  if (row.depression === 'Yes') grouped[key].depressed++;
}

let chartData2 = sleepCats.map(kat => {
  let row = { SleepCategory: kat.replace(/^\d\.\s*/, '') };
  for (let wg of workGroups) {
    let key = kat + '|' + wg;
    let g = grouped[key];
    row[wg] = g && g.total > 0 ? +(g.depressed / g.total * 100).toFixed(1) : 0;
  }
  return row;
});

addMdToPage(`
## Visualisation: Depression Rate by Sleep Category and Workload

This chart illustrates whether the sleep–depression relationship persists
*within* each work-hour group, providing a visual check for confounding.
`);

setTimeout(() => {
  drawGoogleChart({
    type: 'BarChart',
    data: makeChartFriendly(chartData2, 'SleepCategory', ...workGroups),
    options: {
      title: 'Percentage Depressed by Sleep Category and Work Hour Group',
      height: 450,
      bars: 'horizontal',
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out'
      },
      hAxis: { title: 'Depressed (%)', minValue: 0 },
      vAxis: { title: 'Sleep Category' },
      chartArea: { left: 120, right: 20, top: 60, bottom: 60 }
    }
  });
}, 50);


// ------------------------------------------------------------
// Interpretation & Key Insights
// ------------------------------------------------------------
let direction = rSleepDep < 0 ? 'negative' : 'positive';
let strength = Math.abs(rSleepDep) < 0.1 ? 'very weak'
  : Math.abs(rSleepDep) < 0.3 ? 'weak'
  : Math.abs(rSleepDep) < 0.5 ? 'moderate'
  : 'strong';

let significantCount = chiByWork.filter(r => r['Significant (p<0.05)'] === 'Yes').length;

addMdToPage(`
# Interpretation of Findings

### 1. Correlation Patterns
- The sleep–depression correlation is **${strength}** and **${direction}** (r = ${rSleepDep.toFixed(4)}).  
- Work hours show a weaker correlation with depression (r = ${rHoursDep.toFixed(4)}).  
- Sleep and work hours correlate only modestly (r = ${rHoursSleep.toFixed(4)}).

### 2. Chi-Square Evidence
- The overall sleep–depression association is **${chiSignificant ? 'statistically significant' : 'not significant'}**.
- The relationship remains significant in **${significantCount} out of 4** workload groups.

### 3. Partial Correlation
- After controlling for work hours, **${percentRemaining.toFixed(1)} %** of the sleep–depression correlation remains.
- This indicates that sleep has an **independent association** with depression, not fully explained by workload.

---

# Key Insights

- **Sleep duration is consistently associated with depression**, even after
  accounting for work/study hours.
- **Workload contributes modestly**, but does not eliminate the sleep effect.
- **Combined stressors amplify risk**: students with poor sleep and high
  workload show the highest depression rates.
- As with all observational data, **causality cannot be inferred**.

Overall, the evidence suggests that sleep plays a meaningful and independent role
in students’ mental‑health outcomes.
`);
