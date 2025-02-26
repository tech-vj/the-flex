import React from "react";
import DynamicTable from "@/app/components/DynamicTable";
import config1 from "@/config/config1.json"; // Import JSON config

const Page1 = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Page 1 - Product List</h1>
      <DynamicTable config={config1} />
    </div>
  );
};

export default Page1;
