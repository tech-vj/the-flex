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
  record_id: string;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_on_date: string;
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
            "X-API-TYPE": "search"
          },
          body: JSON.stringify({
            conditions: [
              {
                field: "feature_name",
                value: "Test_Products",
                search_type: "exact",
              },
            ],
            combination_type: "and",
            "page": 1,
            "limit": 100,
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();

        const formattedData = jsonData.data.map((item: any) => ({
          record_id: item.record_id,
          product_name:
            item.feature_data?.record_data?.find(
              (d: any) => d.record_label === "Product Name"
            )?.record_value_text || "N/A",
          description:
            item.feature_data?.record_data?.find(
              (d: any) => d.record_label === "Description"
            )?.record_value_text || "N/A",
          price:
            item.feature_data?.record_data?.find(
              (d: any) => d.record_label === "Price"
            )?.record_value_number || 0,
          stock_quantity:
            item.feature_data?.record_data?.find(
              (d: any) => d.record_label === "Stock Quantity"
            )?.record_value_number || 0,
          created_on_date: item.created_on_date,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<Data, unknown>[] = [
    { accessorKey: "record_id", header: "Record ID" },
    { accessorKey: "product_name", header: "Product Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "stock_quantity", header: "Stock Quantity" },
    { accessorKey: "created_on_date", header: "Created On" },
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
    <div className="p-6 rounded-lg shadow bg-gray-800 text-white text-center">
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
