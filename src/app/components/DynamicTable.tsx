"use client";
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

// Define data type
interface Data {
  record_label: string;
  record_value_text: string;
  Description: string;
  Price: string;
}

const DynamicTable = () => {
  const [data, setData] = useState<Data[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            conditions: [
              {
                field: "feature_name",
                value: "Products",
                search_type: "exact",
              },
            ],
            combination_type: "and",
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();

        const formattedData = jsonData.map((item: {
          feature_data?: { record_data?: { record_label?: string; record_value_text?: string }[] };
          more_data?: { Description?: string[]; Price?: string[] };
        }) => ({
          record_label: item.feature_data?.record_data?.[0]?.record_label || "N/A",
          record_value_text: item.feature_data?.record_data?.[0]?.record_value_text || "N/A",
          Description: item.more_data?.Description?.[0] || "N/A",
          Price: item.more_data?.Price?.[0] || "N/A",
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<Data, unknown>[] = [
    { accessorKey: "record_label", header: "Record Label" },
    { accessorKey: "record_value_text", header: "Record Value" },
    { accessorKey: "Description", header: "Description" },
    { accessorKey: "Price", header: "Price" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-6 rounded-lg shadow bg-gray-800 text-white">
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="border p-2 rounded w-full mb-4 bg-gray-700 text-white border-gray-600"
      />
      <table className="w-full border-collapse border border-gray-600">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-700">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 border-gray-600">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border border-gray-600">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2 border-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
