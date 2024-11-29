// exports.getHomePage = (req, res) => {
//   res.render("home");
// };

// // EMI Calculator
// exports.getEMICalculator = (req, res) => {
//   res.render("emi");
// };

// exports.calculateEMI = (req, res) => {
//   const { principal, rate, tenure } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const emi =
//     (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
//     (Math.pow(1 + monthlyRate, tenure) - 1);
//   res.render("emi", { result: emi.toFixed(2) });
// };

// // GST Calculator
// exports.getGSTCalculator = (req, res) => {
//   res.render("gst");
// };

// exports.calculateGST = (req, res) => {
//   const { amount, gstRate } = req.body;
//   const gst = (amount * gstRate) / 100;
//   res.render("gst", { result: gst.toFixed(2) });
// };

// // SIP Calculator
// exports.getSIPCalculator = (req, res) => {
//   res.render("sip");
// };

// exports.calculateSIP = (req, res) => {
//   const { investment, rate, months } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const futureValue =
//     investment *
//     ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
//     (1 + monthlyRate);
//   res.render("sip", { result: futureValue.toFixed(2) });
// };
// // Home Loan Logic
// exports.getHomeLoanPage = (req, res) => {
//   res.render("homeloan");
// };

// exports.calculateHomeLoan = (req, res) => {
//   const { principal, rate, tenure } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const emi =
//     (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
//     (Math.pow(1 + monthlyRate, tenure) - 1);
//   res.render("homeloan", { result: emi.toFixed(2) });
// };

// // Car Loan Logic
// exports.getCarLoanPage = (req, res) => {
//   res.render("carloan");
// };

// exports.calculateCarLoan = (req, res) => {
//   const { principal, rate, tenure } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const emi =
//     (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
//     (Math.pow(1 + monthlyRate, tenure) - 1);
//   res.render("carloan", { result: emi.toFixed(2) });
// };

// // Personal Loan Logic
// exports.getPersonalLoanPage = (req, res) => {
//   res.render("personalloan");
// };

// exports.calculatePersonalLoan = (req, res) => {
//   const { principal, rate, tenure } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const emi =
//     (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
//     (Math.pow(1 + monthlyRate, tenure) - 1);
//   res.render("personalloan", { result: emi.toFixed(2) });
// };

// exports.calculatePPF = (req, res) => {
//   const { annualDeposit, rate, tenure } = req.body;
//   const r = rate / 100;
//   const n = tenure; // Number of years

//   // PPF Formula
//   const maturityAmount =
//     annualDeposit * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

//   res.render("ppf", { result: maturityAmount.toFixed(2) });
// };

// exports.calculateRD = (req, res) => {
//   const { monthlyInstallment, rate, tenure } = req.body;
//   const r = rate / (12 * 100); // Monthly interest rate
//   const n = tenure; // Number of months

//   // RD Formula
//   const maturityAmount =
//     monthlyInstallment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

//   res.render("rd", { result: maturityAmount.toFixed(2) });
// };

// exports.calculateFD = (req, res) => {
//   const { principal, rate, tenure } = req.body;
//   const r = rate / 100; // Annual interest rate
//   const n = tenure; // Number of years

//   // FD Formula
//   const maturityAmount = principal * Math.pow(1 + r, n);

//   res.render("fd", { result: maturityAmount.toFixed(2) });
// };
// Helper function to calculate EMI
// Helper function to calculate EMI
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
};

// Home Page
exports.getHomePage = (req, res) => {
  res.render("home");
};

// EMI Calculator
exports.getEMICalculator = (req, res) => {
  res.render("emi");
};

exports.calculateEMI = (req, res) => {
  const { principal, rate, tenure } = req.body;
  const emi = calculateEMI(principal, rate, tenure);
  res.render("emi", { result: emi.toFixed(2) });
};

// GST Calculator
exports.getGSTCalculator = (req, res) => {
  res.render("gst");
};

exports.calculateGST = (req, res) => {
  const { amount, gstRate } = req.body;
  const gst = (amount * gstRate) / 100;
  res.render("gst", { result: gst.toFixed(2) });
};

