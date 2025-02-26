import React from "react";
import DynamicTable from "@/app/components/DynamicTable";
import config2 from "@/config/config2.json"; // Import JSON config

const Page2 = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Page 2 - Inventory List</h1>
      <DynamicTable config={config2} />
    </div>
  );
};

export default Page2;
