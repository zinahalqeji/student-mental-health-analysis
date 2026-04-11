// --------------------------------------------------
// GROUP + RATE CALCULATOR
// --------------------------------------------------

export function groupByWithRate(data, key) {
  let grouped = {};

  for (let row of data) {
    let k = row[key];

    if (!grouped[k]) {
      grouped[k] = { key: k, total: 0, depressed: 0 };
    }

    grouped[k].total++;
    if (row.depression === 'Yes') grouped[k].depressed++;
  }

  return Object.values(grouped).map(r => ({
    category: r.key,
    total: r.total,
    depressionRate: r.depressed / r.total
  }));
}

// --------------------------------------------------
// CORRELATION SAFE
// --------------------------------------------------

export function correlationSafe(x, y) {
  if (x.length < 2) return 0;
  return s.sampleCorrelation(x, y);
}

// --------------------------------------------------
// INSIGHT GENERATOR (EXAMINER MAGIC)
// --------------------------------------------------

export function generateInsight(title, value, interpretation) {
  addMdToPage(`
### 🔍 Insight: ${title}

**Key Result:** ${value}  

**Interpretation:**  
${interpretation}
`);
}