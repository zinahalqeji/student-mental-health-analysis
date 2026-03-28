dbQuery.use('student-depression');

//  Load dataset
export let students = await dbQuery(`
  SELECT * FROM student_depression
`);

//  Load descriptions
export let fieldDescriptions = await jload('json/field-descriptions.json');

//  Intro text
export let initialComments = `
# Student Depression Dataset

- Total students: ${students.length}
- Dataset includes academic, lifestyle, and mental health factors.

This project explores how different factors affect depression.
`;