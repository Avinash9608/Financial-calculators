const express = require("express");
const router = express.Router();
const calculatorController = require("../controllers/calculatorController");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const FinanceRecord = require("../models/FinanceRecord");
const EnquiryForm = require("../models/EnquiryForm");
const contactingform = require("../models/contactingform");
const Record = require("../models/Record");
const Subscribe = require("../models/subscribe");
const authRoutes = require("./auth.routes");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
// Home route
router.get("/", calculatorController.getHomePage);

// EMI Calculator
router.get("/emi", calculatorController.getEMICalculator);
router.post("/emi", calculatorController.calculateEMI);

// GST Calculator
router.get("/gst", calculatorController.getGSTCalculator);
router.post("/gst", calculatorController.calculateGST);

// SIP Calculator
router.get("/sip", calculatorController.getSIPCalculator);
router.post("/sip", calculatorController.calculateSIP);

// Car Loan Calculator
router.get("/carloan", calculatorController.getCarLoanPage);
router.post("/carloan", calculatorController.calculateCarLoan);

// Home Loan Calculator
router.get("/homeloan", calculatorController.getHomeLoanPage);
router.post("/homeloan", calculatorController.calculateHomeLoan);

// Personal Loan Calculator
router.get("/personalloan", calculatorController.getPersonalLoanPage);
router.post("/personalloan", calculatorController.calculatePersonalLoan);

// PPF Calculator
router.get("/ppf", (req, res) => res.render("ppf"));
router.post("/ppf", calculatorController.calculatePPF);

// RD Calculator
router.get("/rd", (req, res) => res.render("rd"));
router.post("/rd", calculatorController.calculateRD);

// FD Calculator
router.get("/fd", (req, res) => res.render("fd"));
router.post("/fd", calculatorController.calculateFD);

// Income Tax Calculator
router.get("/incometax", calculatorController.getIncomeTaxPage);
router.post("/incometax", calculatorController.calculateIncomeTax);

// HRA Calculator
router.get("/hra", calculatorController.getHRAPage);
router.post("/hra", calculatorController.calculateHRA);

// router.get("/realEstate", (req, res) => {
//   const properties = [
//     {
//       id: 1,
//       title: "Luxury Villa",
//       location: "Beverly Hills",
//       price: "12,000,000",
//       image:
//         "https://th.bing.com/th/id/OIP.0iDclZaB1rPeNjmC-hpg7wHaEj?rs=1&pid=ImgDetMain",
//     },
//     {
//       id: 2,
//       title: "Modern Apartment",
//       location: "New York City",
//       price: "3,500,000",
//       image:
//         "https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg",
//     },
//     {
//       id: 3,
//       title: "Beach House",
//       location: "Miami",
//       price: "5,200,000",
//       image:
//         "https://th.bing.com/th/id/OIP.qrY8gTHEp3dJAetVYB5P_QHaE_?rs=1&pid=ImgDetMain",
//     },
//   ];

//   const locationQuery = req.query.location;
//   const filteredProperties = locationQuery
//     ? properties.filter((property) =>
//         property.location.toLowerCase().includes(locationQuery.toLowerCase())
//       )
//     : properties;