// // SIP Calculator
// exports.getSIPCalculator = (req, res) => {
//   res.render("sip");
// };

// exports.calculateSIP = (req, res) => {
//   const { investment, rate, months } = req.body;
//   const monthlyRate = rate / (12 * 100);
//   const futureValue =
//     investment *
//     ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
//     (1 + monthlyRate);
//   res.render("sip", { result: futureValue.toFixed(2) });
// };

// SIP Calculator - Render the SIP form on initial load
// exports.getSIPCalculator = (req, res) => {
//   res.render("sip", { investment: 0, rate: 0, months: 0, result: null });
// };

// Calculate SIP - Handle form submission and calculation
// exports.calculateSIP = (req, res) => {
//   const { investment, rate, months } = req.body;

//   // Ensure that investment, rate, and months are numbers
//   const investmentAmount = parseFloat(investment);
//   const rateAmount = parseFloat(rate);
//   const monthsAmount = parseInt(months);

//   if (isNaN(investmentAmount) || isNaN(rateAmount) || isNaN(monthsAmount)) {
//     return res.render("sip", { error: "Invalid input data", result: null });
//   }

//   const monthlyRate = rateAmount / (12 * 100); // Convert annual rate to monthly rate
//   const futureValue =
//     investmentAmount *
//     ((Math.pow(1 + monthlyRate, monthsAmount) - 1) / monthlyRate) *
//     (1 + monthlyRate);

//   // Render the result back to the view
//   res.render("sip", {
//     investment: investmentAmount,
//     rate: rateAmount,
//     months: monthsAmount,
//     result: futureValue.toFixed(2),
//   });
// };

// SIP Calculator - Render the SIP form on initial load
exports.getSIPCalculator = (req, res) => {
  res.render("sip", {
    investment: "",
    rate: "",
    months: "",
    result: null,
    error: null,
  });
};

// Calculate SIP - Handle form submission and calculation
exports.calculateSIP = (req, res) => {
  const { investment, rate, months } = req.body;

  // Ensure that investment, rate, and months are numbers
  const investmentAmount = parseFloat(investment);
  const rateAmount = parseFloat(rate);
  const monthsAmount = parseInt(months);

  if (isNaN(investmentAmount) || isNaN(rateAmount) || isNaN(monthsAmount)) {
    return res.render("sip", {
      investment,
      rate,
      months,
      result: null,
      error: "Please enter valid numbers for all fields.",
    });
  }

  if (investmentAmount <= 0 || rateAmount <= 0 || monthsAmount <= 0) {
    return res.render("sip", {
      investment,
      rate,
      months,
      result: null,
      error: "All inputs must be greater than zero.",
    });
  }

  const monthlyRate = rateAmount / (12 * 100); // Convert annual rate to monthly rate
  const futureValue =
    investmentAmount *
    ((Math.pow(1 + monthlyRate, monthsAmount) - 1) / monthlyRate) *
    (1 + monthlyRate);

  // Render the result back to the view
  res.render("sip", {
    investment,
    rate,
    months,
    result: futureValue.toFixed(2),
    error: null,
  });
};

// Home Loan Logic
exports.getHomeLoanPage = (req, res) => {
  res.render("homeloan");
};

exports.calculateHomeLoan = (req, res) => {
  const { principal, rate, tenure } = req.body;
  const emi = calculateEMI(principal, rate, tenure);
  res.render("homeloan", { result: emi.toFixed(2) });
};

// Car Loan Logic
exports.getCarLoanPage = (req, res) => {
  res.render("carloan");
};

exports.calculateCarLoan = (req, res) => {
  const { principal, rate, tenure } = req.body;
  const emi = calculateEMI(principal, rate, tenure);
  res.render("carloan", { result: emi.toFixed(2) });
};

// Personal Loan Logic
exports.getPersonalLoanPage = (req, res) => {
  res.render("personalloan");
};

exports.calculatePersonalLoan = (req, res) => {
  const { principal, rate, tenure } = req.body;
  const emi = calculateEMI(principal, rate, tenure);
  res.render("personalloan", { result: emi.toFixed(2) });
};

