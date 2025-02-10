import React, { useState, useEffect } from "react";
import SalesOrder from "../Customer-Order/CustomerPo";
import { BiAddToQueue, BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { Modal, Tooltip, Pagination } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import "../StyleCSS/Customer.css";

function ManageCPO() {
  const [visible, setVisible] = useState(false);
  const [customerpo, setCustomerpo] = useState([]);
  const [customern, setCustomern] = useState("");
  const [customer, setCustomer] = useState([]); 
  const [editingCpo, setEditingCpo] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [salesItems, setSalesItems] = useState([]);
  const [currentCpoId, setCurrentCpoId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [cpoList, setCpoList] = useState([]);
  const [selectedCpoId, setSelectedCpoId] = useState();

  useEffect(() => {
    loadCpo(currentPage);
    loadCpoList();
    loadSalesItems();
  }, [currentPage]);

  const loadCpoList = async () => {
    try {
      const { data } = await axios.get("https://os-management.onrender.com/customerpos");
      setCustomer(data.customers || []); 
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  const loadCpo = async (page) => {
    try {
      const { data } = await axios.get(
        `https://os-management.onrender.com/customerpos?page=${page}&limit=${6}`
      );
      setCustomerpo(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setCpoList(data.customers?.map((item) => item.customerpo) || []);
    } catch (err) {
      console.error("Error loading CPO:", err);
    }
  };

  const loadSalesItems = async () => {
    try {
      const { data } = await axios.get(`https://os-management.onrender.com/itempos`);
      setSalesItems(data || []);
    } catch (err) {
      console.error("Error loading sales items for CPO:", err);
      toast.error("Failed to load sales items");
    }
  };

  const handleEditItem = (item) => {
    setEditingCpo(item);
    setVisible(true);
    setCurrentCpoId(item._id);
  };

  const handleCpoSelect = (cpoId) => {
    setSelectedCpoId(cpoId);
  };

  const handleDelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `https://os-management.onrender.com/customerpos/${itemId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        loadCpo(currentPage);
      }
    } catch (err) {
      console.error("Error deleting CPO:", err);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="main-container">
        <h1>Manage Customer PO</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div className="Dropdown-item">
              <Select
                name="customern"
                value={
                  customer.length > 0
                    ? customer.find((c) => c._id === customern) || null
                    : null
                }
                onChange={(selectedOption) =>
                  setCustomern(selectedOption?.value || "")
                }
                className="SearchbelDropdown"
                placeholder="Select Customer"
                options={customer.map((cust) => ({
                  value: cust._id,
                  label: cust.name,
                }))}
              />
              <label htmlFor="orderDate" className="label">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
              <Select
                className="SearchbelDropdown"
                placeholder="Customer PO..."
                onChange={(selectedOption) => {
                  setCurrentCpoId(selectedOption.value);
                  handleCpoSelect(selectedOption.value);
                }}
                options={cpoList.map((cpo) => ({
                  value: cpo,
                  label: cpo,
                }))}
              />
            </div>
            <div>
              <input
                type="search"
                className="searchitem"
                placeholder="Search..."
              />
              <button className="StyledButton">
                <BiSearch className="SearchIcon" />
                Search
              </button>
              <button className="StyledButton" onClick={() => {
                setVisible(true);
                setEditingCpo(null); // Reset editing state for adding
              }}>
                <BiAddToQueue className="Add" />
                Add CPO
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="list-name">Customer PO List:</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-secondary TH-SIZE">
              <tr>
                <th>Customer Name</th>
                <th>Customer PO</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customerpo.map((item) => {
                const relatedSalesItems = salesItems.filter(
                  (salesItem) => salesItem.customerPo === item._id
                );

                const totalSalesPrice = relatedSalesItems.reduce(
                  (total, salesItem) => total + (salesItem.salesPrice || 0),
                  0
                );

                return (
                  <tr key={item._id} className="TD-SIZE">
                    <td>{item.customern?.name || ""}</td>
                    <td>{item.customerpo}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{totalSalesPrice.toFixed(2)}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className="button-group">
                        <Tooltip title="Edit">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="btns1"
                          >
                            <BiEdit className="icon-size" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btns2"
                          >
                            <BiTrash className="icon-size" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={6}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingCpo(null); 
        }}
        footer={null}
        width={750}
      >
        <SalesOrder
          setVisible={setVisible}
          editingCpo={editingCpo}
          refreshData={loadCpo}
          refreshCustomers={loadCpoList}
        />
      </Modal>
    </>
  );
}

export default ManageCPO;