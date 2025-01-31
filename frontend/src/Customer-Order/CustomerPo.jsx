
// import React, { useEffect, useState } from "react";
// import "./salesorder.css";
// import AddEditPo from "./AddEditPo";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../StyleCSS/Customer.css";
// import "../StyleCSS/SalesPurchase.css";
// import SalesItem from "../Customer-Order/SalesItemsTable"; 

// const SalesOrder = ({
//   editingCpo,
//   refreshData,
//   setVisible,
//   refreshCustomers,
//   loadSalesItemsForCPO,
//   onTotalPriceChange 
// }) => {
//   const [customern, setCustomer] = useState("");
//   const [customerpo, setCustomerpo] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("");
//   const [addClick, setAddClick] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [currentCpoId, setCurrentCpoId] = useState(
//     editingCpo ? editingCpo._id : ""
//   );

//   useEffect(() => {
//     if (editingCpo && editingCpo._id) {
//       setCustomer(editingCpo.customern?._id || "");
//       setCustomerpo(editingCpo.customerpo || "");
//       setDate(
//         editingCpo.date
//           ? new Date(editingCpo.date).toISOString().split("T")[0]
//           : ""
//       );
//       setStatus(editingCpo.status || "");
//       setCurrentCpoId(editingCpo._id);
//     } else {
//       setCustomer("");
//       setCustomerpo("");
//       setDate("");
//       setStatus("");
//     }
//   }, [editingCpo]);

//   const loadCustomer = async () => {
//     try {
//       const { data } = await axios.get("https://os-management.onrender.com/api/customers");
//       if (Array.isArray(data.customers)) {
//         setCustomers(data.customers);
//       } else {
//         setCustomers([]);
//       }
//     } catch (err) {
//       console.log(err);
//       setCustomers([]);
//     }
//   };

//   useEffect(() => {
//     loadCustomer();
//   }, []);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("customern", customern);
//   //     formData.append("customerpo", customerpo);
//   //     formData.append("date", date);
//   //     formData.append("status", status);

//   //     let response;
//   //     if (editingCpo && editingCpo._id) {
//   //       response = await axios.put(
//   //         `https://os-management.onrender.com/api/customerpos/${editingCpo._id}`,
//   //         formData,
//   //         {
//   //           headers: {
//   //             "Content-Type": "multipart/form-data",
//   //           },
//   //         }
//   //       );
//   //     } else {
//   //       response = await axios.post(
//   //         "https://os-management.onrender.com/api/customerpo",
//   //         formData,
//   //         {
//   //           headers: {
//   //             "Content-Type": "multipart/form-data",
//   //           },
//   //         }
//   //       );
//   //     }

//   //     toast.success("Customer PO saved successfully");
//   //     if (refreshData) refreshData();
//   //     if (refreshCustomers) refreshCustomers();
//   //     // setVisible(false);
//   //   } catch (err) {
//   //     if (err.response) {
//   //       console.error("Error update customer PO:", err.response.data);
//   //       toast.error(
//   //         `Failed to update customer PO: ${
//   //           err.response.data.error || "Unknown error"
//   //         }`
//   //       );
//   //     } else {
//   //       console.error("Error:", err.message);
//   //       toast.error("Failed to save customer PO: " + err.message);
//   //     }
//   //   }
//   // };

//   const handlePost = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("customern", customern);
//       formData.append("customerpo", customerpo);
//       formData.append("date", date);
//       formData.append("status", status);
  
//       const response = await axios.post(
//         "https://os-management.onrender.com/api/customerpo",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
  
//       toast.success("Customer PO saved successfully");
//       if (refreshData) refreshData();
//       if (refreshCustomers) refreshCustomers();
//     } catch (err) {
//       handleError(err);
//     }
//   };
  
//   const handlePut = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("customern", customern);
//       formData.append("customerpo", customerpo);
//       formData.append("date", date);
//       formData.append("status", status);
  
//       const response = await axios.put(
//         `https://os-management.onrender.com/api/customerpos/${editingCpo._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
  
