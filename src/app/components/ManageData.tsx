"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateRandomId = () => {
  return `dynamic_${Math.floor(100 + Math.random() * 900)}`;
};

const ManageData = () => {
  const [records, setRecords] = useState([
    { label: "", type: "Text", value: "" },
  ]);

  const handleAddRecord = () => {
    setRecords([...records, { label: "", type: "Text", value: "" }]);
  };

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    setRecords((prev) =>
      prev.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      )
    );
  };

  const handleSubmit = async () => {
    const requestData = {
      data: {
        record_id: generateRandomId(),
        feature_name: "Products",
        added_by: "flex_admin",
        record_status: "active",
        created_on_date: new Date().toISOString().split("T")[0],
        feature_data: {
          record_data: records.map((r) => ({
            record_label: r.label,
            record_type: r.type === "Text" ? "type_text" : "type_number",
            ...(r.type === "Text"
              ? { record_value_text: r.value }
              : { record_value_number: parseFloat(r.value) }),
          })),
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
        setRecords([{ label: "", type: "Text", value: "" }]); // Clear records after success
      } else {
        toast.error(`Error: ${result.error || "Submission failed!"}`);
      }
    } catch (error) {
      toast.error("Error submitting data!");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
      <h1 className="text-2xl font-bold mb-4">Manage Data</h1>
      {records.map((record, index) => (
        <div key={index} className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Label"
            className="border p-2 flex-1 bg-gray-700 text-white border-gray-600"
            value={record.label}
            onChange={(e) => handleChange(index, "label", e.target.value)}
          />
          <select
            className="border p-2 bg-gray-700 text-white border-gray-600"
            value={record.type}
            onChange={(e) => handleChange(index, "type", e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="Number">Number</option>
          </select>
          <input
            type={record.type === "Number" ? "number" : "text"}
            placeholder="Value"
            className="border p-2 flex-1 bg-gray-700 text-white border-gray-600"
            value={record.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
          />
          <button
            className="bg-red-500 text-white px-3"
            onClick={() => handleRemoveRecord(index)}
          >
            -
          </button>
        </div>
      ))}
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleAddRecord}>
        +
      </button>
      <button className="bg-green-500 text-white px-4 py-2 ml-2" onClick={handleSubmit}>
        Submit
      </button>

      <ToastContainer />
    </div>
  );
};

export default ManageData;
