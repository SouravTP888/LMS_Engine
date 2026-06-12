const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./scripts/seed');
const { Track } = require('./models/Track');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/ai', require('./routes/ai'));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    useJsonDb: global.useJsonDb || false,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  try {
    const trackCount = await Track.countDocuments({});
    if (trackCount === 0) {
      console.log('Database appears empty. Auto-seeding initial learning tracks...');
      await seedData();
    } else {
      console.log('Database already seeded. Skipping initial seeding.');
    }
  } catch (err) {
    console.error('Database seeding error on start-up:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`LMS Automation Engine Server running on port ${PORT}`);
    console.log(`Local fallback JSON-DB status: ${global.useJsonDb ? 'ENABLED' : 'DISABLED'}`);
    console.log(`==================================================`);
  });
};

startServer();
