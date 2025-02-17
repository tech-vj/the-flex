"use client";

import { useEffect, useState } from "react";

const Test2Feature = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-TYPE": "search"
          },
          body: JSON.stringify({
            conditions: [
              {
                field: "user_credentials.username",
                value: "*",
                search_type: "wildcard",
              },
            ],
            combination_type: "and",
            page: 1,
            limit: 10,
            dataset: "users",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Test Page 2 - POST Method</h1>
      {data ? (
        <pre className="bg-gray-700 text-white p-4 rounded-md overflow-auto border border-gray-600">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Test2Feature;
