import DynamicTable from "@/app/components/DynamicTable";

export default function Page() {
  return (
    <div className="p-6 min-h-screen bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-200">Dynamic Table</h1>
      <DynamicTable />
    </div>
  );
}
