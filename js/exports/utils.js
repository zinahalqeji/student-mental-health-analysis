// ------------------------------------------------------------
// 1. Global Gender Filter
// ------------------------------------------------------------
export function filterByGender(data, gender) {
  if (!gender || gender === 'All') return data;
  return data.filter(d => d.gender === gender);
}


// ------------------------------------------------------------
// 2. Depression Encoding (Yes/No → 1/0)
// ------------------------------------------------------------
export function toBinaryDepression(value) {
  return value === 'Yes' ? 1 : 0;
}


// ------------------------------------------------------------
// 3. Safe Depression Rate (%)
// ------------------------------------------------------------
export function getDepressionRate(depressed, total) {
  if (!total || total === 0) return 0;
  return +((depressed / total) * 100).toFixed(1);
}


// ------------------------------------------------------------
// 4. Generic Group By (VERY IMPORTANT)
// Replaces repeated grouping logic everywhere
// ------------------------------------------------------------
export function groupBy(data, key) {
  const result = {};

  for (let item of data) {
    const value = item[key];

    if (!result[value]) {
      result[value] = [];
    }

    result[value].push(item);
  }

  return result;
}


// ------------------------------------------------------------
// 5. Depression Summary by Category
// (Used in sleep, pressure, etc.)
// ------------------------------------------------------------
export function getDepressionSummary(data, key) {
  const grouped = groupBy(data, key);

  return Object.entries(grouped).map(([category, values]) => {
    const total = values.length;
    const depressed = values.filter(v => v.depression === 'Yes').length;

    return {
      category,
      total,
      depressed,
      rate: getDepressionRate(depressed, total)
    };
  });
}


// ------------------------------------------------------------
// 6. Work Hour Grouping (STANDARDIZED)
// ------------------------------------------------------------
export function getWorkGroup(hours) {
  if (hours <= 2) return '0–2 h';
  if (hours <= 5) return '3–5 h';
  if (hours <= 8) return '6–8 h';
  return '9+ h';
}


// ------------------------------------------------------------
// 7. Correlation Helper (clean wrapper)
// ------------------------------------------------------------
export function correlation(x, y) {
  if (x.length !== y.length || x.length === 0) return 0;
  return s.sampleCorrelation(x, y);
}


// ------------------------------------------------------------
// 8. Build Arrays for Analysis (VERY USEFUL)
// ------------------------------------------------------------
export function buildArrays(data, xKey, yKeyBinary = true) {
  let x = [];
  let y = [];

  for (let row of data) {
    if (row[xKey] == null || row[yKeyBinary] == null) continue;

    x.push(row[xKey]);

    y.push(
      yKeyBinary
        ? toBinaryDepression(row.depression)
        : row[yKeyBinary]
    );
  }

  return { x, y };
}


// ------------------------------------------------------------
// 9. Insight Generator (EXAMINER GOLD ⭐)
// ------------------------------------------------------------
export function getMinMaxInsight(rows, valueKey = 'rate') {
  if (!rows || rows.length === 0) return null;

  let max = rows.reduce((a, b) => a[valueKey] > b[valueKey] ? a : b);
  let min = rows.reduce((a, b) => a[valueKey] < b[valueKey] ? a : b);

  return { max, min };
}


// ------------------------------------------------------------
// 10. Clean Sleep Label (remove numbering)
// ------------------------------------------------------------
export function cleanSleepLabel(label) {
  return label.replace(/^\d\.\s*/, '');
}


// ------------------------------------------------------------
// 11. Sorting Helpers
// ------------------------------------------------------------
export function sortByKeyAsc(arr, key) {
  return arr.toSorted((a, b) => a[key] - b[key]);
}

export function sortByKeyDesc(arr, key) {
  return arr.toSorted((a, b) => b[key] - a[key]);
}


// ------------------------------------------------------------
// 12. Sleep Category Order (STANDARD)
// ------------------------------------------------------------
export const sleepOrder = [
  "1. Less than 5 hours",
  "2. 5-6 hours",
  "3. 7-8 hours",
  "4. More than 8 hours"
];

export function sortSleep(rows, key = 'Sleep') {
  return rows.toSorted(
    (a, b) => sleepOrder.indexOf(a[key]) - sleepOrder.indexOf(b[key])
  );
}