//   res.render("realEstate", { properties: filteredProperties });
// });
router.get("/realEstate", (req, res) => {
  const user = req.session.user;
  const properties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Beverly Hills",
      price: "12,000,000",
      type: "Villa",
      bedrooms: 5,
      bathrooms: 4,
      area: "5,000 sq ft",
      image:
        "https://th.bing.com/th/id/OIP.0iDclZaB1rPeNjmC-hpg7wHaEj?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "New York City",
      price: "3,500,000",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: "1,200 sq ft",
      image:
        "https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg",
    },
    {
      id: 3,
      title: "Beach House",
      location: "Miami",
      price: "5,200,000",
      type: "Beach House",
      bedrooms: 3,
      bathrooms: 3,
      area: "3,500 sq ft",
      image:
        "https://th.bing.com/th/id/OIP.qrY8gTHEp3dJAetVYB5P_QHaE_?rs=1&pid=ImgDetMain",
    },
  ];

  // Define services
  const services = [
    {
      title: "Property Valuation",
      icon: "fas fa-chart-line",
      description: "Expert property valuation and market analysis",
    },
    {
      title: "Home Loans",
      icon: "fas fa-home",
      description: "Helping you find the best home loan options",
    },
    {
      title: "Property Management",
      icon: "fas fa-building",
      description: "Comprehensive property management services",
    },
    {
      title: "Real Estate Investment",
      icon: "fas fa-money-bill-wave",
      description: "Strategic investment opportunities and advice",
    },
    {
      title: "Legal Assistance",
      icon: "fas fa-balance-scale",
      description: "Legal support for property transactions",
    },
    {
      title: "Property Listing",
      icon: "fas fa-list-alt",
      description: "Extensive property listing services",
    },
  ];

  // Extract query parameters
  const { location, minPrice, maxPrice, type, bedrooms } = req.query;

  // Apply filters
  let filteredProperties = properties.filter((property) => {
    // Location filter (case-insensitive)
    const locationMatch =
      !location ||
      property.location.toLowerCase().includes(location.toLowerCase());

    // Price range filter
    const priceMatch =
      (!minPrice ||
        parseInt(property.price.replace(/,/g, "")) >= parseInt(minPrice)) &&
      (!maxPrice ||
        parseInt(property.price.replace(/,/g, "")) <= parseInt(maxPrice));

    // Type filter
    const typeMatch =
      !type || property.type.toLowerCase() === type.toLowerCase();

    // Bedrooms filter
    const bedroomsMatch = !bedrooms || property.bedrooms === parseInt(bedrooms);

    return locationMatch && priceMatch && typeMatch && bedroomsMatch;
  });

  // Sort properties (optional)
  const sortBy = req.query.sortBy;
  if (sortBy === "price_asc") {
    filteredProperties.sort(
      (a, b) =>
        parseInt(a.price.replace(/,/g, "")) -
        parseInt(b.price.replace(/,/g, ""))
    );
  } else if (sortBy === "price_desc") {
    filteredProperties.sort(
      (a, b) =>
        parseInt(b.price.replace(/,/g, "")) -
        parseInt(a.price.replace(/,/g, ""))
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  // Prepare pagination info
  const paginationInfo = {
    currentPage: page,
    totalProperties: filteredProperties.length,
    totalPages: Math.ceil(filteredProperties.length / limit),
    hasNextPage: endIndex < filteredProperties.length,
    hasPrevPage: startIndex > 0,
  };

  // Render the page with filtered and paginated properties
  res.render("realEstate", {
    properties: paginatedProperties,
    services: services, // Added services here
    pagination: paginationInfo,
    query: req.query,
    user: user,
  });
});

