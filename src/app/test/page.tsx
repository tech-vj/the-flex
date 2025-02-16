"use client";
import React, { useState, useEffect } from "react";

const API_URL = "http://183.82.7.208:3002/anyapp/search/";

export default function TestPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
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
          throw new Error(`API Error: ${response.status}`);
        }

        const jsonData = await response.json();
        setApiResponse(jsonData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Test API Response</h1>

      {error && (
        <p className="text-red-500 font-semibold">Error: {error}</p>
      )}

      <h2 className="text-xl font-semibold mt-4 mb-2">Raw API Response:</h2>
      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
        {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}
