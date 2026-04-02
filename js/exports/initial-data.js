// Load the student depression dataset
dbQuery.use('student-depression');

// Full dataset of student responses
export let students = await dbQuery('SELECT * FROM student_depression');

// Field descriptions for the Data Dictionary page
export let fieldDescriptions = await jload('json/field-descriptions.json');

// Introductory text shown on the Overview page
export let initialComments = `
This project investigates the factors associated with student depression using a
large dataset of university students in India. The central research question is:

**What makes a student more vulnerable to depression?**

The dataset includes a wide range of variables covering academic, lifestyle, and
personal background factors, such as:

- Academic pressure
- Sleep duration
- Daily work/study hours
- Dietary habits
- Financial stress
- Family history of mental illness
- CGPA (academic performance)

These variables allow us to explore how different aspects of student life relate
to self‑reported depression, and to examine whether certain groups—such as male
and female students—experience these factors differently.
`;
