// import Customer from "../models/customers.js";
// import dotenv from "dotenv";
// import slugify from "slugify";

// dotenv.config();


// export const createCustomer = async (req, res) => {
//   try {
//     const { name, email, phone, area, address, city, status, gstn } = req.fields;
//     console.log("Request Fields: ", req.fields);

//     // Validation
//     if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
//     if (!email?.trim()) return res.status(400).json({ error: "Email is required" });
//     if (!area?.trim()) return res.status(400).json({ error: "Area is required" });
//     if (!phone?.trim()) return res.status(400).json({ error: "Number is required" });
//     if (!address?.trim()) return res.status(400).json({ error: "Address is required" });
//     if (!city?.trim()) return res.status(400).json({ error: "City is required" });
//     if (!gstn?.trim()) return res.status(400).json({ error: "GSTN is required" });
//     if (!status?.trim()) return res.status(400).json({ error: "Status is required" });

//     let errors = {};
    
//     const existingEmail = await Customer.findOne({ email });
//     if (existingEmail) errors.email = "Email already exists.";
//     const existingPhone = await Customer.findOne({ phone });
//     if (existingPhone) errors.phone = "Phone number already exists.";
//     const existingGstn = await Customer.findOne({ gstn });
//     if (existingGstn) errors.gstn = "GSTN already exists.";

//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json({ errors });
//     }
//     const customer = new Customer({ ...req.fields, slug: slugify(name) });
//     await customer.save();
//     res.status(201).json({ message: "Customer added successfully!", customer });

//   } catch (err) {
//     console.error("Error creating customer:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const updateCustomer = async (req, res) => {
//   try {
//     console.log("Update Request Received:");
//     console.log("Customer ID: ", req.params.id);
//     console.log("New Data for Update: ", req.body); 

//     if (!req.params.id) {
//       return res.status(400).json({ error: "Customer ID is missing in request" });
//     }

//     const existingCustomer = await Customer.findOne({
//       $or: [{ email: req.body.email }, { phone: req.body.phone }, { gstn: req.body.gstn }],
//       _id: { $ne: req.params.id }
//     });

//     if (existingCustomer) {
//       return res.status(400).json({ error: "Email, Phone, or GSTN already exists for another customer" });
//     }

//     const customer = await Customer.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, slug: slugify(req.body.name) },
//       { new: true }
//     );

//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found or update failed" });
//     }

//     console.log("Updated Customer: ", customer);
//     res.status(200).json({ message: "Customer updated successfully", customer });

//   } catch (err) {
//     console.error("Error updating customer:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// export const listCustomers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const searchTerm = req.query.search ? req.query.search.trim() : "";
//     let searchQuery = {};
//     if (searchTerm) {
//       searchQuery = {
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { email: { $regex: searchTerm, $options: "i" } },
//         ],
//       };
//       if (!isNaN(searchTerm)) {
//         searchQuery.$or.push({ phone: searchTerm });
//       }
//     }
//     const sortField = req.query.sortField || "createdAt";
//     const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
//     const customers = await Customer.find(searchQuery)
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit);
//     const totalCustomers = await Customer.countDocuments(searchQuery);
//     res.status(200).json({
//       customers,
//       totalPages: Math.ceil(totalCustomers / limit),
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error("Error listing customers:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const readCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ slug: req.params.slug });
//     if (!customer) return res.status(404).json({ error: "Customer not found" });
//     res.status(200).json(customer);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };








// export const removeCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndDelete(req.params.id);
//     if (!customer) return res.status(404).json({ error: "Customer not found" });
//     res.status(200).json(customer);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const verifyexistingrecord = async (req, res) => {
//   try {
//     const { email, phone, gstn } = req.query;

//     const existingCustomer = await Customer.findOne({
//       $or: [{ email }, { phone }, { gstn }],
//     });
//     if (existingCustomer) {
//       if (existingCustomer.email === email) {
//         errors.email = "Email already exists.";
//       }
//       if (existingCustomer.phone === phone) {
//         errors.phone = "Phone number already exists.";
//       }
//       if (existingCustomer.gstn === gstn) {
//         errors.gstn = "GSTN already exists.";
//       }
//       return res.status(400).json({ errors });
//     }
//     res.status(200).json({ message: "No existing records found" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };











//OLD CODE
import Customer from "../models/customers.js";
import dotenv from "dotenv";
import slugify from "slugify";

dotenv.config();

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, area, address, city, status, gstn } =
      req.fields;
    console.log("Request Fields: ", req.fields);

    // Validation
    if (!name || !name.trim())return res.status(400).json({ error: "Name is required" });
    if (!email || !email.trim())return res.status(400).json({ error: "Email is required" });
    if (!area || !area.trim())return res.status(400).json({ error: "Area is required" });
    if (!phone || !phone.trim())return res.status(400).json({ error: "Number is required" });
    if (!address || !address.trim())return res.status(400).json({ error: "Address is required" });
    if (!city || !city.trim())return res.status(400).json({ error: "City is required" });
    if (!gstn || !gstn.trim())return res.status(400).json({ error: "GSTN is required" });
    if (!status || !status.trim())return res.status(400).json({ error: "Status is required" });

    // Create new customer
    const customer = new Customer({ ...req.fields, slug: slugify(name) });
    await customer.save();
    res.status(200).json(customer);
  } catch (err) {
    console.log("Error creating customer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateCustomer = async (req, res) => {
  try {
    //console.log("request :",req);

    if (!req.fields) {
      return res.status(400).json({ error: "Form data not found" });
    }
    const { name, email, phone, area, address, city, status, gstn } =
      req.fields;
    console.log("object :", req.fields);
    // Validation
    if (!name || !name.trim())
      return res.status(400).json({ error: "Name is required" });
    if (!email || !email.trim())
      return res.status(400).json({ error: "Email is required" });
    if (!area || !area.trim())
      return res.status(400).json({ error: "Area is required" });
    if (!phone || !phone.trim())
      return res.status(400).json({ error: "Number is required" });
    if (!address || !address.trim())
      return res.status(400).json({ error: "Address is required" });
    if (!city || !city.trim())
      return res.status(400).json({ error: "City is required" });
    if (!gstn || !gstn.trim())
      return res.status(400).json({ error: "GSTN is required" });
    if (!status || !status.trim())
      return res.status(400).json({ error: "Status is required" });

    const customer = await Customer.findByIdAndUpdate(
      req.params.id, // Changed to 'id'
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const listCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search ? req.query.search.trim() : "";
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
      if (!isNaN(searchTerm)) {
        searchQuery.$or.push({ phone: searchTerm });
      }
    }
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const customers = await Customer.find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalCustomers = await Customer.countDocuments(searchQuery);
    res.status(200).json({
      customers,
      totalPages: Math.ceil(totalCustomers / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error listing customers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const readCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ slug: req.params.slug });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const verifyexistingrecord = async (req, res) => {
  try {
    const { email, phone, gstn } = req.query;

    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }, { gstn }],
    });
    if (existingCustomer) {
      if (existingCustomer.email === email) {
        errors.email = "Email already exists.";
      }
      if (existingCustomer.phone === phone) {
        errors.phone = "Phone number already exists.";
      }
      if (existingCustomer.gstn === gstn) {
        errors.gstn = "GSTN already exists.";
      }
      return res.status(400).json({ errors });
    }
    res.status(200).json({ message: "No existing records found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
