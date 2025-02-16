"use client";
import React, { useState, useEffect } from "react";

const Test = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://183.82.7.208:3002/anyapp/search/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", // Ensures proper JSON response
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
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
    
        const jsonData = await response.json();
        console.log("API Response:", jsonData);
        setApiResponse(jsonData);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      }
    };    

    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow bg-gray-800 text-white">
      <h1 className="text-xl font-bold mb-4">Test API Fetch</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
        {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Loading..."}
      </pre>
    </div>
  );
};

export default Test;
