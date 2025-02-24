"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateRandomId = () => `dynamic_${Math.floor(100 + Math.random() * 900)}`;

const DynamicForm = () => {
  const [fields, setFields] = useState<{ label: string; type: string; value: string }[]>([]);
  const [moreData, setMoreData] = useState<{ key: string; value: string }[]>([]);

  const handleFieldChange = (index: number, key: string, value: string) => {
    setFields((prev) => prev.map((field, i) => (i === index ? { ...field, [key]: value } : field)));
  };

  const handleMoreDataChange = (index: number, key: string, value: string) => {
    setMoreData((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addField = () => {
    setFields([...fields, { label: "", type: "text", value: "" }]);
  };

  const addMoreData = () => {
    setMoreData([...moreData, { key: "", value: "" }]);
  };

  const handleSubmit = async () => {
    if (fields.length === 0) {
      toast.error("Please add at least one field before submitting.");
      return;
    }

    const requestData = {
      data: {
        record_id: generateRandomId(),
        feature_name: "Dynamic_Record",
        added_by: "flex_admin",
        record_status: "active",
        created_on_date: new Date().toISOString().split("T")[0],
        feature_data: {
          record_data: fields.map((field) => ({
            record_label: field.label,
            record_type: field.type === "text" ? "type_text" : "type_number",
            ...(field.type === "text"
              ? { record_value_text: field.value }
              : { record_value_number: parseFloat(field.value) || 0 }),
          })),
        },
        more_data: Object.fromEntries(moreData.map((item) => [item.key, item.value])),
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
        setFields([]);
        setMoreData([]);
      } else {
        toast.error(`Error: ${result.error || "Submission failed!"}`);
      }
    } catch (error) {
      toast.error("Error submitting data!");
      console.error(error);
    }
  };

  // Handle Enter key to trigger submission
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white" onKeyDown={handleKeyDown}>
      <h1 className="text-2xl font-bold mb-4">Dynamic Form</h1>

      {fields.map((field, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Label"
            className="border p-2 bg-gray-700 text-white border-gray-600 w-1/3"
            value={field.label}
            onChange={(e) => handleFieldChange(index, "label", e.target.value)}
          />
          <select
            className="border p-2 bg-gray-700 text-white border-gray-600 w-1/3"
            value={field.type}
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
          <input
            type={field.type}
            placeholder="Value"
            className="border p-2 bg-gray-700 text-white border-gray-600 w-1/3"
            value={field.value}
            onChange={(e) => handleFieldChange(index, "value", e.target.value)}
          />
        </div>
      ))}

      <button className="bg-blue-500 px-4 py-2 mb-4" onClick={addField}>
        + Add Field
      </button>

      <h2 className="text-xl font-bold mb-2">More Data</h2>
      {moreData.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Key"
            className="border p-2 bg-gray-700 text-white border-gray-600 w-1/2"
            value={item.key}
            onChange={(e) => handleMoreDataChange(index, "key", e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            className="border p-2 bg-gray-700 text-white border-gray-600 w-1/2"
            value={item.value}
            onChange={(e) => handleMoreDataChange(index, "value", e.target.value)}
          />
        </div>
      ))}

      <button className="bg-blue-500 px-4 py-2 mb-4" onClick={addMoreData}>
        + Add More Data
      </button>

      <button className="bg-green-500 px-4 py-2" onClick={handleSubmit}>
        Submit
      </button>

      <ToastContainer />
    </div>
  );
};

export default DynamicForm;
