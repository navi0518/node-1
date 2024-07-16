const express = require('express');
const multer = require('multer');
const fs = require('fs');
const natural = require('natural');
const cors = require('cors'); // Import the cors package
const { MongoClient } = require('mongodb');

const app = express();
const port = 4004;

// Use CORS middleware
app.use(cors());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });
const mongoUrl = 'mongodb://localhost:27017';
const databaseName = 'resumeDB';
const collectionName = 'resumes';
let client;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, clientInstance) => {
  if (err) throw err;
  client = clientInstance;
  console.log('Connected to MongoDB');
});

// Route to fetch resume data
app.get('/api/resume', async (req, res) => {
  try {
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    const resumes = await collection.find({}).toArray();
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Route to upload and analyze resume
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const resumeText = await parseResume(filePath);
    const skills = await extractSkills(resumeText, skillKeywords); // Adjust 'skillKeywords' as needed
    const recommendedJobs = await analyzeJobFit(skills, jobProfiles); // Adjust 'jobProfiles' as needed

    res.json({
      message: 'Resume analyzed successfully',
      skills: skills,
      recommendedJobs: recommendedJobs
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Function to parse resume text
async function parseResume(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  return dataBuffer.toString();
}

// Function to extract skills using 'natural' package
async function extractSkills(resumeText, skillKeywords) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(resumeText);
  return tokens.filter(token => skillKeywords.includes(token));
}

// Placeholder function for job fit analysis
async function analyzeJobFit(skills, jobProfiles) {
  // Placeholder logic to analyze job fit based on skills
  const matchedJobs = jobProfiles.filter(job => {
    // Calculate how many required skills match with candidate's skills
    const matchedSkillsCount = job.requiredSkills.reduce((count, skill) => {
      if (skills.includes(skill)) {
        return count + 1;
      }
      return count;
    }, 0);

    // Calculate a matching score based on percentage of matched skills
    const matchPercentage = (matchedSkillsCount / job.requiredSkills.length) * 100;

    // Consider a job a match if at least 50% of required skills match
    return matchPercentage >= 50;
  });

  return matchedJobs.map(job => job.title);
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
