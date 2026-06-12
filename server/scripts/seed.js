const bcrypt = require('bcryptjs');
const { Track } = require('../models/Track');
const { User } = require('../models/User');
const { Progress } = require('../models/Progress');

const defaultTracks = [
  {
    title: "Full Stack Developer Track",
    description: "Master modern web development from frontend layout to backend deployment and database management.",
    difficulty: "Beginner",
    modules: [
      {
        title: "HTML & CSS Essentials",
        description: "Learn the backbone of web layouts, semantic elements, responsive grid layouts, and Tailwind CSS basics.",
        order: 1,
        difficulty: "Beginner",
        duration: "4 hours",
        lessons: [
          { title: "Introduction to HTML5 Semantics", videoURL: "https://www.youtube.com/embed/qz0aGYMCip0", duration: "12 mins" },
          { title: "CSS Grid & Flexbox Masterclass", videoURL: "https://www.youtube.com/embed/jV8BXP4nGYo", duration: "18 mins" },
          { title: "Responsive Design & Tailwind Basics", videoURL: "https://www.youtube.com/embed/m7OWXtbiXX8", duration: "15 mins" }
        ]
      },
      {
        title: "JavaScript Fundamentals",
        description: "Understand variables, loops, ES6 classes, promises, async/await, DOM manipulations, and API fetching.",
        order: 2,
        difficulty: "Beginner",
        duration: "6 hours",
        lessons: [
          { title: "JavaScript Variables & Control Flow", videoURL: "https://www.youtube.com/embed/W6NZfCO5SIk", duration: "14 mins" },
          { title: "Understanding Callbacks & Promises", videoURL: "https://www.youtube.com/embed/2d7s3m1tpSg", duration: "20 mins" },
          { title: "Async/Await & Fetching Web APIs", videoURL: "https://www.youtube.com/embed/Yp9KIcSKTNg", duration: "16 mins" }
        ]
      },
      {
        title: "React Fundamentals",
        description: "Explore building interactive declarative user interfaces, components, custom hooks, and state context.",
        order: 3,
        difficulty: "Intermediate",
        duration: "8 hours",
        lessons: [
          { title: "React Component Lifecycle & Props", videoURL: "https://www.youtube.com/embed/Ke90Tje7VS0", duration: "15 mins" },
          { title: "State Management with useState & useEffect", videoURL: "https://www.youtube.com/embed/O6P86uwfdGP", duration: "22 mins" },
          { title: "Global Context API & Custom Hooks", videoURL: "https://www.youtube.com/embed/35lXWv-t1gY", duration: "18 mins" }
        ]
      },
      {
        title: "Node.js Core Architecture",
        description: "Dive into backend Javascript, the V8 runtime environment, event loops, and package management.",
        order: 4,
        difficulty: "Intermediate",
        duration: "5 hours",
        lessons: [
          { title: "Introduction to Node.js & NPM", videoURL: "https://www.youtube.com/embed/TlB_eWDSMt4", duration: "12 mins" },
          { title: "File System Operations & Streams", videoURL: "https://www.youtube.com/embed/U57kU311c38", duration: "17 mins" }
        ]
      },
      {
        title: "Express.js REST Services",
        description: "Develop robust backends with server routing, request parameters, JSON APIs, and custom middleware.",
        order: 5,
        difficulty: "Intermediate",
        duration: "6 hours",
        lessons: [
          { title: "Creating Express Servers & Route Controllers", videoURL: "https://www.youtube.com/embed/SccSCuHhOw0", duration: "18 mins" },
          { title: "Writing Express Custom Middlewares", videoURL: "https://www.youtube.com/embed/lY6icfhap2o", duration: "14 mins" }
        ]
      },
      {
        title: "MongoDB & Data Operations",
        description: "Store client details dynamically using MongoDB document schemas and Mongoose database aggregators.",
        order: 6,
        difficulty: "Advanced",
        duration: "6 hours",
        lessons: [
          { title: "NoSQL DB Architecture & Mongo Atlas Setup", videoURL: "https://www.youtube.com/embed/oqiMC7_E4A4", duration: "16 mins" },
          { title: "Mongoose Schema Definitions & Queries", videoURL: "https://www.youtube.com/embed/W5KpPl5IO18", duration: "19 mins" }
        ]
      },
      {
        title: "Production Deployment",
        description: "Deploy client UI with Vercel and web servers on Render or VPS systems.",
        order: 7,
        difficulty: "Advanced",
        duration: "4 hours",
        lessons: [
          { title: "Deploying Frontends with Vercel/Netlify", videoURL: "https://www.youtube.com/embed/2kL1Z41h_z8", duration: "11 mins" },
          { title: "Deploying API Servers on Render & CORS Handling", videoURL: "https://www.youtube.com/embed/p1Q4yE_K09w", duration: "15 mins" }
        ]
      }
    ]
  },
  {
    title: "AI Engineer Track",
    description: "Launch your career in intelligence systems from foundational math and python to training custom LLMs.",
    difficulty: "Intermediate",
    modules: [
      {
        title: "Python for Artificial Intelligence",
        description: "Dive into data processing, NumPy array structures, Pandas dataframes, and advanced file IO.",
        order: 1,
        difficulty: "Beginner",
        duration: "5 hours",
        lessons: [
          { title: "Advanced Python Arrays with NumPy", videoURL: "https://www.youtube.com/embed/QUT1VHiLgKQ", duration: "15 mins" },
          { title: "Data Manipulation using Pandas DataFrames", videoURL: "https://www.youtube.com/embed/vmEHCJof1kU", duration: "18 mins" }
        ]
      },
      {
        title: "Mathematics for AI",
        description: "Gain linear algebra fundamentals, matrix transformations, calculus derivatives, and gradient descents.",
        order: 2,
        difficulty: "Intermediate",
        duration: "8 hours",
        lessons: [
          { title: "Linear Algebra: Matrices & Vector Spaces", videoURL: "https://www.youtube.com/embed/fNk_zzaMoEs", duration: "22 mins" },
          { title: "Calculus: Understanding Gradients & Backpropagation", videoURL: "https://www.youtube.com/embed/Ilg3gGewQ5U", duration: "25 mins" }
        ]
      },
      {
        title: "Machine Learning Foundations",
        description: "Create models for regression, random forests, classification, clusters, and validation.",
        order: 3,
        difficulty: "Intermediate",
        duration: "10 hours",
        lessons: [
          { title: "Supervised Learning: Regressions & Classification", videoURL: "https://www.youtube.com/embed/GwIo3gGisEA", duration: "20 mins" },
          { title: "Training Models with Scikit-Learn", videoURL: "https://www.youtube.com/embed/M9Itm95JzL0", duration: "18 mins" }
        ]
      },
      {
        title: "Deep Learning & Neural Networks",
        description: "Develop feed-forward and convolutional models using PyTorch/TensorFlow frameworks.",
        order: 4,
        difficulty: "Advanced",
        duration: "12 hours",
        lessons: [
          { title: "Building Neural Networks in PyTorch", videoURL: "https://www.youtube.com/embed/c36lUUrxsHs", duration: "25 mins" },
          { title: "CNNs for Computer Vision Applications", videoURL: "https://www.youtube.com/embed/aircAruvnKk", duration: "21 mins" }
        ]
      },
      {
        title: "Generative AI & LLMs",
        description: "Examine Attention networks, Transformers, vector databases, and prompt fine-tunings.",
        order: 5,
        difficulty: "Advanced",
        duration: "10 hours",
        lessons: [
          { title: "Attention Mechanism & Transformer Architectures", videoURL: "https://www.youtube.com/embed/zxQyTk8vQQM", duration: "28 mins" },
          { title: "RAG & Vector Embeddings with Pinecone", videoURL: "https://www.youtube.com/embed/Q-Z8c6N0k9w", duration: "24 mins" }
        ]
      }
    ]
  },
  {
    title: "Data Analyst Track",
    description: "Extract business insights and compile dynamic summaries from relational query logs to PowerBI visual panels.",
    difficulty: "Beginner",
    modules: [
      {
        title: "Excel Data Modeling",
        description: "Master pivots, conditional formulas, VBA scripting, and dynamic sorting tables.",
        order: 1,
        difficulty: "Beginner",
        duration: "4 hours",
        lessons: [
          { title: "Advanced Excel VLOOKUP, INDEX & MATCH", videoURL: "https://www.youtube.com/embed/y29n63k_dpg", duration: "12 mins" },
          { title: "Creating Professional Pivot Tables & Slicers", videoURL: "https://www.youtube.com/embed/mK3z4X8uX4I", duration: "16 mins" }
        ]
      },
      {
        title: "SQL querying for Analysts",
        description: "Construct queries, aggregate outputs, filter indices, join schemas, and nested queries.",
        order: 2,
        difficulty: "Beginner",
        duration: "6 hours",
        lessons: [
          { title: "SQL Basic Queries: SELECT, WHERE, GROUP BY", videoURL: "https://www.youtube.com/embed/HXV3zeQKqGY", duration: "15 mins" },
          { title: "Advanced SQL JOINS & Common Table Expressions", videoURL: "https://www.youtube.com/embed/9Pzj7Aj25lw", duration: "20 mins" }
        ]
      },
      {
        title: "Python Analytics (NumPy & Pandas)",
        description: "Clean tables, filter variables, merge datasets, and clean up empty columns.",
        order: 3,
        difficulty: "Intermediate",
        duration: "8 hours",
        lessons: [
          { title: "Python Pandas: Data Cleaning Techniques", videoURL: "https://www.youtube.com/embed/gpCGuM5_K0E", duration: "18 mins" },
          { title: "Exploratory Data Analysis with Python", videoURL: "https://www.youtube.com/embed/3e4-c-B1-bQ", duration: "22 mins" }
        ]
      },
      {
        title: "Data Visualization (Matplotlib & Seaborn)",
        description: "Plot graphs, charts, scatters, heatmaps, and trend projections.",
        order: 4,
        difficulty: "Intermediate",
        duration: "5 hours",
        lessons: [
          { title: "Creating High Quality Plots with Seaborn", videoURL: "https://www.youtube.com/embed/6GUuR7zO8ps", duration: "15 mins" }
        ]
      },
      {
        title: "Power BI Dashboards",
        description: "Design dashboard views, connect DB interfaces, establish queries, and construct visuals.",
        order: 5,
        difficulty: "Intermediate",
        duration: "6 hours",
        lessons: [
          { title: "Introduction to Power BI Desktop & DAX", videoURL: "https://www.youtube.com/embed/AGrl-H87pRU", duration: "20 mins" },
          { title: "Designing Beautiful and Interactive BI Reports", videoURL: "https://www.youtube.com/embed/7V6Vf2dF_B8", duration: "18 mins" }
        ]
      }
    ]
  }
];

