const express = require("express");
const router = express.Router();
const calculatorController = require("../controllers/calculatorController");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
require("dotenv").config();
// routes/financeRoutes.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const FinanceRecord = require("../models/FinanceRecord");
const EnquiryForm = require("../models/EnquiryForm");
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

router.get("/realEstate", (req, res) => {
  const properties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Beverly Hills",
      price: "12,000,000",
      image:
        "https://th.bing.com/th/id/OIP.0iDclZaB1rPeNjmC-hpg7wHaEj?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "New York City",
      price: "3,500,000",
      image:
        "https://cdn.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg",
    },
    {
      id: 3,
      title: "Beach House",
      location: "Miami",
      price: "5,200,000",
      image:
        "https://th.bing.com/th/id/OIP.qrY8gTHEp3dJAetVYB5P_QHaE_?rs=1&pid=ImgDetMain",
    },
  ];

  const locationQuery = req.query.location;
  const filteredProperties = locationQuery
    ? properties.filter((property) =>
        property.location.toLowerCase().includes(locationQuery.toLowerCase())
      )
    : properties;

  res.render("realEstate", { properties: filteredProperties });
});

router.get("/insurance", (req, res) => res.render("insurance"));
router.get("/savingtools", (req, res) => res.render("savingtools"));
router.get("/campersiontools", (req, res) => res.render("campersiontools"));
// Route to generate the PDF
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

    const filePath = path.join(__dirname, "..", "public", "finance_report.pdf");
    const writeStream = fs.createWriteStream(filePath);

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

    // Footer (stays on the same page as the table)
    // doc
    //   .moveTo(50, doc.page.height - 50)
    //   .lineTo(doc.page.width - 50, doc.page.height - 50)
    //   .stroke("#aaaaaa")
    //   .text("© 2024 Finance App", 50, doc.page.height - 40, { align: "left" })
    //   .text("Page 1 of 1", doc.page.width - 100, doc.page.height - 40, {
    //     align: "right",
    //   });
    // doc
    //   .fontSize(10)
    //   .fillColor("#666666")
    //   .text("© 2024 Finance App", 50, doc.page.height - 40, { align: "left" });
    // doc.text("Page 1 of 1", doc.page.width - 100, doc.page.height - 40, {
    //   align: "right",
    // });

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

// Handle form submission
router.post("/enquiry", async (req, res) => {
  const { fullName, email, location, message } = req.body;

  try {
    // Save data to MongoDB
    const newEnquiry = new EnquiryForm({ fullName, email, location, message });
    await newEnquiry.save();

    // Send Email with Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com", // Sender email
      to: "recipient-email@gmail.com", // Receiver email
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry Details</h3>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.render("thankyouform");
  } catch (err) {
    console.error("Error processing enquiry:", err);
    res.status(500).send("An error occurred while submitting your enquiry.");
  }
});

module.exports = router;
