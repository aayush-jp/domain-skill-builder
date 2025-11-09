import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User';
import Domain from './models/Domain';
import Quiz from './models/Quiz';
import Attempt from './models/Attempt';
import Recommendation from './models/Recommendation';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/skillbuilder';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database for seeding.');

    // --- Clear Existing Data ---
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Domain.deleteMany({});
    await Quiz.deleteMany({});
    await Attempt.deleteMany({});
    await Recommendation.deleteMany({});

    // --- Seed Users ---
    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const studentUser = await User.create({
      name: 'Test Student',
      email: 'student@example.com',
      passwordHash,
      role: 'student',
    });
    console.log(`Created user: ${studentUser.email}`);

    // --- Seed Domains ---
    console.log('Seeding domains...');
    const domains = [
      {
        slug: 'data-analyst',
        title: 'Data Analyst',
        description: 'Learn to collect, clean, and interpret data sets to answer a question or solve a problem.',
        topics: [
          { title: 'SQL Basics', key: 'sql-basics', order: 1 },
          { title: 'Pandas for Data Manipulation', key: 'python-pandas', order: 2 },
          { title: 'Data Visualization with Matplotlib', key: 'data-visualization', order: 3 },
          { title: 'Introductory Statistics', key: 'statistics', order: 4 },
          { title: 'Storytelling with Data', key: 'storytelling', order: 5 },
        ],
      },
      {
        slug: 'full-stack-engineer',
        title: 'Full-Stack Engineer',
        description: 'Master both front-end and back-end technologies to build complete web applications.',
        topics: [
          { title: 'HTML & CSS Fundamentals', key: 'html-css', order: 1 },
          { title: 'Modern JavaScript (ES6+)', key: 'javascript', order: 2 },
          { title: 'React for UI Development', key: 'react-basics', order: 3 },
          { title: 'Node.js & Express APIs', key: 'node-express', order: 4 },
          { title: 'MongoDB with Mongoose', key: 'mongodb', order: 5 },
        ],
      },
      {
        slug: 'ai-engineer',
        title: 'AI Engineer',
        description: 'Build and deploy machine learning models to solve real-world problems.',
        topics: [
          { title: 'Advanced Python', key: 'python-advanced', order: 1 },
          { title: 'Linear Algebra for ML', key: 'linear-algebra', order: 2 },
          { title: 'Introduction to Machine Learning', key: 'intro-to-ml', order: 3 },
          { title: 'Deep Learning with Neural Networks', key: 'neural-networks', order: 4 },
          { title: 'Natural Language Processing Basics', key: 'nlp-basics', order: 5 },
        ],
      },
    ];
    await Domain.insertMany(domains);
    console.log('Seeded 3 domains.');

    // --- Seed Quizzes ---
    console.log('Seeding quizzes...');
const quizzes = [
  {
    domainSlug: 'data-analyst',
    title: 'SQL Basics Quiz',
    difficulty: 'easy',
    questions: [
      { qid: 'q1', stem: 'Which SQL statement is used to extract data from a database?', options: ['GET', 'SELECT', 'EXTRACT', 'OPEN'], answerIndex: 1, topicKey: 'sql-basics' },
      { qid: 'q2', stem: 'Which SQL keyword is used to sort the result-set?', options: ['ORDER BY', 'SORT', 'ORDER', 'SORT BY'], answerIndex: 0, topicKey: 'sql-basics' },
      { qid: 'q3', stem: 'Which clause is used to filter records?', options: ['FILTER', 'WHERE', 'SELECT', 'FROM'], answerIndex: 1, topicKey: 'sql-basics' },
      { qid: 'q4', stem: 'What does `JOIN` do?', options: ['Combine rows from two or more tables', 'Create a new table', 'Delete a table', 'Update a row'], answerIndex: 0, topicKey: 'sql-basics' },
    ],
  },
   {
    domainSlug: 'full-stack-engineer',
    title: 'JavaScript Fundamentals Quiz',
    difficulty: 'easy',
    questions: [
      { qid: 'q1', stem: 'Which keyword is used to declare a variable that cannot be reassigned?', options: ['let', 'var', 'const', 'static'], answerIndex: 2, topicKey: 'javascript' },
      { qid: 'q2', stem: 'What is the correct way to write an arrow function?', options: ['() => {}', 'function() {}', '=> {}', 'func() => {}'], answerIndex: 0, topicKey: 'javascript' },
      { qid: 'q3', stem: 'What does `===` check for?', options: ['Value only', 'Type only', 'Value and type', 'Assignment'], answerIndex: 2, topicKey: 'javascript' },
      { qid: 'q4', stem: 'Which method is used to add an element to the end of an array?', options: ['array.add()', 'array.push()', 'array.append()', 'array.end()'], answerIndex: 1, topicKey: 'javascript' },
    ],
  },
];
    await Quiz.insertMany(quizzes);
    console.log('Seeded 2 quizzes.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();