async function seedData() {
  try {
    console.log('Seeding database...');

    await Track.deleteMany({});
    await User.deleteMany({});
    await Progress.deleteMany({});

    const seededTracks = [];
    for (const trackInfo of defaultTracks) {
      const track = await Track.create(trackInfo);
      seededTracks.push(track);
    }
    console.log(`Seeded ${seededTracks.length} Learning Tracks successfully.`);

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Password123', salt);
    const studentPassword = await bcrypt.hash('Password123', salt);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@lms.com",
      password: adminPassword,
      role: "admin",
      skillLevel: "Advanced",
      careerGoal: "Full Stack Developer",
      xp: 1200,
      streak: 5,
      lastActiveDate: new Date(),
      badges: ["Welcome Onboard", "System Administrator"]
    });
    console.log('Seeded Admin account (admin@lms.com / Password123).');

    const fullStackTrack = seededTracks.find(t => t.title.includes("Full Stack"));
    const student = await User.create({
      name: "Sourav T P",
      email: "student@lms.com",
      password: studentPassword,
      role: "student",
      skillLevel: "Beginner",
      careerGoal: "Full Stack Developer",
      interests: ["React", "AI", "Deployment"],
      assignedTrack: fullStackTrack._id,
      xp: 250,
      streak: 4,
      lastActiveDate: new Date(),
      badges: ["Welcome Onboard", "First Step", "Fast Learner"]
    });
    console.log('Seeded Student account (student@lms.com / Password123).');

    const module1 = fullStackTrack.modules[0];
    const completedLessonIds = [
      module1.lessons[0]._id.toString(),
      module1.lessons[1]._id.toString()
    ];

    const totalLessonsCount = fullStackTrack.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completionPct = Math.round((completedLessonIds.length / totalLessonsCount) * 100);

    const studentProgress = await Progress.create({
      userId: student._id,
      trackId: fullStackTrack._id,
      completedLessons: completedLessonIds,
      completedModules: [],
      percentage: completionPct
    });
    
    console.log('Seeded Student progress details.');
    console.log('Database seeding finished successfully!\n');

  } catch (error) {
    console.error('Seeding error:', error);
  }
}

module.exports = seedData;
