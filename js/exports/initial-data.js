dbQuery.use('student-depression');

export let students = await dbQuery('SELECT * FROM student_depression');

export let fieldDescriptions = await jload('json/field-descriptions.json');

export let initialComments = `
This project analyzes student mental health in relation to lifestyle,
academic pressure, workload, and personal background factors.

- Dataset: university students in India
- Target variable: depression (Yes/No)
- Key factors: sleep duration, academic pressure, work/study hours,
  dietary habits, financial stress, family history, CGPA.
`;
