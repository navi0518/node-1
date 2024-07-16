// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB connection URI
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/models', express.static(__dirname + '/models')); // Serve TensorFlow.js models statically

// // Connect to MongoDB
// (async () => {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1); // Exit the process if MongoDB connection fails
//     }
// })();

// // Route to handle email submission
// app.post('/api/email', async (req, res) => {
//     const { email } = req.body;

//     try {
//         // Access the database and collection
//         const database = client.db('EmailAll');
//         const collection = database.collection('emails');

//         // Insert email into collection
//         const result = await collection.insertOne({ email });

//         console.log('Email saved:', email);
//         res.json({ success: true, message: 'Email saved successfully' });
//     } catch (error) {
//         console.error('Error saving email:', error);
//         res.status(500).json({ success: false, message: 'Error saving email' });
//     }

//     console.log('Email saved:', email);
// });

// app.post('/api/resume-analysis', async (req, res) => {
//     try {
//         const { skills, certifications, experience } = req.body;

//         // Load TensorFlow.js model
//         const modelPath = './models/your_model/';
//         const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);

//         // Example preprocessing and prediction
//         const skillsEncoded = skills.split(',').length;
//         const certificationsEncoded = certifications ? 1 : 0;
//         const inputTensor = tf.tensor2d([[skillsEncoded, certificationsEncoded, experience]], [1, 3]);
//         const prediction = model.predict(inputTensor);
//         const predictedIndex = prediction.argMax(1).dataSync()[0];

//         // Example job roles corresponding to predicted indices
//         const roles = ['Data Scientist', 'Backend Developer', 'Frontend Developer', 'Software Engineer'];
//         const predictedRole = roles[predictedIndex];

//         res.json({ predictedRole });
//     } catch (error) {
//         console.error('Prediction error:', error);
//         res.status(500).json({ error: 'Prediction failed' });
//     }
// });

// // Start the server on PORT 3000
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// 2

// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB connection URI
// const mongoUrl = 'mongodb://localhost:27017';
// const databaseName = 'EmailAll'; // Replace with your database name

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200
// }));

// app.use(bodyParser.json());
// app.use('/models', express.static(__dirname + '/models')); // Serve TensorFlow.js models statically

// // Connect to MongoDB
// let client;

// async function connectToMongoDB() {
//     try {
//         client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1); // Exit the process if MongoDB connection fails
//     }
// }

// connectToMongoDB();

// // Configure Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "g9425347@gmail.com", // Your Gmail email address
//       pass: "lrfllfqitxajjvjb", // Your Gmail password or App Password
//     },
//   });

//   // Generate OTP
// function generateOTP() {
//     return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
// }

// // Route to handle email submission
// app.post('/api/email', async (req, res) => {
//     const { email } = req.body;
//     const otp = generateOTP();

//     try {
//         // Send OTP to the email
//         await transporter.sendMail({
//             from: 'g9425347@gmail.com',
//             to: email,
//             subject: 'Your OTP Code',
//             text: `Your OTP code is ${otp}`
//         });
//         // Access the database and collection
//         const database = client.db(databaseName);
//         const collection = database.collection('emails');

//         // Insert email into collection
//         const result = await collection.insertOne({ email });
//          // Insert email and OTP into collection
//          await collection.insertOne({ email, otp, createdAt: new Date() });

//         console.log('Email saved:', email,otp);

//         // Optionally, you can perform additional operations here

//         // Send success response to client
//         res.json({ success: true, message: 'OTP sent successfully' });
//     } catch (error) {
//         console.error('Error saving email:', error);
//         res.status(500).json({ success: false, message: 'Error saving email' });
//     }
// });
// // Route to handle OTP verification
// app.post('/api/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         // Access the database and collection
//         const database = client.db(databaseName);
//         const collection = database.collection('otp');

//         // Find the OTP entry
//         const otpEntry = await collection.findOne({ email, otp });

//         if (otpEntry) {
//             console.log('OTP verified:', email);

//             // Optionally, you can delete the OTP entry after verification
//             await collection.deleteOne({ email, otp });

