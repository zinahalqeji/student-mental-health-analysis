import { students } from './exports/initial-data.js';

addMdToPage(`# Hypothesis Testing`);

addMdToPage(`
In this section, we move beyond descriptive analysis and formally test whether
observed differences between groups are statistically significant.

We combine two approaches:
- A **t-test** (to compare group means, as an approximation)
- A **chi-square test** (the correct method for categorical data)

The chi-square test is used as the primary basis for conclusions.
`);


// ------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------

function runTTest(a, b) {
  if (a.length < 2 || b.length < 2) return null;

  const meanA = s.mean(a);
  const meanB = s.mean(b);
  const sdA = s.standardDeviation(a);
  const sdB = s.standardDeviation(b);
  const nA = a.length;
  const nB = b.length;

  const se = Math.sqrt((sdA ** 2) / nA + (sdB ** 2) / nB);
  const t = (meanA - meanB) / se;

  let significance;
  if (Math.abs(t) > 2.58) significance = "Highly significant (p < 0.01)";
  else if (Math.abs(t) > 1.96) significance = "Statistically significant (p < 0.05)";
  else significance = "Not statistically significant";

  return { meanA, meanB, t, significance };
}

function buildContingency(groupA, groupB) {
  const count = arr => [
    arr.filter(v => v === 0).length,
    arr.filter(v => v === 1).length
  ];
  return [count(groupA), count(groupB)];
}


// ------------------------------------------------------------
// HYPOTHESIS 1: SLEEP
// ------------------------------------------------------------

addMdToPage(`## Hypothesis 1: Sleep Duration and Depression

**H₀:** Sleep duration and depression are independent  
**H₁:** There is a relationship between sleep duration and depression
`);

const shortSleep = students
  .filter(s => s.sleepDuration === "1. Less than 5 hours")
  .map(s => s.depression === "Yes" ? 1 : 0);

const adequateSleep = students
  .filter(s => s.sleepDuration === "3. 7-8 hours")
  .map(s => s.depression === "Yes" ? 1 : 0);

// T-TEST
const sleepT = runTTest(shortSleep, adequateSleep);

// CHI-SQUARE
const sleepTable = buildContingency(shortSleep, adequateSleep);
const sleepChi = stdLib.stats.chi2test(sleepTable);


// RESULTS

addMdToPage(`### Results`);

tableFromData({
  data: [
    {
      Group: "Short Sleep (<5h)",
      MeanDepression: sleepT.meanA.toFixed(3),
      SampleSize: shortSleep.length
    },
    {
      Group: "Adequate Sleep (7–8h)",
      MeanDepression: sleepT.meanB.toFixed(3),
      SampleSize: adequateSleep.length
    }
  ]
});

drawGoogleChart({
  type: 'ColumnChart',
  data: [
    ["Group", "Mean Depression"],
    ["Short Sleep", sleepT.meanA],
    ["Adequate Sleep", sleepT.meanB]
  ],
  options: {
    title: "Depression Rate by Sleep Duration",
    height: 400,
    legend: { position: "none" }
  }
});

addMdToPage(`
### Statistical Tests

**T-test (approximation):**
- t-value: ${sleepT.t.toFixed(3)}
- ${sleepT.significance}

**Chi-square test (primary method):**
- p-value: ${sleepChi.pValue.toFixed(4)}
- ${sleepChi.rejected 
  ? "Statistically significant relationship (reject H₀)"
  : "No statistically significant relationship"}
`);

addMdToPage(`
### Interpretation

Both methods indicate that students with shorter sleep tend to report higher
levels of depression.

The chi-square test confirms that this relationship is ${
  sleepChi.rejected ? "statistically significant" : "not statistically significant"
}, meaning the observed pattern is unlikely to be due to chance.

However, this does not imply causation. Poor sleep may contribute to depression,
but depression may also lead to reduced sleep, or both may be influenced by a
third factor such as stress.
`);


// ------------------------------------------------------------
// HYPOTHESIS 2: ACADEMIC PRESSURE
// ------------------------------------------------------------

