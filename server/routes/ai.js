const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Track } = require('../models/Track');
const { Progress } = require('../models/Progress');
const { calculateTrackStatus } = require('../services/automationEngine');

const TOPIC_EXPLANATIONS = {
  javascript: "JavaScript is a high-level, dynamic programming language that is one of the core technologies of the World Wide Web. It enables interactive web pages and is an essential part of web applications. For modern web development, focus on ES6+ features, asynchronous programming (Promises/async-await), and DOM manipulation.",
  react: "React is a popular open-source JavaScript library developed by Meta for building user interfaces, particularly single-page applications. It's declarative, component-based, and relies on a Virtual DOM for fast updates. Make sure you understand JSX, state vs props, hooks (useState, useEffect), and component lifecycles.",
  python: "Python is a versatile, high-level programming language known for its readability and clean syntax. In AI and Data Science, it is the industry standard due to its powerful ecosystem of libraries like NumPy, Pandas, Scikit-Learn, TensorFlow, and PyTorch. Master functions, lists/dictionaries, and classes first.",
  mongodb: "MongoDB is a document-oriented NoSQL database that stores data in JSON-like documents with flexible schemas. This matches JSON formatting in JavaScript, making it a natural fit for the MERN stack. Focus on understanding collections, documents, aggregation pipelines, and indexing.",
  express: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies routing, middleware integration, and request handling for building RESTful APIs.",
  node: "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It uses an asynchronous event-driven model, making it highly efficient for real-time applications, microservices, and server-side logic.",
  ai: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. It spans multiple subfields including Machine Learning, Deep Learning, Natural Language Processing, and Generative AI (like LLMs).",
  sql: "SQL (Structured Query Language) is the standard language for relational database management systems. It is essential for querying, updating, and managing relational databases. Focus on SELECT queries, JOINs, group-by aggregates, and indexing."
};

router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const lowerMessage = message.toLowerCase().trim();
    const userName = req.user.name;
    const goal = req.user.careerGoal;
    const skill = req.user.skillLevel;
    
    let trackDetails = "no track assigned yet";
    let nextRecommended = "Assign a track first!";
    let completionPct = 0;

    if (req.user.assignedTrack) {
      const track = await Track.findById(req.user.assignedTrack);
      if (track) {
        const progress = await Progress.findOne({ userId: req.user._id, trackId: track._id });
        const statusTrack = calculateTrackStatus(track, progress);
        completionPct = statusTrack.overallPercentage;
        trackDetails = `${statusTrack.title} (${completionPct}% complete)`;
        
        const nextIncomplete = statusTrack.modules.find(m => m.status === 'UNLOCKED' || m.status === 'LOCKED');
        if (nextIncomplete) {
          nextRecommended = `"${nextIncomplete.title}" (${nextIncomplete.status})`;
        } else {
          nextRecommended = "You completed all modules! Congratulations!";
        }
      }
    }

    let responseText = "";

    if (lowerMessage.includes("learn next") || lowerMessage.includes("what should i learn") || lowerMessage.includes("next module")) {
      responseText = `Hello ${userName}! Based on your current career goal as a **${goal}** (${skill} level), you are enrolled in the **${trackDetails}**. 
      
Your next target module is **${nextRecommended}**. Focus on completing the remaining lessons in this module to unlock the next one!`;
    } 
    else if (lowerMessage.includes("explain") || lowerMessage.includes("what is")) {
      let matchedTopic = null;
      for (const topic of Object.keys(TOPIC_EXPLANATIONS)) {
        if (lowerMessage.includes(topic)) {
          matchedTopic = topic;
          break;
        }
      }

      if (matchedTopic) {
        responseText = `### Explaining: ${matchedTopic.toUpperCase()} 📘\n\n${TOPIC_EXPLANATIONS[matchedTopic]}\n\nLet me know if you want me to quiz you or suggest resources for this!`;
      } else {
        responseText = `I can explain many core topics! I have detailed knowledge on: **JavaScript, React, Node, Express, MongoDB, Python, AI, and SQL**. 
        
Just ask me like: *"Explain React"* or *"What is Python?"*`;
      }
    } 
    else if (lowerMessage.includes("advice") || lowerMessage.includes("study") || lowerMessage.includes("tips") || lowerMessage.includes("how to study")) {
      if (skill === 'Beginner') {
        responseText = `### 💡 Study Advice for Beginners (${userName}):
1. **Consistency over Intensity**: Learn for 30-60 minutes every day rather than 6 hours on Sunday. This keeps your streak alive!
2. **Build as You Go**: Don't just watch videos. Code along and make small modifications to test your understanding.
3. **Don't Get Stuck**: If you encounter an error, spend 15 minutes debugging, then ask for help or search online. Don't let it halt your progress.
4. **Current Status**: You are currently at **${completionPct}%** progress on your track. Let's aim to complete the next module this week!`;
      } else {
        responseText = `### 🚀 Study Advice for ${skill} Learners:
1. **Deep Dive**: Instead of just using libraries, try to understand *how* they work under the hood (e.g. React Fiber, V8 Engine event loops).
2. **Personal Projects**: Build something unique without following a tutorial step-by-step.
3. **Read Code**: Review open-source repositories to learn structure, patterns, and style.
4. **Keep Your Streak**: Your current streak is **${req.user.streak} days**. Keep learning daily to build momentum!`;
      }
    } 
    else {
      responseText = `Hey **${userName}** 👋! I'm your AI Learning Assistant. 

I'm tracking your **${goal}** path, where you've completed **${completionPct}%** of the curriculum.

Here is what you can ask me:
1. 🎯 *“What should I learn next?”*
2. 📘 *“Explain React”* (or JavaScript, Python, MongoDB, Node)
3. 💡 *“Give me study advice”*
4. 🧠 *“Give study tips for ${skill}s”*

How can I help you accelerate your learning today?`;
    }

    res.json({
      success: true,
      reply: responseText,
      sender: 'assistant'
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Server error in chatbot helper' });
  }
});

module.exports = router;
