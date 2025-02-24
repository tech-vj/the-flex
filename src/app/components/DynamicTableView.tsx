"use client";

import { useEffect, useState } from "react";

const DynamicTableView = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-TYPE": "search",
          },
          body: JSON.stringify({
            conditions: [
              {
                field: "feature_name",
                value: "Dynamic_Record",
                search_type: "exact",
              },
            ],
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setData(result.data || []);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table View</h1>
      <table className="w-full border border-gray-600 text-white">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-600 p-2">Record ID</th>
            <th className="border border-gray-600 p-2">Labels</th>
            <th className="border border-gray-600 p-2">More Data</th>
            <th className="border border-gray-600 p-2">Created On</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.record_id} className="border border-gray-600">
              <td className="border border-gray-600 p-2">{record.record_id}</td>
              <td className="border border-gray-600 p-2">
                {record.feature_data.record_data.map((item: any) => (
                  <div key={item.record_label}>
                    {item.record_label}: {item.record_value_text || item.record_value_number}
                  </div>
                ))}
              </td>
              <td className="border border-gray-600 p-2">
                {JSON.stringify(record.more_data)}
              </td>
              <td className="border border-gray-600 p-2">{record.created_on_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTableView;