router.get("/insurance", (req, res) => res.render("insurance"));
router.get("/savingtools", (req, res) => res.render("savingtools"));
router.get("/campersiontools", (req, res) => res.render("campersiontools"));
// Route to generate the PDF
router.get("/download", async (req, res) => {
  try {
    const records = await FinanceRecord.find().sort({ date: -1 });

    if (records.length === 0) {
      return res.status(404).send("No records found");
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: "Finance Records Report",
        Author: "Finance App",
      },
    });

    const filePath = path.join(
      __dirname,
      "..",
      "src",
      "public",
      "finance_report.pdf"
    );
    const writeStream = fs.createWriteStream(filePath, { flags: "w" });

    doc.pipe(writeStream);

    // Add background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f4f4f9");
    doc.fillColor("#000000");

    // Header
    doc.fontSize(24).fillColor("#444444").text("Finance Records Report", {
      align: "center",
    });
    doc.moveDown();
    doc
      .fontSize(14)
      .fillColor("#666666")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, {
        align: "center",
      });
    doc.moveDown(2);

    // Table Headers
    const tableStartY = 150;
    const footerHeight = 50; // Height reserved for footer
    const maxY = doc.page.height - footerHeight; // Maximum Y position before footer starts
    doc.fontSize(12).fillColor("#333333");
    doc
      .text("Type", 50, tableStartY, { align: "left" })
      .text("Description", 150, tableStartY, { align: "left" })
      .text("Amount", 350, tableStartY, { align: "left" })
      .text("Date", 450, tableStartY, { align: "left" });
    doc
      .moveTo(50, tableStartY + 15)
      .lineTo(doc.page.width - 50, tableStartY + 15)
      .stroke("#aaaaaa");

    // Table Content
    let yPosition = tableStartY + 25;
    let rowsDrawn = 0;
    records.forEach((record) => {
      const formattedDate = new Date(record.date).toLocaleDateString();
      doc
        .fillColor("#000000")
        .text(record.type, 50, yPosition)
        .text(record.description || "N/A", 150, yPosition, { ellipsis: true })
        .text(`$${record.amount}`, 350, yPosition)
        .text(formattedDate, 450, yPosition);

      yPosition += 20;
      rowsDrawn++;

      // Stop drawing if footer space is reached
      if (yPosition > maxY) {
        doc
          .fontSize(10)
          .fillColor("red")
          .text("...Content truncated to fit page.", 50, maxY - 10);
        return; // Exit loop to ensure footer fits
      }
    });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, "finance_report.pdf", (err) => {
        if (err) {
          console.error("Error during file download:", err);
          return res.status(500).send("Error downloading file");
        }

        // Optional cleanup
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file:", unlinkErr);
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Fetch all finance records
router.get("/records", async (req, res) => {
  try {
    const records = await FinanceRecord.find().sort({ date: -1 });
    res.render("download", { records });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to insert a finance record
router.get("/add-record", (req, res) => res.render("add-record"));
router.post("/add-record", async (req, res) => {
  try {
    const { type, description, amount, date } = req.body; // Get data from form submission

    // Create and save a new finance record
    const newRecord = await FinanceRecord.create({
      type,
      description,
      amount,
      date,
    });

    res.redirect("/records"); // Redirect to the page displaying all records
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving record");
  }
});

// Example data for the charts
const financeData = [
  { month: "January", income: 5000, expense: 3000, savings: 2000 },
  { month: "February", income: 6000, expense: 3500, savings: 2500 },
  { month: "March", income: 4000, expense: 2500, savings: 1500 },
  { month: "April", income: 7000, expense: 4000, savings: 3000 },
  { month: "May", income: 6500, expense: 3500, savings: 2000 },
];

// Route to render datavisualization.ejs
router.get("/datavisualization", (req, res) => {
  res.render("datavisualization", { financeData });
});

// Render the enquiry form
router.get("/enquiry", (req, res) => {
  res.render("enquiry");
});

// Handle form submission for enquiry form
router.post("/enquiry", async (req, res) => {
  const { fullName, email, location, message } = req.body;

  try {
    // Validate input data
    if (!fullName || !email || !location || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Save the enquiry data to MongoDB
    const newEnquiry = new EnquiryForm({ fullName, email, location, message });
    await newEnquiry.save();

    // Create a transporter object using your email credentials
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service or replace with another email provider
      auth: {
        user: process.env.EMAIL_USER, // Admin email (your email)
        pass: process.env.EMAIL_PASS, // Email password or app password
      },
    });

    // Email content to send to the user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email (user's email)
      subject: "Thank you for your enquiry!",
      text: `Dear ${fullName},\n\nThank you for reaching out to us. We have received your enquiry with the following details:\n\nLocation: ${location}\nMessage: "${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nYour Company`,
    };

    // Email content to notify the admin (you)
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.EMAIL_USER, // Recipient email (admin email)
      subject: "New Enquiry Submission",
      html: `
        <h3>New Enquiry Details</h3>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `,
    };

    // Send email to the user
    await transporter.sendMail(mailOptionsToUser);

    // Send email to admin
    await transporter.sendMail(mailOptionsToAdmin);

    // Render the thank you page
    res.render("thankyouform");
  } catch (err) {
    console.error("Error processing your enquiry:", err);
    res.status(500).json({
      success: false,
      message: "Error processing your request. Please try again later.",
    });
  }
});

// Handle form submission for contacting form
router.post("/contactingform", async (req, res) => {
  const { email, message } = req.body;

  try {
    // Save the contact form data to MongoDB
    const newContact = new contactingform({ email, message });
    await newContact.save();

    // Create a transporter object using your email credentials
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service or replace with another email provider
      auth: {
        user: process.env.EMAIL_USER, // Admin email (your email)
        pass: process.env.EMAIL_PASS, // Email password or app password
      },
    });

    // Email content to send to the user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email (user's email)
      subject: "Thank you for contacting us!",
      text: `Dear ${email},\n\nThank you for reaching out to us. We have received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nYour Company`,
    };

    // Email content to notify the admin (you)
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.EMAIL_USER, // Recipient email (admin email)
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Form Details</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `,
    };

    // Send email to the user
    await transporter.sendMail(mailOptionsToUser);

    // Send email to admin
    await transporter.sendMail(mailOptionsToAdmin);

    // Send a JSON response indicating success
    // res.json({ success: true, message: "Thank you for contacting us!" });
    res.render("thankyouform");
  } catch (err) {
    console.error("Error processing your contact request:", err);
    res.status(500).json({
      success: false,
      message: "Error processing your request. Please try again later.",
    });
  }
});

// Route to handle form submission
router.get("/map", async (req, res) => {
  const location = req.body.location;

  // Fetch coordinates from Mapbox Geocoding API
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=pk.eyJ1IjoiYXZpbmFzaC05NjA4IiwiYSI6ImNtMm5qazF6NDA2a2EycXF6MW5zbjAwbnQifQ.oN9aV_oz5U13NkBPXb-TgQ`
  );
  const data = await response.json();

  // Check if we got a valid response
  if (data.features && data.features.length > 0) {
    const coordinates = data.features[0].geometry.coordinates;
    const lng = coordinates[0];
    const lat = coordinates[1];

    // Render the EJS map page with dynamic coordinates
    res.render("map", { lng, lat });
  } else {
    res.send("Location not found. Please try again.");
  }
});
// Render the form for adding data
router.get("/addData", (req, res) => {
  res.render("addData");
});

