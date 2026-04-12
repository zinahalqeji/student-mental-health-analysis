addMdToPage(`# Conclusion`);

addMdToPage(`
This project analyzed a large dataset of students in india to understand how
academic, lifestyle, and personal factors relate to self-reported depression.

By combining **descriptive statistics**, **correlation analysis**, and
**hypothesis testing**, we identified consistent patterns that provide insight
into student mental health.
`);


// ------------------------------------------------------------
// KEY FINDINGS TABLE 
// ------------------------------------------------------------
tableFromData({
  data: [
    {
      Factor: "Academic Pressure",
      Relationship: "Strong positive",
      Insight: "Higher pressure → higher depression"
    },
    {
      Factor: "Work/Study Hours",
      Relationship: "Weak positive",
      Insight: "9+ hours shows highest risk"
    },
    {
      Factor: "Sleep Duration",
      Relationship: "Moderate negative",
      Insight: "Short sleep → higher depression"
    },
    {
      Factor: "Combined Factors",
      Relationship: "Strongest effect",
      Insight: "Multiple stressors amplify risk"
    }
  ]
});


// ------------------------------------------------------------
// FINAL STORY
// ------------------------------------------------------------
drawGoogleChart({
  type: 'ColumnChart',
  data: [
    ["Factor", "Impact Level"],
    ["Academic Pressure", 0.45],
    ["Work Hours", 0.20],
    ["Sleep (inverse)", 0.35]
  ],
  options: {
    title: "Relative Impact on Depression (Conceptual Summary)",
    height: 400,
    legend: { position: "none" },
    vAxis: { title: "Strength of Association" }
  }
});


// ------------------------------------------------------------
// KEY INSIGHTS
// ------------------------------------------------------------
addMdToPage(`
## Key Insights

- **Academic pressure** is the most consistent and influential factor associated
  with depression across all analyses.
  
- **Sleep plays a critical protective role** — students with shorter sleep
  durations show significantly higher depression rates.

- **Workload contributes to mental strain**, particularly at extreme levels
  (9+ hours per day), although its effect is weaker than academic pressure.

- **Combined stressors have the strongest impact** — students experiencing both
  high pressure and poor sleep show the highest risk of depression.

These findings highlight that student depression is not driven by a single cause,
but rather by the **interaction of multiple stress factors**.
`);


// ------------------------------------------------------------
// LIMITATIONS 
// ------------------------------------------------------------
addMdToPage(`
## Limitations

- The dataset is **observational**, meaning causal relationships cannot be established.
- All variables are **self-reported**, which may introduce bias or measurement error.
- Some variables (e.g., sleep categories) are **ordinal**, limiting precision in analysis.

Despite these limitations, the consistency of patterns across multiple methods
(correlation, chi-square, and hypothesis testing) strengthens the reliability of the findings.
`);


// ------------------------------------------------------------
// FINAL INTERPRETATION 
// ------------------------------------------------------------
addMdToPage(`
## Final Interpretation

Overall, the analysis demonstrates that student mental health is shaped by a
combination of **academic demands**, **lifestyle behaviors**, and **personal context**.

Among these, academic pressure and sleep emerge as the most influential factors,
while workload plays a supporting role.

The results strongly suggest that effective interventions should not focus on a
single variable, but instead adopt a **holistic approach** that addresses multiple
dimensions of student life.
`);


// ------------------------------------------------------------
// FUTURE WORK
// ------------------------------------------------------------
addMdToPage(`
## Future Work

Future research could extend this analysis by:

- Using **longitudinal data** to study changes over time
- Incorporating **psychological scales** for deeper measurement
- Applying **predictive models (machine learning)** to identify high-risk students

Such approaches would provide a more comprehensive understanding of the dynamics
of student well-being.
`);


// ------------------------------------------------------------
//  CLOSING LINE 
// ------------------------------------------------------------
addMdToPage(`
---

### Final Remark

Student depression is a complex and multifaceted issue.  
This project shows that behind the data are **real patterns that reflect real struggles**.

Understanding these patterns is the first step toward building better support systems
for students — both academically and personally.
`);