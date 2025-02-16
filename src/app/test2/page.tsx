"use client";

import { useEffect, useState } from "react";

const Test2Feature = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://183.82.7.208:3002/anyapp/search/?conditions=[{\"field\":\"user_credentials.username\",\"value\":\"*\",\"search_type\":\"wildcard\"}]&combination_type=and&page=1&limit=10&dataset=users&app_secret=38475203487kwsdjfvb1023897yfwbhekrfj"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Test Page 2 - GET Method</h1>
      {data ? (
        <pre className="bg-gray-100 text-gray-800 p-4 rounded-md overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Test2Feature;
