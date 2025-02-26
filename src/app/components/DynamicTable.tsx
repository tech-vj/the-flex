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

interface Data {
  record_id: string;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_on_date: string;
}

interface Config {
  conditions: any[];
  page: number;
  limit: number;
  dataset: string;
  app_secret: string;
  features?: {
    search?: boolean;
    sorting?: boolean;
    pagination?: boolean;
  };
}

const DynamicTable = ({ config }: { config: Config }) => {
  const [data, setData] = useState<Data[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(config.page || 1);
  const [limit, setLimit] = useState(config.limit || 10);

  const fetchData = async (currentPage: number, currentLimit: number) => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-TYPE": "search",
        },
        body: JSON.stringify({
          conditions: config.conditions,
          combination_type: "and",
          page: currentPage,
          limit: currentLimit,
          dataset: config.dataset,
          app_secret: config.app_secret,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

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

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

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
    ...(config.features?.sorting ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...(config.features?.search ? { getFilteredRowModel: getFilteredRowModel(), state: { globalFilter }, onGlobalFilterChange: setGlobalFilter } : {}),
    ...(config.features?.pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  });

  return (
    <div className="p-6 rounded-lg shadow bg-gray-800 text-white text-center">
      {/* Search Input (if enabled) */}
      {config.features?.search && (
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border p-2 rounded w-full mb-4 bg-gray-700 text-white border-gray-600"
        />
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full border-collapse border border-gray-600">
          <thead className="sticky top-0 bg-gray-700 shadow">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-2 border-gray-600 cursor-pointer" onClick={config.features?.sorting ? header.column.getToggleSortingHandler() : undefined}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {config.features?.sorting &&
                      (header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : "")}
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
      </div>

      {/* Pagination (if enabled) */}
      {config.features?.pagination && (
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50">
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage((prev) => prev + 1)} className="px-4 py-2 rounded bg-gray-700 text-white">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
