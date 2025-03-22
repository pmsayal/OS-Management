// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../StyleCSS/Customer.css";

// function ItemStockUtilization({ item: selectedItem }) {
//   const [itemPrices, setItemPrices] = useState([]);
//   const [latestPrice, setLatestPrice] = useState(null);
//   const [latestDate, setLatestDate] = useState(null);
//   const [latestQty, setLatestQty] = useState(null);

//   useEffect(() => {
//     console.log("Selected Item:" ,selectedItem)
//     const fetchItemPrices = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://os-management.onrender.com/api/itemprices?item=${selectedItem.item}`
//         );
//         setItemPrices(data.items || []);

//         if (data.items.length > 0) {
//           const latest = data.items.reduce((prev, current) => {
//             return new Date(prev.date) > new Date(current.date) ? prev : current;
//           });
//           setLatestPrice(latest.price);
//           setLatestDate(latest.date);
//           setLatestQty(latest.qty);
//         }
//       } catch (err) {
//         console.log("Error fetching item prices: ", err);
//       }
//     };

//     if (selectedItem) {
//       fetchItemPrices();
//     }
//   }, [selectedItem]);

//   useEffect(() => {
//     loadPurchaseItem();
//     loadPurchaseOrder();
//   });

//   const loadPurchaseItem = async () => {
//     try {
//       const { data } = await axios.get(`https://os-management.onrender.com/api/itemppos`);
//       console.log("Purchase Item:", data);

//       const matchingItems = data.filter(purchaseItem => purchaseItem.item.item === selectedItem._id);

