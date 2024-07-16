require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

(async () => {
  try {
    await client.connect();
    db = client.db("EmailAll");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "g9425347@gmail.com", // Your Gmail email address
    pass: "lrfllfqitxajjvjb", // Your Gmail password or App Password
  },
});

// POST endpoint for sending emails
app.post("/api/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: "g9425347@gmail.com", // Sender address (must be the same as auth.user)
    to: to, // Recipient's email address
    subject: subject, // Subject line
    text: body, // Plain text body
  };

  try {
    // Send email using Nodemailer transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.send("Email sent: " + info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Handle POST request to create a job
app.post("/api/jobs", async (req, res) => {
  const jobData = req.body;
  const collection = db.collection("jobs");

  try {
    const result = await collection.insertOne(jobData);
    res.json({
      message: "Job posted successfully!",
      job: { _id: result.insertedId, ...jobData },
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ error: "Failed to post job" });
  }
});

// Handle GET request to fetch all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const collection = db.collection("jobs");
    const jobs = await collection.find().toArray();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Handle GET request to fetch job by ID
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const collection = db.collection("jobs");
    const job = await collection.findOne({ _id: new ObjectID(jobId) });
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }
    res.send(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).send({ message: "Error fetching job details", error });
  }
});

// Generate job description using Hugging Face
app.post("/api/generate-description", async (req, res) => {
  const { jobTitle, skills } = req.body;
  const prompt = `Create a job description for a ${jobTitle} with skills: ${skills}`;

  try {
    console.log(
      `Generating job description for ${jobTitle} with skills: ${skills}`
    );

    // Log the API key to ensure it's being loaded correctly
    console.log('Hugging Face API Key:', process.env.HUGGING_FACE_API_KEY);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
      {
        inputs: prompt,
        options: {
          wait_for_model: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const description = response.data.generated_text.trim();
    res.json({ description });
  } catch (error) {
    console.error(
      "Error generating job description:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error generating job description" });
  }
});

// Match resumes based on job description
app.post("/api/match-resumes", async (req, res) => {
  const { jobDescription } = req.body;

  try {
    const resumes = await getResumesFromDatabase(); // Fetch resumes from your database
    const matchedResumes = resumes.filter((resume) => {
      return resume.skills.some((skill) => jobDescription.includes(skill));
    });
    res.json({ resumes: matchedResumes });
  } catch (error) {
    console.error("Error matching resumes:", error);
    res.status(500).json({ error: "Error matching resumes" });
  }
});

async function getResumesFromDatabase() {
  const collection = db.collection("resumes"); // Assuming your resumes are stored in a "resumes" collection
  return await collection.find().toArray();
}
// Handle POST request to apply for a job
app.post("/api/apply", async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    const jobsCollection = db.collection("jobs");
    const job = await jobsCollection.findOne({ _id: new ObjectID(jobId) });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found. Unable to apply." });
    }

    // Proceed with the application process
    const applicationsCollection = db.collection("applications");
    const application = {
      userId,
      jobId,
      appliedAt: new Date(),
    };

    await applicationsCollection.insertOne(application);
    res.status(200).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Failed to apply for job" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
