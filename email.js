const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();

// Define the MongoDB collection and database
const databaseName = "EmailAll";
const collectionName = "resumes";

// Function to fetch recommended jobs based on skills
async function fetchRecommendedJobs(skills) {
  // Example job profiles with titles and required skills
  const jobProfiles = [
    {
      title: "Software Engineer",
      requiredSkills: ["JavaScript", "Node.js", "React"]
    },
    {
      title: "Data Scientist",
      requiredSkills: ["Python", "Machine Learning", "Statistics"]
    },
    {
      title: "Data Analyst",
      requiredSkills: ["SQL", "Data Visualization", "Excel"]
    },
    {
      title: "Backend Developer",
      requiredSkills: ["Java", "Spring Boot", "MySQL"]
    },
    {
      title: "Frontend Developer",
      requiredSkills: ["HTML", "CSS", "JavaScript", "Angular"]
    }
    // Add more job profiles as needed
  ];

  // Filter job profiles based on matching skills
  const matchedJobs = jobProfiles.filter(job => {
    // Check if the job requires any of the skills
    return job.requiredSkills.some(skill => skills.includes(skill));
  });

  // Return only the titles of matched jobs
  return matchedJobs.map(job => job.title);
}

// Route to handle resume data
app.post('/api/resume', async (req, res) => {
  const resumeData = req.body;
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  try {
    await collection.insertOne(resumeData);
    const analysisResult = await analyzeResume(resumeData);

    res.json({
      message: "Resume saved successfully!",
      analysisResult: analysisResult // Ensure this includes the analyzed data
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Function to analyze resume
async function analyzeResume(resumeData) {
  // Mock implementation for demonstration
  const skills = resumeData.skills || [];
  const recommendedJobs = await fetchRecommendedJobs(skills);

  return {
    skills: skills,
    recommendedJobs: recommendedJobs
  };
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