//             // Send success response to client
//             res.json({ success: true, message: 'OTP verified successfully' });
//         } else {
//             res.status(400).json({ success: false, message: 'Invalid OTP' });
//         }
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).json({ success: false, message: 'Error verifying OTP' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB connection URI
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware
// app.use(cors({ origin: 'http://localhost:4200' })); // Adjust the origin to your Angular app's address
// app.use(bodyParser.json());

// // Connect to MongoDB
// (async () => {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit the process if MongoDB connection fails
//   }
// })();

// // Configure Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "g9425347@gmail.com", // Your Gmail email address
//       pass: "lrfllfqitxajjvjb", // Your Gmail password or App Password
//     },
//   });

// // Generate OTP
// function generateOTP() {
//   return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
// }

// // Route to handle email submission and OTP generation
// app.post('/api/email', async (req, res) => {
//   const { email } = req.body;
//   const otp = generateOTP();

//   try {
//     // Send OTP to the email
//     await transporter.sendMail({
//       from: 'g9425347@gmail.com',
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP code is ${otp}`,
//     });

//     // Access the database and collection
//     const database = client.db('EmailAll');
//     const collection = database.collection('emails');

//     // Insert email and OTP into collection
//     await collection.insertOne({ email, otp, createdAt: new Date() });

//     console.log('Email saved:', email, otp);
//     res.json({ success: true, message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
//   }
// });

// // Route to handle OTP verification
// app.post('/api/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Access the database and collection
//     const database = client.db('EmailAll');
//     const collection = database.collection('emails');

//     // Find the OTP entry
//     const otpEntry = await collection.findOne({ email, otp });

//     if (otpEntry) {
//       console.log('OTP verified:', email);

//       // Optionally, you can delete the OTP entry after verification
//       await collection.deleteOne({ email, otp });

//       res.json({ success: true, message: 'OTP verified successfully' });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ success: false, message: 'Error verifying OTP' });
//   }
// });

// // Start the server on PORT 3000
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const mongoUrl = "mongodb://localhost:27017";
const databaseName = "EmailAll"; // Replace with your database name

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Allow requests from Angular application port
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(bodyParser.json());
app.use("/models", express.static(__dirname + "/models")); // Serve TensorFlow.js models statically

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "g9425347@gmail.com", // Your Gmail email address
    pass: "lrfllfqitxajjvjb", // Your Gmail password or App Password
  },
});

// Connect to MongoDB
let client;

async function connectToMongoDB() {
  try {
    client = await MongoClient.connect(mongoUrl, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}

connectToMongoDB();

// Route to handle email submission and OTP generation
app.post("/api/email", async (req, res) => {
  const { email } = req.body;

  try {
    // Access the database and collection
    const database = client.db(databaseName);
    const collection = database.collection("emails");

    // Generate OTP (numeric only, 6 digits by default)
    const otp = otpGenerator.generate(6, {
      number: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Check if email already exists
    const emailDoc = await collection.findOne({ email });

    if (emailDoc) {
      // Update the OTP if email already exists
      await collection.updateOne({ email }, { $set: { otp } });
    } else {
      // Insert new document if email does not exist
      await collection.insertOne({ email, otp });
    }

    // Log the saved email and OTP
    console.log("Email saved:", email);
    console.log("Generated OTP:", otp);

    // Send OTP via email
    const mailOptions = {
      from: "g9425347@gmail.com", // Sender email address
      to: email, // Recipient email address
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to:", email);

    // Send success response to client
    res.json({
      success: true,
      message: "OTP sent to your email for verification",
    });
  } catch (error) {
    console.error("Error handling email submission:", error);
    res
      .status(500)
      .json({ success: false, message: "Error handling email submission" });
  }
});

// Route to verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  console.log("Verifying OTP:", email, otp); // Log the received data for debugging

  try {
    // Access the database and collection
    const database = client.db(databaseName);
    const collection = database.collection("emails");

    // Find the email document in the collection
    const emailDoc = await collection.findOne({ email });

    if (!emailDoc) {
      // If email not found, send error response
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    // Check if OTP matches
    if (emailDoc.otp === otp) {
      // OTP matches, send success response
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      // OTP does not match, send error response
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
