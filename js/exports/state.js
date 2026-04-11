// --------------------------------------------------
// GLOBAL FILTER SYSTEM (VG+++ LEVEL)
// --------------------------------------------------

export let gender = addDropdown('Filter by gender:', ['All', 'Male', 'Female']);

// --------------------------------------------------
// BASE QUERY BUILDER
// --------------------------------------------------

export function buildQuery(baseQuery) {
  if (gender === 'All') return baseQuery;

  if (baseQuery.toLowerCase().includes('where')) {
    return baseQuery + ` AND gender = '${gender}'`;
  } else {
    return baseQuery + ` WHERE gender = '${gender}'`;
  }
}

// --------------------------------------------------
// LOAD FILTERED DATA
// --------------------------------------------------

export async function getFilteredData(columns = '*', extraCondition = '') {
  dbQuery.use('student-depression');

  let query = `SELECT ${columns} FROM student_depression`;

  if (extraCondition) {
    query += ` WHERE ${extraCondition}`;
  }

  query = buildQuery(query);

  return await dbQuery(query);
}