// Handle form submission and save data to the database
router.post("/addData", async (req, res) => {
  const { name, sales, category } = req.body;

  try {
    // Create a new record instance
    const newRecord = new Record({
      name,
      sales: parseInt(sales),
      category,
    });

    // Save the record to the database
    await newRecord.save();

    // Redirect to the homepage or records page
    res.redirect("/datavisualization");
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).send("Error saving record.");
  }
});

// API endpoint to get records
router.get("/records", async (req, res) => {
  try {
    const records = await db.collection("records").find().toArray();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// GET route for Thank You page
router.get("/thankyouform", (req, res) => {
  res.render("thankyouform");
});

// POST route for subscribing
router.post("/subscribe", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in first" });
  }
  const { email } = req.body;
  try {
    // Validate email input
    if (!email) {
      return res.status(400).send("Email is required.");
    }

    // Save the email to the database
    const newSubscription = new Subscribe({ email });
    await newSubscription.save();
    console.log(email);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail or another email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: "Subscription Confirmation",
      text: `Dear Subscriber,\n\nThank you for subscribing with the email: ${email}.\n\nWe appreciate your interest and will keep you updated with the latest news and updates.\n\nBest regards,\nYour Team`,
    };

    // Email content to notify the admin (you)
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.EMAIL_USER, // Recipient email (admin email)
      subject: "New Contact Form Submission",
      html: `
        <h3>Subscrib Form Details</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsAdmin);

    // Redirect to the Thank You page
    res.redirect("/thankyouform");
  } catch (error) {
    console.error("Error processing subscription:", error);

    // Handle duplicate email errors
    if (error.code === 11000) {
      return res.status(400).send("This email is already subscribed.");
    }

    res
      .status(500)
      .send("An error occurred while processing your subscription.");
  }
});

router.get("/login_register", (req, res) => res.render("login_register"));
// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  // Create a new user
  const user = new User({
    username,
    email,
    password,
  });

  try {
    await user.save();
    // res.status(201).json({
    //   message: "User registered successfully",
    // });
    req.session.user = {
      username: user.username,
      email: user.email,
    };
    res.redirect("/realEstate");
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store the user in the session
    req.session.user = {
      username: user.username,
      email: user.email,
    };

    // Option 1: Redirect to realEstate page
    res.redirect("/realEstate");

    // Option 2: Render realEstate page with user data
    // res.render("realEstate", { user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/housedetails", (req, res) => res.render("housedetails"));
module.exports = router;