//       if (matchingItems.length > 0) {
//         console.log("Matching Purchase Items:", matchingItems);
//       } else {
//         console.log("No matching purchase items found.");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadPurchaseOrder = async () => {
//     try {
//       const { data } = await axios.get(`https://os-management.onrender.com/api/purchases`);
//       console.log("Purchase Order:", data);
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   return (
//     <>
//       <div className="itemStockDetails">
//         <h1 style={{ textAlign: "center" }}>Item Stock Utilization</h1>
//         <div>
//           <div className="ButtonContainerstockdetails">
//             <h3>Item Name: {selectedItem.item}</h3>
//             <h3>Item Category: {selectedItem.category}</h3>
//             <h3>Brand: {selectedItem.brand}</h3>
//           </div>
//         </div>
//         <div className="ButtonContainer">
//           <div>
//             <h3>Item Stock:</h3>
//             <table className="table table-bordered table-striped table-hover shadow">
//               <thead className="table-secondary">
//                 <tr>
//                   <th>Date</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Purchase Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemPrices.map((itemPrice, index) => (
//                   <tr key={index}>
//                     <td>{new Date(itemPrice.date).toLocaleDateString()}</td>
//                     <td>{itemPrice.qty}</td>
//                     <td>{selectedItem.unit}</td>
//                     <td>{itemPrice.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div>
//             <h3>Item Utilization:</h3>
//             <table className="table table-bordered table-striped table-hover shadow">
//               <thead className="table-secondary">
//                 <tr>
//                   <th>PO Date</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Purchase Order</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>{selectedItem.date}</td>
//                   <td>{selectedItem.stock}</td>
//                   <td>{selectedItem.unit}</td>
//                   <td>{selectedItem.po}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="ButtonContainer">
//           <span>Total Item Stock: {selectedItem.stock} </span>
//           <span>Item Utilization: </span>
//           <span>Available Stock: </span>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ItemStockUtilization;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../StyleCSS/Customer.css";

function ItemStockUtilization({ item: selectedItem }) {
  const [itemPrices, setItemPrices] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [latestQty, setLatestQty] = useState(null);
  const [altQty, setAltQty] = useState(null);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({});

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const { data } = await axios.get(
          `https://os-management.onrender.com/api/itemprices?item=${selectedItem.item}`
        );
        setItemPrices(data.items || []);

        if (data.items.length > 0) {
          const latest = data.items.reduce((prev, current) => {
            return new Date(prev.date) > new Date(current.date)
              ? prev
              : current;
          });
          setLatestPrice(latest.price);
          setLatestDate(latest.date);
          setLatestQty(latest.qty);
        }
      } catch (err) {
        console.log("Error fetching item prices: ", err);
      }
    };

    if (selectedItem) {
      fetchItemPrices();
    }
  }, [selectedItem]);

  useEffect(() => {
    loadPurchaseItem();
  }, [selectedItem]);

  const loadPurchaseItem = async () => {
    try {
      const { data } = await axios.get(`https://os-management.onrender.com/api/itemppos`);

      const matchingItems = data.filter(
        (purchaseItem) => purchaseItem.item.item === selectedItem._id
      );
      // console.log("Matching Purchase Items:", matchingItems);

      if (matchingItems.length > 0) {
        setAltQty(matchingItems[0].altqty);

        const purchaseOrderId = matchingItems[0].purchaseOrderId;
        // console.log("matchingpurchaseOrderId", purchaseOrderId);
        loadPurchaseOrder(purchaseOrderId);
      } else {
        console.log("No matching purchase items found.");
        setAltQty(null);
        setPurchaseOrderDetails({});
      }
    } catch (err) {
      console.log(err);
    }
  };



  const loadPurchaseOrder = async (purchaseOrderId) => {
    try {
      const { data } = await axios.get(`https://os-management.onrender.com/api/purchases`);
      // console.log("Purchase Orders Response:", data); 
  
      const purchaseOrders = data.items || [];   
      if (Array.isArray(purchaseOrders)) {  
        const matchingOrder = purchaseOrders.find(order => order._id === purchaseOrderId);
        if (matchingOrder) {  
          setPurchaseOrderDetails({
            date: matchingOrder.date,
            purchase: matchingOrder.purchase,
          });
        } else {
          console.log("No matching purchase order found.");
          setPurchaseOrderDetails({}); 
        }
      } else {
        console.log("purchaseOrders is not an array.");
        setPurchaseOrderDetails({}); 
      }
    } catch (err) {
      console.log("Error fetching purchase orders:", err);
    }
  };

  // const loadPurchaseOrder = async (purchaseOrderId) => {
  //   console.log("Calling loadPurchaseOrder with ID:", purchaseOrderId);
  //   try {
  //     const { data } = await axios.get(`https://os-management.onrender.com/api/purchases`);
  //     console.log("Purchase Orders Response:", data); 
  
  //     // Access the items array from the response object
  //     const purchaseOrders = data.items || []; // Default to an empty array if items is not present
  //     console.log("Type of purchaseOrders:", typeof purchaseOrders);
  //     console.log("Is purchaseOrders an array?", Array.isArray(purchaseOrders));
  
  //     if (Array.isArray(purchaseOrders)) {
  //       console.log("All Purchase Orders:", purchaseOrders); 
  
  //       const matchingOrder = purchaseOrders.find(order => order._id === purchaseOrderId);
  //       console.log("Searching for ID:", purchaseOrderId);
  //       console.log("Available Order IDs:", purchaseOrders.map(order => order._id)); 
  
  //       if (matchingOrder) {
  //         console.log("Matching Purchase Order:", matchingOrder); 
  //         console.log("Full Matching Purchase Order Details:", JSON.stringify(matchingOrder, null, 2)); 
  
  //         setPurchaseOrderDetails({
  //           date: matchingOrder.date,
  //           purchase: matchingOrder.purchase,
  //         });
  //       } else {
  //         console.log("No matching purchase order found.");
  //         setPurchaseOrderDetails({}); 
  //       }
  //     } else {
  //       console.log("purchaseOrders is not an array.");
  //       setPurchaseOrderDetails({}); 
  //     }
  //   } catch (err) {
  //     console.log("Error fetching purchase orders:", err);
  //   }
  // };

  const totalUtilization = altQty !== null ? altQty : 0;




  return (
    <>
      <div className="itemStockDetails">
        <h1 style={{ textAlign: "center" }}>Item Stock Utilization</h1>
        <div>
          <div className="ButtonContainerstockdetails">
            <h3>Item Name: {selectedItem.item}</h3>
            <h3>Item Category: {selectedItem.category}</h3>
            <h3>Brand: {selectedItem.brand}</h3>
          </div>
        </div>
        <div className="ButtonContainer">
          <div>
            <h3>Item Stock:</h3>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Price</th>
                </tr>
              </thead>
              <tbody>
                {itemPrices.map((itemPrice, index) => (
                  <tr key={index}>
                    <td>{new Date(itemPrice.date).toLocaleDateString()}</td>
                    <td>{itemPrice.qty}</td>
                    <td>{selectedItem.unit}</td>
                    <td>{itemPrice.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Item Utilization:</h3>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>PO Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Order</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{purchaseOrderDetails.date ? new Date(purchaseOrderDetails.date).toLocaleDateString() : ""} </td>
                  <td>{altQty !== null ? altQty : ""}</td>
                  <td>{selectedItem.unit}</td>
                  <td>{purchaseOrderDetails.purchase || selectedItem.po}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="ButtonContainer">
          <span>Total Item Stock: {selectedItem.stock} </span>
          <span>Item Utilization: {totalUtilization}</span>
          <span>Available Stock: {selectedItem.stock - totalUtilization} </span>
        </div>
      </div>
    </>
  );
}

export default ItemStockUtilization; 
