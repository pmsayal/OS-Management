import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";
import Select from "react-select";

function isDateString(dateString) {
  return !isNaN(Date.parse(dateString));
}

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function Dashboard() {
  const [cpo, setCpo] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cpoList, setCpoList] = useState([]);
  const [selectedCPO, setSelectedCPO] = useState("");
  const [poList, setPoList] = useState([]);
  const [purchasePo, setPurchase] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
  const [cpoTotalAmount, setCpoTotalAmount] = useState();

  useEffect(() => {
    loadCustomers();
    loadCPOs();
    loadPOs();
  }, []);

  useEffect(() => {
    fetch("https://os-management.onrender.com/api/itemppos")
      .then((response) => response.json())
      .then((data) => setPurchaseOrders(data));
  }, []);

  useEffect(() => {
    fetch("https://os-management.onrender.com/api/itempos").then((response) =>
      response.json()
    );
  }, []);

  const loadCustomers = async () => {
    try {
      const { data } = await axios.get("https://os-management.onrender.com/api/customers");
      setCustomers(data.customers || []);
    } catch (err) {
      console.log(err);
    }
  };


  const loadCPOs = async () => {
    try {
      let allCPOs = [];
      let currentPage = 1;
      let totalPages = 1;
      do {
        const { data } = await axios.get(
          `https://os-management.onrender.com/api/customerpos?page=${currentPage}&limit=6`
        );
        allCPOs = [...allCPOs, ...data.customers];
        totalPages = data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);
      setCpoList(allCPOs);
    } catch (err) {
      console.log("Error fetching CPOs:", err);
    }
  };



  const handleCPOChange = async (event) => {
    const selectedCPO = event.target.value;
    setSelectedCPO(selectedCPO);    

    const selectedCPORecord = cpoList.find(cpo => cpo.customerpo === selectedCPO);
    
    if (selectedCPORecord) {
      console.log("Selected CPO ID:", selectedCPORecord._id);
      setCpoTotalAmount(selectedCPORecord.cpoTotal); 
    } else {
      console.log("CPO record not found for:", selectedCPO);
    }  
    try {
      const { data } = await axios.get("https://os-management.onrender.com/api/itempos");
      console.log("All Items from itempos API:", data);
      const filteredItems = data.filter(
        (item) => item.customerPo === selectedCPORecord?._id
      );
      console.log("Filtered Items for Selected CPO:", filteredItems);
      setCpo(filteredItems);
      
    } catch (error) {
      console.error("Error fetching items for selected CPO:", error);
    }
  };



  

  const loadPOs = async () => {
    try {
      const { data } = await axios.get("https://os-management.onrender.com/api/purchases");
      const uniquePOs = [
        ...new Set(data.items.map((purchase) => purchase.purchase)),
      ];
      setPoList(
        uniquePOs.map((po) => {
          const poDetails = data.items.find((item) => item.purchase === po);
          return {
            value: po,
            label: poDetails ? poDetails.purchase : `Purchase Order ${po}`,
          };
        })
      );
    } catch (err) {
      console.log("Error fetching POs:", err);
    }
  };

  const handlePOChange = async (event) => {
    const selectedPO = event.target.value;
    try {
      const { data } = await axios.get("https://os-management.onrender.com/api/purchases");
      const selectedPurchase = data.items.find(
        (purchase) => purchase.purchase === selectedPO
      );
      if (selectedPurchase) {
        const associatedID = selectedPurchase._id;
        setSelectedPO(selectedPO);
        const itemResponse = await axios.get(
          `https://os-management.onrender.com/api/itemppos?purchaseOrderId=${associatedID}`
        );
        const filteredItems = itemResponse.data.filter(
          (item) => item.purchaseOrderId === associatedID
        );
        setPurchaseItems(filteredItems);
        calculateTotalPrice(filteredItems);
      } else {
        console.log("No matching purchase found for selected PO.");
      }
    } catch (error) {
      console.error("Error fetching items for selected PO:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.altqty * item.unitCost,
      0
    );
    setTotalPurchasePrice(total);
  };

  function handleDateChange(event) {
    const selectedDate = event.target.value;
    if (isDateString(selectedDate)) {
      console.log("Valid date:", selectedDate);
    } else {
      console.log("Invalid date:", selectedDate);
    }
  }

  const todayDate = getTodayDate();

  return (
    <>
      <div className="main-container">
        <h1>Dashboard - Profit & Loss</h1>
        <div className="StyledDiv">
          <div className="ButtonContainerDB">
            <div className="padding-5px">
              <select
                id="customer"
                value={selectedCustomer}
                className="customer-salesorder_input22 scrollable-dropdown"
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <select
                id="cpo"
                className="customer-salesorder_input22"
                onChange={handleCPOChange}
              >
                <option value="">Select CPO</option>
                {cpoList.map((cpo) => (
                  <option key={cpo.value} value={cpo.value}>
                    {cpo.customerpo}
                  </option>
                ))}
              </select>
              <select
                id="PO"
                className="customer-salesorder_input22"
                onChange={handlePOChange}
              >
                <option value=""> Select PO </option>
                {poList.map((po) => (
                  <option key={po.value} value={po.value}>
                    {po.label}
                  </option>
                ))}
              </select>
              <label htmlFor="orderDate" className="OrderDate">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                onChange={handleDateChange}
                max={todayDate}
                className="customer-salesorder_input22"
              />
              <label htmlFor="orderDate" className="OrderDate">
                To:
              </label>              
              <input
                className="customer-salesorder_input22"
                type="date"
                id="endDate"
                onChange={handleDateChange}
                max={todayDate}
              />
            </div>

            <button className="StyledButton">
              <BiSearch className="SearchIcon" />
              Search
            </button>
          </div>
        </div>

        <div>
          <div className="table-Dashboard">
            <div className="tableCPR">
              <h2 className="list-name">Customer PO Details: {selectedCPO}</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cpo?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item?.item || ""}</td>
                      <td>{item.qty}</td>
                      <td>{item.salesPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <h2>CPO Order Amount: ₹{cpoTotalAmount ? cpoTotalAmount.toFixed(2) : ""}</h2>
 
            </div>
            <div className="tableCPR">
              <h2 className="list-name">
                Purchase Order Details: {selectedPO}
              </h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.item?.item || "N/A"}</td>
                      <td>{item.altqty}</td>
                      <td>{(item.altqty * item.unitCost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>PO Order Amount: ₹{totalPurchasePrice.toFixed(2)}</h2>
            </div>
            <div className="tableCPR">
              <h2 className="list-name">Remaining Purchase Order</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasePo.map((rem) => (
                    <tr key={rem.id}>
                      <td>{rem.item}</td>
                      <td>{rem.remqty}</td>
                      <td>{rem.pprice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* <h2 className="list-name">Remaining cpo: </h2> */}
            </div>
          </div>


          <h2>Profit/Loss: ₹{cpoTotalAmount && totalPurchasePrice ? (cpoTotalAmount - totalPurchasePrice).toFixed(2) : ""}</h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;











// import axios from "axios";
// import { useEffect, useState } from "react";
// import { BiSearch } from "react-icons/bi";
// import "../StyleCSS/Customer.css";
// import "../StyleCSS/SalesPurchase.css";
// import Select from "react-select";

// function isDateString(dateString) {
//   return !isNaN(Date.parse(dateString));
// }

// function getTodayDate() {
//   const today = new Date();
//   const yyyy = today.getFullYear();
//   const mm = String(today.getMonth() + 1).padStart(2, "0");
//   const dd = String(today.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// function Dashboard() {
//   const [cpo, setCpo] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [cpoList, setCpoList] = useState([]);
//   const [selectedCPO, setSelectedCPO] = useState("");
//   const [poList, setPoList] = useState([]);
//   const [purchasePo, setPurchase] = useState([]);
//   const [selectedPO, setSelectedPO] = useState("");
//   const [purchaseItems, setPurchaseItems] = useState([]);
//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
//   const [cpoTotalAmount, setCpoTotalAmount] = useState(0);
//   const [remainingPurchaseOrder, setRemainingPurchaseOrder] = useState([]); // New state for remaining purchase order

//   useEffect(() => {
//     loadCustomers();
//     loadCPOs();
//     loadPOs();
//   }, []);

//   useEffect(() => {
//     fetch("https://os-management.onrender.com/api/itemppos")
//       .then((response) => response.json())
//       .then((data) => setPurchaseOrders(data));
//   }, []);

//   useEffect(() => {
//     fetch("https://os-management.onrender.com/api/itempos").then((response) =>
//       response.json()
//     );
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const { data } = await axios.get("https://os-management.onrender.com/api/customers");
//       setCustomers(data.customers || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadCPOs = async () => {
//     try {
//       let allCPOs = [];
//       let currentPage = 1;
//       let totalPages = 1;
//       do {
//         const { data } = await axios.get(
//           `https://os-management.onrender.com/api/customerpos?page=${currentPage}&limit=6`
//         );
//         allCPOs = [...allCPOs, ...data.customers];
//         totalPages = data.totalPages;
//         currentPage++;
//       } while (currentPage <= totalPages);
//       setCpoList(allCPOs);
//     } catch (err) {
//       console.log("Error fetching CPOs:", err);
//     }
//   };

//   const handleCPOChange = async (event) => {
//     const selectedCPO = event.target.value;
//     setSelectedCPO(selectedCPO);    

//     const selectedCPORecord = cpoList.find(cpo => cpo.customerpo === selectedCPO);
    
//     if (selectedCPORecord) {
//       console.log("Selected CPO ID:", selectedCPORecord._id);
//       setCpoTotalAmount(selectedCPORecord.cpoTotal); 
//     } else {
//       console.log("CPO record not found for:", selectedCPO);
//     }  
//     try {
//       const { data } = await axios.get("https://os-management.onrender.com/api/itempos");
//       console.log("All Items from itempos API:", data);
//       const filteredItems = data.filter(
//         (item) => item.customerPo === selectedCPORecord?._id
//       );
//       console.log("Filtered Items for Selected CPO:", filteredItems);
//       setCpo(filteredItems);
      
//     } catch (error) {
//       console.error("Error fetching items for selected CPO:", error);
//     }
//   };

//   const loadPOs = async () => {
//     try {
//       const { data } = await axios.get("https://os-management.onrender.com/api/purchases");
//       const uniquePOs = [
//         ...new Set(data.items.map((purchase) => purchase.purchase)),
//       ];
//       setPoList(
//         uniquePOs.map((po) => {
//           const poDetails = data.items.find((item) => item.purchase === po);
//           return {
//             value: po,
//             label: poDetails ? poDetails.purchase : `Purchase Order ${po}`,
//           };
//         })
//       );
//     } catch (err) {
//       console.log("Error fetching POs:", err);
//     }
//   };

//   const handlePOChange = async (event) => {
//     const selectedPO = event.target.value;
//     try {
//       const { data } = await axios.get("https://os-management.onrender.com/api/purchases");
//       const selectedPurchase = data.items.find(
//         (purchase) => purchase.purchase === selectedPO
//       );
//       if (selectedPurchase) {
//         const associatedID = selectedPurchase._id;
//         setSelectedPO(selectedPO);
//         const itemResponse = await axios.get(
//           `https://os-management.onrender.com/api/itemppos?purchaseOrderId=${associatedID}`
//         );
//         const filteredItems = itemResponse.data.filter(
//           (item) => item.purchaseOrderId === associatedID
//         );
//         setPurchaseItems(filteredItems);
//         calculateTotalPrice(filteredItems);
//       } else {
//         console.log("No matching purchase found for selected PO.");
//       }
//     } catch (error) {
//       console.error("Error fetching items for selected PO:", error);
//     }
//   };

//   const calculateTotalPrice = (items) => {
//     const total = items.reduce(
//       (sum, item) => sum + item.altqty * item.unitCost,
//       0
//     );
//     setTotalPurchasePrice(total);
//   };

//   const calculateRemainingPurchaseOrder = () => {
//     const remainingOrders = purchaseItems.map(item => {
//       const totalQty = item.altqty; 
//       const orderedQty = cpo.find(c => c.item?._id === item.item?._id)?.qty || 0; 
//       const remainingQty = totalQty - orderedQty; 
//       const remainingPrice = remainingQty * item.unitCost; 

//       return {
//         description: item.item?.item || "N/A",
//         qty: remainingQty,
//         price: remainingPrice.toFixed(2),
//       };
//     }).filter(order => order.qty > 0); 

//     setRemainingPurchaseOrder(remainingOrders);
//   };

//   useEffect(() => {
//     calculateRemainingPurchaseOrder(); 
//   }, [purchaseItems, cpo]);

//   function handleDateChange(event) {
//     const selectedDate = event.target.value;
//     if (isDateString(selectedDate)) {
//       console.log("Valid date:", selectedDate);
//     } else {
//       console.log("Invalid date:", selectedDate);
//     }
//   }

//   const todayDate = getTodayDate();

//   return (
//     <>
//       <div className="main-container">
//         <h1>Dashboard - Profit & Loss</h1>
//         <div className="StyledDiv">
//           <div className="ButtonContainerDB">
//             <div className="padding-5px">
//               <select
//                 id="customer"
//                 value={selectedCustomer}
//                 className="customer-salesorder_input22 scrollable-dropdown"
//               >
//                 <option value="" disabled>
//                   Select Customer
//                 </option>
//                 {customers.map((customer) => (
//                   <option key={customer._id} value={customer._id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 id="cpo"
//                 className="customer-salesorder_input22"
//                 onChange={handleCPOChange}
//               >
//                 <option value="">Select CPO</option>
//                 {cpoList.map((cpo) => (
//                   <option key={cpo.value} value={cpo.value}>
//                     {cpo.customerpo}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 id="PO"
//                 className="customer-salesorder_input22"
//                 onChange={handlePOChange}
//               >
//                 <option value=""> Select PO </option>
//                 {poList.map((po) => (
//                   <option key={po.value} value={po.value}>
//                     {po.label}
//                   </option>
//                 ))}
//               </select>
//               <label htmlFor="orderDate" className="OrderDate">
//                 Order Date:
//               </label>
//               <input
//                 type="date"
//                 id="orderDate"
//                 onChange={handleDateChange}
//                 max={todayDate}
//                 className="customer-salesorder_input22"
//               />
//               <label htmlFor="orderDate" className="OrderDate">
//                 To:
//               </label>              
//               <input
//                 className="customer-salesorder_input22"
//                 type="date"
//                 id="endDate"
//                 onChange={handleDateChange}
//                 max={todayDate}
//               />
//             </div>

//             <button className="StyledButton">
//               <BiSearch className="SearchIcon" />
//               Search
//             </button>
//           </div>
//         </div>

//         <div>
//           <div className="table-Dashboard">
//             <div className="tableCPR">
//               <h2 className="list-name">Customer PO Details: {selectedCPO}</h2>
//               <table className="table table-bordered table-striped table-hover shadow">
//                 <thead className="table-secondary">
//                   <tr>
//                     <th>Description</th>
//                     <th>Qty</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cpo?.map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.item?.item || ""}</td>
//                       <td>{item.qty}</td>
//                       <td>{item.salesPrice}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <h2>CPO Order Amount: ₹{cpoTotalAmount ? cpoTotalAmount.toFixed(2) : "0.00"}</h2>
//             </div>
//             <div className="tableCPR">
//               <h2 className="list-name">
//                 Purchase Order Details: {selectedPO}
//               </h2>
//               <table className="table table-bordered table-striped table-hover shadow">
//                 <thead className="table-secondary">
//                   <tr>
//                     <th>Description</th>
//                     <th>Qty</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchaseItems.map((item) => (
//                     <tr key={item._id}>
//                       <td>{item.item?.item || "N/A"}</td>
//                       <td>{item.altqty}</td>
//                       <td>{(item.altqty * item.unitCost).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h2>PO Order Amount: ₹{totalPurchasePrice.toFixed(2)}</h2>
//             </div>
//             <div className="tableCPR">
//               <h2 className="list-name">Remaining Purchase Order</h2>
//               <table className="table table-bordered table-striped table-hover shadow">
//                 <thead className="table-secondary">
//                   <tr>
//                     <th>Description</th>
//                     <th>Qty</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {remainingPurchaseOrder.map((rem, index) => (
//                     <tr key={index}>
//                       <td>{rem.description}</td>
//                       <td>{rem.qty}</td>
//                       <td>₹{rem.price}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <h2 className="list-name">Remaining cpo: ₹{remainingPurchaseOrder.reduce((sum, order) => sum + parseFloat(order.price), 0).toFixed(2)}</h2>
//             </div>
//           </div>

//           //<h2>Profit/Loss: {""} </h2>
//           <h2>Profit/Loss: ₹{cpoTotalAmount && totalPurchasePrice ? (cpoTotalAmount - totalPurchasePrice).toFixed(2) : "0.00"}</h2>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;