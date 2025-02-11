import express from 'express';
// import formidable from 'formidable';
import { createCustomer, listCustomers, readCustomer, removeCustomer, updateCustomer, verifyexistingrecord } from '../controllers/customers.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

router.post('/customer', ExpressFormidable(), createCustomer);
router.get('/customers', listCustomers);
router.get('/customers/:slug', readCustomer);
router.put('/customer/:id',ExpressFormidable(), updateCustomer);
router.delete('/customers/:id', removeCustomer);
router.post('/customers/verify', verifyexistingrecord)

export default router;










// import { useState, useEffect } from "react";
// import axios from 'axios';
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "../StyleCSS/Customer.css";
// import { postCustomer } from "../services/customerApi";

// function AddCustomer({
//   editingCustomer,
//   setVisible,
//   loadCustomers,
//   setEditingCustomers,
// }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [area, setArea] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [gstn, setGstn] = useState("");
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorFields, setErrorFields] = useState({}); 

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (editingCustomer) {
//       setName(editingCustomer.name);
//       setEmail(editingCustomer.email);
//       setArea(editingCustomer.area);
//       setPhone(editingCustomer.phone);
//       setAddress(editingCustomer.address);
//       setCity(editingCustomer.city);
//       setGstn(editingCustomer.gstn);
//       setStatus(editingCustomer.status);
//     } else {
//       resetForm();
//     }
//   }, [editingCustomer]);

//   const resetForm = () => {
//     setName("");
//     setEmail("");
//     setArea("");
//     setPhone("");
//     setAddress("");
//     setCity("");
//     setGstn("");
//     setStatus("");
//     setErrorFields({}); 
//   };


//   const handleCreateCustomer = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorFields({});
  
//     let newErrorFields = {};
  
//     try {
//       let customerData = {
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone ? String(phone).trim() : "",
//         area: area.trim(),
//         address: address.trim(),
//         city: city.trim(),
//         gstn: gstn.trim(),
//         status: status.trim(),
//       };  
//       const res = await postCustomer(customerData);
//       const { data } = res;
//         if (data?.errors) {
//         if (data.errors.email) {
//           newErrorFields.email = true;
//         }
//         if (data.errors.phone) {
//           newErrorFields.phone = true;
//         }
//         if (data.errors.gstn) {
//           newErrorFields.gstn = true;
//         }

//         setErrorFields(newErrorFields);
//         setLoading(false);
//         return;
//       } else if (data?.error) {
//         toast.error(data.error);
//         setLoading(false);
//         return;
//       } else {
//         toast.success(`${data.customer.name} is created successfully`);
//         loadCustomers();
//         setVisible(false);
//         setEditingCustomers(null);
//       }
//     } catch (err) {
//       console.error("Error saving customer:", err);
//       if (err.response && err.response.data) {
//         if (err.response.data.error) {
//           toast.error(err.response.data.error);
//         } else if (err.response.data.errors) {
//           Object.values(err.response.data.errors).forEach((msg) =>
//             toast.error(msg)
//           );
//         } else {
//           toast.error("Something went wrong! Please try again.");
//         }
//       } else {
//         toast.error("Failed to save customer! Check console for details.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleUpdateCustomer = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorFields({});    
//     try {
//       let customerData = {
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone ? String(phone).trim() : "",
//         area: area.trim(),
//         address: address.trim(),
//         city: city.trim(),
//         gstn: gstn.trim(),
//         status: status.trim(),
//       };
//       if (!editingCustomer || !editingCustomer._id) {
//         toast.error("No customer selected for update");
//         console.error("No customer selected for update");
//         setLoading(false);
//         return;
//       }  
//       console.log("Existing Customer Data:", editingCustomer);
//       console.log("New Customer Data:", customerData);
//       let updatedFields = {};
//       Object.keys(customerData).forEach((key) => {
//         if (String(customerData[key]) !== String(editingCustomer[key])) {
//           updatedFields[key] = customerData[key];
//         }
//       });  
//       console.log("Updating Fields:", updatedFields);
//       if (Object.keys(updatedFields).length === 0) {
//         toast.info("No changes detected.");
//         console.warn("No changes detected.");
//         setLoading(false);
//         return;
//       }  
//       console.log("Sending API Request...");
//       console.log("Making API Call to:", `https://os-management.onrender.com/api/customer/${editingCustomer._id}`);
//       console.log("Payload Sent:", updatedFields);
//       const res = await axios.put(
//         `https://os-management.onrender.com/api/customer/${editingCustomer._id}`,
//         updatedFields
//       ).catch((err) => {
//         console.error("API Request Failed:", err);
//         if (err.response) {
//           console.error("API Response Data:", err.response.data);
//           console.error("API Response Status:", err.response.status);
//         }
//         toast.error(err.response?.data?.error || "Something went wrong!");
//         setLoading(false);
//         return;
//       });
//       if (!res) {
//         console.warn("API request did not return a response.");
//         return;
//       }  
//       console.log("API Response:", res);  
//       const { data } = res;  
//       if (data?.errors) {
//         console.error("Validation Errors:", data.errors);
//         let newErrorFields = {};
//         if (data.errors.email) newErrorFields.email = true;
//         if (data.errors.phone) newErrorFields.phone = true;
//         if (data.errors.gstn) newErrorFields.gstn = true;  
//         setErrorFields(newErrorFields);
//         setLoading(false);
//         return;
//       } else if (data?.error) {
//         console.error("API Error:", data.error);
//         toast.error(data.error);
//         setLoading(false);
//         return;
//       }  
//       toast.success(`${data.customer.name} is updated successfully`);
//       console.log("Customer Updated Successfully:", data.customer);  
//       loadCustomers(); 
//       setVisible(false);
//       setEditingCustomers(null);  
//     } catch (err) {
//       console.error("Error updating customer:", err);
//       toast.error(err.response?.data?.error || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleCancel = () => {
//     resetForm();
//     setEditingCustomers(null);
//   };

//   return (
//     <div>
//       <form onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}>
//         <h3 className="form-heading">
//           {editingCustomer && editingCustomer._id
//             ? "Edit Customer"
//             : "Add Customer"}
//         </h3>
//         <div className="customer-form">
//           <label className="customer-form__label">
//             <span>
//               Customer Name: <span className="required-field">*</span>
//             </span>
//             <input
//               type="text"
//               name="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="customer-form__input"
//               required
//             />
//           </label>
//           <label className="customer-form__label">
//             <span>
//               Email: <span className="required-field">*</span>
//             </span>
//             <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`customer-form__input ${
//                 errorFields.email ? "error" : ""
//               }`} 
//               required
//             />
//             {errorFields.email && (
//               <span className="error-text">{errorFields.email}</span>
//             )}
//           </label>
//           <label className="customer-form__label">
//             <span>
//               Phone: <span className="required-field">*</span>
//             </span>
//             <input
//               type="tel"
//               name="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className={`customer-form__input ${
//                 errorFields.phone ? "error" : ""
//               }`} 
//               pattern="[0-9]{10}"
//               maxLength="10"
//               required
//             />
//             {errorFields.phone && (
//               <span className="error-text">{errorFields.phone}</span>
//             )}
//           </label>
//           <label className="customer-form__label">
//             Address:
//             <input
//               type="text"
//               name="address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="customer-form__input"
//             />
//           </label>
//           <label className="customer-form__label">
//             <span>
//               Area: <span className="required-field">*</span>
//             </span>
//             <input
//               type="text"
//               name="area"
//               value={area}
//               onChange={(e) => setArea(e.target.value)}
//               className="customer-form__input"
//               required
//             />
//           </label>
//           <label className="customer-form__label">
//             City:
//             <input
//               type="text"
//               name="city"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="customer-form__input"
//             />
//           </label>
//           <label className="customer-form__label">
//             <span>
//               Status: <span className="required-field">*</span>
//             </span>
//             <select
//               name="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="customer-form__input"
//               required
//             >
//               <option value=""></option>
//               <option value="active">active</option>
//               <option value="inactive">inactive</option>
//             </select>
//           </label>
//           <label className="customer-form__label">
//             <span>
//               GSTN:<span className="required-field"> *</span>
//             </span>
//             <input
//               type="text"
//               name="gstn"
//               value={gstn}
//               onChange={(e) => setGstn(e.target.value)}
//               className={`customer-form__input ${
//                 errorFields.gstn ? "error" : ""
//               }`} 
//               required
//               pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
//               maxLength="15"
//               title="Please enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"
//             />
//             {errorFields.gstn && (
//               <span className="error-text">{errorFields.gstn}</span>
//             )}
//           </label>
//         </div>
//         <div className="ButtonContainer1">
//           <button type="submit" className="StyledButton1">
//             {loading ? "Update" : editingCustomer ? "Update" : "Add"}
//           </button>
//           <button
//             type="button"
//             className="StyledButton11"
//             onClick={handleCancel}
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//       {loading && (
//         <div className="processing-modal">
//           <img
//             className="ProcessingIMG"
//             src="./ProcessingGig.gif"
//             alt="Processing"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default AddCustomer;