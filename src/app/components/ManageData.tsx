"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateRandomId = () => {
  return `dynamic_${Math.floor(100 + Math.random() * 900)}`;
};

const ManageData = () => {
  const [record, setRecord] = useState({
    productName: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  const handleChange = (field: string, value: string) => {
    setRecord((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const requestData = {
      data: {
        record_id: generateRandomId(),
        feature_name: "Test_Products",
        added_by: "flex_admin",
        record_status: "active",
        created_on_date: new Date().toISOString().split("T")[0],
        feature_data: {
          record_data: [
            { record_label: "Product Name", record_type: "type_text", record_value_text: record.productName },
            { record_label: "Description", record_type: "type_text", record_value_text: record.description },
            { record_label: "Price", record_type: "type_number", record_value_number: parseFloat(record.price) || 0 },
            { record_label: "Stock Quantity", record_type: "type_number", record_value_number: parseInt(record.stockQuantity) || 0 },
          ],
        },
        more_data: {
          categories: ["cat_001"],
        },
      },
      dataset: "feature_data",
      app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
    };

    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-TYPE": "create",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Success: ${result.message || "Data submitted successfully!"}`);
        setRecord({ productName: "", description: "", price: "", stockQuantity: "" });
      } else {
        toast.error(`Error: ${result.error || "Submission failed!"}`);
      }
    } catch (error) {
      toast.error("Error submitting data!");
      console.error(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
      <h1 className="text-2xl font-bold mb-4">Manage Data</h1>
      <div className="flex flex-col gap-4 mb-4" onKeyDown={handleKeyDown}>
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 bg-gray-700 text-white border-gray-600"
          value={record.productName}
          onChange={(e) => handleChange("productName", e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 bg-gray-700 text-white border-gray-600"
          value={record.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 bg-gray-700 text-white border-gray-600"
          value={record.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          className="border p-2 bg-gray-700 text-white border-gray-600"
          value={record.stockQuantity}
          onChange={(e) => handleChange("stockQuantity", e.target.value)}
        />
      </div>
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>
        Submit
      </button>
      <ToastContainer />
    </div>
  );
};

export default ManageData;