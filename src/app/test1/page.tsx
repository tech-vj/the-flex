"use client";

import { useEffect, useState } from "react";

export default function Test1Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Product List</h1>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.record_id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{item.feature_data.record_data[0].record_value_text}</h2>
            <p>{item.more_data.Description[0]}</p>
            <p className="text-gray-600">Price: {item.more_data.Price[0]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