addMdToPage(`## Hypothesis 2: Academic Pressure and Depression

**H₀:** Academic pressure and depression are independent  
**H₁:** There is a relationship
`);

const lowAP = students
  .filter(s => [0,1,2].includes(s.academicPressure))
  .map(s => s.depression === "Yes" ? 1 : 0);

const highAP = students
  .filter(s => [4,5].includes(s.academicPressure))
  .map(s => s.depression === "Yes" ? 1 : 0);

const apT = runTTest(lowAP, highAP);
const apTable = buildContingency(lowAP, highAP);
const apChi = stdLib.stats.chi2test(apTable);

tableFromData({
  data: [
    {
      Group: "Low Pressure",
      MeanDepression: apT.meanA.toFixed(3),
      SampleSize: lowAP.length
    },
    {
      Group: "High Pressure",
      MeanDepression: apT.meanB.toFixed(3),
      SampleSize: highAP.length
    }
  ]
});

drawGoogleChart({
  type: 'ColumnChart',
  data: [
    ["Group", "Mean Depression"],
    ["Low Pressure", apT.meanA],
    ["High Pressure", apT.meanB]
  ],
  options: {
    title: "Depression Rate by Academic Pressure",
    height: 400,
    legend: { position: "none" }
  }
});

addMdToPage(`
### Statistical Tests

- t-value: ${apT.t.toFixed(3)} (${apT.significance})
- Chi-square p-value: ${apChi.pValue.toFixed(4)}

${apChi.rejected 
  ? "We reject H₀ → strong evidence of a relationship."
  : "We fail to reject H₀ → no strong evidence."}
`);

addMdToPage(`
### Interpretation

Academic pressure shows one of the strongest relationships with depression in
the dataset. Students experiencing high pressure report substantially higher
depression rates.

This suggests academic stress is a key contributing factor, although causality
cannot be confirmed.
`);


// ------------------------------------------------------------
// HYPOTHESIS 3: COMBINED FACTORS
// ------------------------------------------------------------

addMdToPage(`## Hypothesis 3: Combined Risk Factors

We test whether multiple stress factors together increase depression risk.
`);

const highRisk = students
  .filter(s => s.academicPressure >= 4 && s.sleepDuration === "1. Less than 5 hours")
  .map(s => s.depression === "Yes" ? 1 : 0);

const lowRisk = students
  .filter(s => s.academicPressure <= 2 && s.sleepDuration === "3. 7-8 hours")
  .map(s => s.depression === "Yes" ? 1 : 0);

const comboT = runTTest(highRisk, lowRisk);
const comboTable = buildContingency(highRisk, lowRisk);
const comboChi = stdLib.stats.chi2test(comboTable);

tableFromData({
  data: [
    {
      Group: "High Risk (High Pressure + Low Sleep)",
      MeanDepression: comboT.meanA.toFixed(3),
      SampleSize: highRisk.length
    },
    {
      Group: "Low Risk (Low Pressure + Good Sleep)",
      MeanDepression: comboT.meanB.toFixed(3),
      SampleSize: lowRisk.length
    }
  ]
});

drawGoogleChart({
  type: 'ColumnChart',
  data: [
    ["Group", "Mean Depression"],
    ["High Risk", comboT.meanA],
    ["Low Risk", comboT.meanB]
  ],
  options: {
    title: "Combined Risk Factors and Depression",
    height: 400,
    legend: { position: "none" }
  }
});

addMdToPage(`
### Statistical Tests

- t-value: ${comboT.t.toFixed(3)} (${comboT.significance})
- Chi-square p-value: ${comboChi.pValue.toFixed(4)}

${comboChi.rejected 
  ? "Statistically significant relationship"
  : "No statistically significant relationship"}
`);

addMdToPage(`
### Interpretation

Students exposed to both high academic pressure and poor sleep show the highest
levels of depression.

This suggests that multiple stress factors interact and amplify mental health
risk. This is the strongest pattern observed in the analysis.

However, causality cannot be confirmed, and other underlying variables may also
play a role.
`);