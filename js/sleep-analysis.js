import { students } from './exports/initial-data.js';

addMdToPage(`# Sleep Analysis`);

addMdToPage(`
In this section we examine how different sleep duration categories relate to depression.
Sleep is kept as text categories (e.g. "5-6 hours", "7-8 hours"), and we compare
the share of students reporting depression in each group.
`);

// Group data by sleepDuration

const grouped = {};

for (const s of students) {
  const category = s.sleepDuration;

  if (!grouped[category]) {
    grouped[category] = {
      sleepDuration: category,
      participants: 0,
      depressed: 0
    };
  }

  grouped[category].participants++;

  if (s.depression === "Yes") {
    grouped[category].depressed++;
  }
}

// Convert grouped data into rows

let rows = Object.values(grouped).map(r => ({
  sleepDuration: r.sleepDuration,
  participants: r.participants,
  depressionRate: r.depressed / r.participants
}));

// Sort by number of participants (descending)

rows = rows.toSorted((a, b) => b.participants - a.participants);

// TABLE — show full data

tableFromData({
  data: rows,
  numberFormatOptions: { maximumFractionDigits: 3 }
});

// CHART — only include the two needed fields

const chartRows = rows.map(r => ({
  sleepDuration: r.sleepDuration,
  depressionRate: r.depressionRate
}));

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartRows, 'sleepDuration', 'depressionRate'),
  options: {
    title: 'Depression rate by sleep duration',
    height: 500,
    vAxis: { title: 'Share depressed (0–1)' }
  }
});

addMdToPage(`
We can visually inspect whether shorter or longer sleep is associated with higher
depression rates. This is a categorical comparison rather than a numeric mean.
`);
