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
  });
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

// // Route to scrape data from Zillow using Apify API
// router.get("/scrape", async (req, res) => {
//   const { address, city, state } = req.query; // Extract query parameters

//   // Validate input parameters
//   if (!address || !city || !state) {
//     return res
//       .status(400)
//       .send("Please provide valid address, city, and state parameters.");
//   }

//   // Construct Apify API URL
//   const zillowApiUrl = `https://api.apify.com/v2/actor-runs/Qy8Lw0XRqDAeho8wI?token=apify_api_R5KycvFaEIifzkkLlDG8UADpznWgCH0St44S`;

//   try {
//     // Pass dynamic input to Apify API
//     const inputPayload = {
//       address,
//       city,
//       state,
//     };

//     // Trigger the Apify actor with the provided input
//     const runResponse = await axios.post(zillowApiUrl, inputPayload);
//     const { data } = runResponse;

//     // Check if the run started successfully
//     if (!data || !data.data || !data.data.id) {
//       return res.status(500).send("Failed to start Apify actor run.");
//     }

//     const runId = data.data.id;

//     // Construct URL to fetch actor output
//     const outputUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=apify_api_R5KycvFaEIifzkkLlDG8UADpznWgCH0St44S`;

//     // Fetch the actor output
//     let outputResponse;
//     let retryCount = 0;

//     // Retry mechanism to wait for data to be ready
//     while (retryCount < 10) {
//       outputResponse = await axios.get(outputUrl);
//       if (outputResponse.data && outputResponse.data.length > 0) {
//         break;
//       }
//       retryCount++;
//       await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
//     }

//     if (
//       !outputResponse ||
//       !outputResponse.data ||
//       outputResponse.data.length === 0
//     ) {
//       return res
//         .status(500)
//         .send("Actor output not available. Please try again later.");
//     }

//     // Extract desired data
//     const outputData = outputResponse.data[0]; // Assuming the first item contains the needed data
//     const price = outputData.price || "Price not available";
//     const homeDetails = outputData.address || "Address not found";

//     // Respond with the scraped data
//     res.json({
//       address: homeDetails,
//       price: price,
//     });
//   } catch (error) {
//     console.error("Error scraping Zillow:", error.message);
//     res.status(500).send("Error scraping Zillow.");
//   }
// });

// router.get('/scrape', async (req, res) => {
//   const { address, city, state } = req.query;

//   if (!address || !city || !state) {
//     return res
//       .status(400)
//       .send('Please provide valid address, city, and state parameters.');
//   }

//   const zillowApiUrl = `https://api.apify.com/v2/actor-runs/Qy8Lw0XRqDAeho8wI?token=apify_api_R5KycvFaEIifzkkLlDG8UADpznWgCH0St44S`;

//   try {
//     const inputPayload = {
//       address,
//       city,
//       state,
//     };

//     const runResponse = await axios.post(zillowApiUrl, inputPayload);
//     const { data } = runResponse;

//     if (!data || !data.data || !data.data.id) {
//       return res.status(500).send('Failed to start Apify actor run.');
//     }

//     const runId = data.data.id;
//     const outputUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=apify_api_R5KycvFaEIifzkkLlDG8UADpznWgCH0St44S`;

//     let outputResponse;
//     let retryCount = 0;

//     while (retryCount < 10) {
//       outputResponse = await axios.get(outputUrl);
//       if (outputResponse.data && outputResponse.data.length > 0) {
//         break;
//       }
//       retryCount++;
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//     }

//     if (!outputResponse || !outputResponse.data || outputResponse.data.length === 0) {
//       return res
//         .status(500)
//         .send('Actor output not available. Please try again later.');
//     }

//     const outputData = outputResponse.data[0];
//     const price = outputData.price || 'Price not available';
//     const homeDetails = outputData.address || 'Address not found';

//     res.json({
//       address: homeDetails,
//       price: price,
//     });
//   } catch (error) {
//     console.error('Error scraping Zillow:', error.message);
//     res.status(500).send('Error scraping Zillow.');
//   }
// });

// // Create a new route to display the scraped data
// router.get('/display-data', async (req, res) => {
//   const address = req.query.address;
//   const city = req.query.city;
//   const state = req.query.state;

//   if (!address || !city || !state) {
//     return res
//       .status(400)
//       .send('Please provide valid address, city, and state parameters.');
//   }

//   try {
//     const response = await axios.get(`/scrape?address=${address}&city=${city}&state=${state}`);
//     const data = response.data;

//     res.render('display-data', {
//       address: data.address,
//       price: data.price,
//     });
//   } catch (error) {
//     console.error('Error displaying scraped data:', error.message);
//     res.status(500).send('Error displaying scraped data.');
//   }
// });

// // Create a new route to handle the form submission
// router.post('/submit-form', async (req, res) => {
//   const address = req.body.address;
//   const city = req.body.city;
//   const state = req.body.state;

//   res.redirect(`/display-data?address=${address}&city=${city}&state=${state}`);
// });

module.exports = router;