// PPF Calculator
exports.calculatePPF = (req, res) => {
  const { annualDeposit, rate, tenure } = req.body;
  const r = rate / 100;
  const n = tenure; // Number of years

  // PPF Formula
  const maturityAmount =
    annualDeposit * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  res.render("ppf", { result: maturityAmount.toFixed(2) });
};

// RD Calculator
exports.calculateRD = (req, res) => {
  const { monthlyInstallment, rate, tenure } = req.body;
  const r = rate / (12 * 100); // Monthly interest rate
  const n = tenure; // Number of months

  // RD Formula
  const maturityAmount =
    monthlyInstallment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  res.render("rd", { result: maturityAmount.toFixed(2) });
};

// FD Calculator
exports.calculateFD = (req, res) => {
  const { principal, rate, tenure } = req.body;
  const r = rate / 100; // Annual interest rate
  const n = tenure; // Number of years

  // FD Formula
  const maturityAmount = principal * Math.pow(1 + r, n);

  res.render("fd", { result: maturityAmount.toFixed(2) });
};

// Income Tax Logic
exports.getIncomeTaxPage = (req, res) => {
  res.render("incometax");
};

exports.calculateIncomeTax = (req, res) => {
  const { income, age } = req.body;
  console.log("income", income);
  console.log("age", age);
  let tax = 0;

  if (age < 60) {
    if (income <= 250000) {
      tax = 0;
    } else if (income <= 500000) {
      tax = (income - 250000) * 0.05;
    } else if (income <= 1000000) {
      tax = (income - 500000) * 0.1 + 12500;
    } else {
      tax = (income - 1000000) * 0.2 + 12500 + 50000;
    }
  } else if (age >= 60 && age < 80) {
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 1000000) {
      tax = (income - 600000) * 0.1 + 15000;
    } else {
      tax = (income - 1000000) * 0.2 + 15000 + 40000;
    }
  } else if (age >= 80) {
    if (income <= 500000) {
      tax = 0;
    } else if (income <= 1000000) {
      tax = (income - 500000) * 0.05;
    } else {
      tax = (income - 1000000) * 0.1 + 25000;
    }
  }

  res.render("incometax", { result: tax.toFixed(2) });
};

// HRA Calculation Logic
exports.getHRAPage = (req, res) => {
  res.render("hra");
};

exports.calculateHRA = (req, res) => {
  const { basicSalary, hraReceived, rentPaid, cityRent, salary, cityType } =
    req.body;
  console.log("basicSal", basicSalary);
  console.log("hraReceived", hraReceived);
  console.log("rentPaid", rentPaid);
  console.log("cityRent", cityRent);
  console.log("salary", salary);
  console.log("cityType", cityType);

  // Validate inputs
  if (
    !basicSalary ||
    !hraReceived ||
    !rentPaid ||
    !salary ||
    !cityRent ||
    !cityType
  ) {
    return res.render("hra", {
      error: "Please provide all the required fields.",
    });
  }

  // Parse the inputs as numbers
  const basic = parseFloat(basicSalary);
  const hra = parseFloat(hraReceived);
  const rent = parseFloat(rentPaid);
  const salaryAmount = parseFloat(salary);
  const city = parseFloat(cityRent);

  // Check if any parsed value is NaN
  if (
    isNaN(basic) ||
    isNaN(hra) ||
    isNaN(rent) ||
    isNaN(salaryAmount) ||
    isNaN(city)
  ) {
    return res.render("hra", { error: "Please enter valid numeric values." });
  }

  // Calculate HRA exemption based on city type
  let hraExempt;
  if (cityType === "metro") {
    hraExempt = Math.min(
      hra,
      0.1 * salaryAmount,
      rent - 0.1 * salaryAmount,
      0.5 * salaryAmount
    );
  } else {
    // Non-Metro
    hraExempt = Math.min(
      hra,
      0.1 * salaryAmount,
      rent - 0.1 * salaryAmount,
      0.4 * salaryAmount
    );
  }

  // Return result
  res.render("hra", { result: hraExempt.toFixed(2) });
};