//       toast.success("Customer PO updated successfully");
//       if (refreshData) refreshData();
//       if (refreshCustomers) refreshCustomers();
//     } catch (err) {
//       handleError(err);
//     }
//   };
  
//   const handleError = (err) => {
//     if (err.response) {
//       console.error("Error:", err.response.data);
//       toast.error(
//         `Failed to update customer PO: ${err.response.data.error || "Unknown error"}`
//       );
//     } else {
//       console.error("Error:", err.message);
//       toast.error("Failed to save customer PO: " + err.message);
//     }
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingCpo && editingCpo._id) {
//       handlePut(); 
//     } else {
//       handlePost(); 
//     }
//   };
  

//   const closeAddForm = () => {
//     setAddClick(false);
//   };



//   return (
//     <>
//       {addClick ? (
//         <AddEditPo
//           refreshData={loadSalesItemsForCPO}
//           currentCpoId={currentCpoId}
//           closeAddForm={closeAddForm}
          
//         />
//       ) : (
//         <>
//           <form onSubmit={handleSubmit}>
//             <div className="HEDING">
//               <h3 className="form-headings">
//                 {editingCpo ? "Edit" : "Add"} Customer PO
//               </h3>
//             </div>
//             <div>
//               <div className="ButtonContainer">
//                 <div className="labelinputfield">
//                   <label htmlFor="customern" className="lblCPO">
//                     Customer: <span className="required-field">*</span>
//                   </label>
//                   <select
//                     name="customern"
//                     value={customern}
//                     onChange={(e) => setCustomer(e.target.value)}
//                     className="customer-salesorder_input"
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map((customer) => (
//                       <option key={customer._id} value={customer._id}>
//                         {customer.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="labelinputfield">
//                   <label htmlFor="date" className="lblCPO">
//                     Date:<span className="required-field">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     id="date"
//                     value={date}
//                     onChange={(event) => setDate(event.target.value)}
//                     className="customer-salesorder_input1"
//                   />
//                 </div>
//               </div>
//               <div className="ButtonContainer">
//                 <div className="labelinputfield">
//                   <label htmlFor="customerpo" className="lblCPO">
//                     Customer PO:<span className="required-field">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="customerpo"
//                     value={customerpo}
//                     onChange={(e) => setCustomerpo(e.target.value)}
//                     className="customer-salesorder_input1"
//                   />
//                 </div>
//                 <div className="labelinputfield">
//                   <label htmlFor="status" className="lblCPO">
//                     Status:<span className="required-field">*</span>
//                   </label>
//                   <select
//                     id="status"
//                     value={status}
//                     onChange={(event) => setStatus(event.target.value)}
//                     className="customer-salesorder_input1"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <button type="button" onClick={() => setAddClick(true)} className="StyledBtn">
//               Add SalesItem
//             </button>

//             <SalesItem 
//               currentCpoId={currentCpoId} 
//               loadSalesItemsForCPO={loadSalesItemsForCPO} 
//             />

//             <div className="ButtonContainer">
//               <button type="submit" className="StyledButton1">
//                {editingCpo ? "Update" : "Save"}
//               </button>
//               <button type="button" className="StyledButton11">
//                 Clear
//               </button>
//             </div>
//           </form>
//         </>
//       )}
//     </>
//   );
// };

// export default SalesOrder;









import React, { useEffect, useState } from "react";
import "./salesorder.css";
import AddEditPo from "./AddEditPo";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";
import SalesItem from "../Customer-Order/SalesItemsTable"; 

const SalesOrder = ({
  editingCpo,
  refreshData,
  setVisible,
  refreshCustomers,
  loadSalesItemsForCPO,
  onTotalPriceChange 
}) => {
  const [customern, setCustomer] = useState("");
  const [customerpo, setCustomerpo] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [addClick, setAddClick] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [currentCpoId, setCurrentCpoId] = useState(
    editingCpo ? editingCpo._id : ""
  );
  const [isUpdateClicked, setIsUpdateClicked] = useState(false); // New state variable

  useEffect(() => {
    if (editingCpo && editingCpo._id) {
      setCustomer(editingCpo.customern?._id || "");
      setCustomerpo(editingCpo.customerpo || "");
      setDate(
        editingCpo.date
          ? new Date(editingCpo.date).toISOString().split("T")[0]
          : ""
      );
      setStatus(editingCpo.status || "");
      setCurrentCpoId(editingCpo._id);
    } else {
      setCustomer("");
      setCustomerpo("");
      setDate("");
      setStatus("");
    }
  }, [editingCpo]);

  const loadCustomer = async () => {
    try {
      const { data } = await axios.get("https://os-management.onrender.com/api/customers");
      if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.log(err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("customern", customern);
      formData.append("customerpo", customerpo);
      formData.append("date", date);
      formData.append("status", status);
  
      const response = await axios.post(
        "https://os-management.onrender.com/api/customerpo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success("Customer PO saved successfully");
      if (refreshData) refreshData();
      if (refreshCustomers) refreshCustomers();
      setVisible(false);
    } catch (err) {
      handleError(err);
    }
  };
  
  const handlePut = async () => {
    try {
      const formData = new FormData();
      formData.append("customern", customern);
      formData.append("customerpo", customerpo);
      formData.append("date", date);
      formData.append("status", status);
  
      const response = await axios.put(
        `https://os-management.onrender.com/api/customerpos/${editingCpo._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success("Customer PO updated successfully");
      if (refreshData) refreshData();
      if (refreshCustomers) refreshCustomers();
      setVisible(false);
    } catch (err) {
      handleError(err);
    }
  };
  
  const handleError = (err) => {
    if (err.response) {
      console.error("Error:", err.response.data);
      toast.error(
        `Failed to update customer PO: ${err.response.data.error || "Unknown error"}`
      );
    } else {
      console.error("Error:", err.message);
      toast.error("Failed to save customer PO: " + err.message);
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdateClicked) { // Check if update button was clicked
      if (editingCpo && editingCpo._id) {
        handlePut(); 
      } else {
        handlePost(); 
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key
    }
  };

  const closeAddForm = () => {
    setAddClick(false);
  };

  return (
    <>
      {addClick ? (
        <AddEditPo
          refreshData={loadSalesItemsForCPO}
          currentCpoId={currentCpoId}
          closeAddForm={closeAddForm}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="HEDING">
              <h3 className="form-headings">
                {editingCpo ? "Edit" : "Add"} Customer PO
              </h3>
            </div>
            <div>
              <div className="ButtonContainer">
                <div className="labelinputfield">
                  <label htmlFor="customern" className="lblCPO">
                    Customer: <span className="required-field">*</span>
                  </label>
                  <select
                    name="customern"
                    value={customern}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="customer-salesorder_input"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="labelinputfield">
                  <label htmlFor="date" className="lblCPO">
                    Date:<span className="required-field">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="customer-salesorder_input1"
                  />
                </div>
              </div>
              <div className="ButtonContainer">
                <div className="labelinputfield">
                  <label htmlFor="customerpo" className="lblCPO">
                    Customer PO:<span className="required-field">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerpo"
                    value={customerpo}
                    onChange={(e) => setCustomerpo(e.target.value)}
                    className="customer-salesorder_input1"
                  />
                </div>
                <div className="labelinputfield">
                  <label htmlFor="status" className="lblCPO">
                    Status:<span className="required-field">*</span>
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="customer-salesorder_input1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => { setAddClick(true); }} className="StyledBtn">
              Add SalesItem
            </button>

            <SalesItem 
              currentCpoId={currentCpoId} 
              loadSalesItemsForCPO={loadSalesItemsForCPO} 
            />

            <div className="ButtonContainer">
              <button 
                type="button" 
                onClick={(e) => { 
                  setIsUpdateClicked(true); 
                  handleSubmit(e); // Pass the event to handleSubmit
                }} 
                className="StyledButton1"
              >
                {editingCpo ? "Update" : "Save"}
              </button>
              <button type="button" className="StyledButton11">
                Clear
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default SalesOrder;