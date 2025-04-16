const express = require("express");
const path = require("path");
const db = require("./db");
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files

// Route to handle user signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Query to check if email already exists
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Server error while checking email." });
    }

    if (result.length > 0) {
      // Email already exists
      console.log("Duplicate email found:", email);
      return res.status(200).json({ message: "⚠️ Email already exists. Please log in instead." });
    }

    // If email is not found, insert the new user
    const insertUserQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertUserQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error("Error inserting user into database:", err);
        return res.status(500).json({ message: "Signup failed, please try again." });
      }
      console.log("User signed up successfully:", result);
      res.status(200).json({ message: "✅ Signup successful!" });
    });
  });
});

// Route to handle user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Query to check the user's credentials
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error during login." });
    }

    if (results.length === 0) {
      // Invalid email or password
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log("User logged in:", email);
    res.status(200).json({ message: "✅ Login successful!" });
  });
});

// Route to handle order form submission
app.post("/order", (req, res) => {
  const { name, email, product, quantity, address } = req.body;

  // Insert order data into the database
  const insertOrderQuery = "INSERT INTO orders (name, email, product, quantity, address) VALUES (?, ?, ?, ?, ?)";
  db.query(insertOrderQuery, [name, email, product, quantity, address], (err, result) => {
    if (err) {
      console.error("Error inserting order into database:", err);
      return res.status(500).json({ message: "Order submission failed, please try again." });
    }

    console.log("Order submitted successfully:", result);
    res.json({ message: "Order submitted successfully! Product will be delivered within 14 days." });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
