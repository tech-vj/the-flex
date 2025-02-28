"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to encode data to Base64
const encodeBase64 = (data: any) => btoa(JSON.stringify(data));

// Helper function to decode Base64
const decodeBase64 = (encodedData: string) => {
  try {
    return JSON.parse(atob(encodedData));
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return [];
  }
};

const SidebarMenuManager = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<{ name: string; route: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch existing menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-TYPE": "search",
          },
          body: JSON.stringify({
            conditions: [{ field: "feature_name", value: "app1_menu", search_type: "exact" }],
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          const base64Config = result.data[0]?.more_data?.menu_config?.[0] || "";
          const decodedMenu = base64Config ? decodeBase64(base64Config) : [];
          setMenuItems(decodedMenu);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(true);
      }
      setLoading(false);
    };

    fetchMenuItems();
  }, []);

  // Handle input changes
  const handleInputChange = (index: number, field: "name" | "route", value: string) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Add new menu item
  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: "", route: "" }]);
  };

  // Remove menu item
  const removeMenuItem = (index: number) => {
    setMenuItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update menu with API and show toast notifications
  const updateMenu = async () => {
    setUpdating(true);
    try {
      const encodedConfig = encodeBase64(menuItems);

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-TYPE": "update",
        },
        body: JSON.stringify({
          data: {
            record_id: "app1_menu",
            feature_name: "app1_menu",
            fields_to_update: {
              more_data: {
                menu_config: [encodedConfig], // Store as Base64
              },
            },
          },
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Sidebar menu updated successfully!");
        router.push("/MenuManager");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(result.message || "Failed to update sidebar menu.");
      }
    } catch (err) {
      console.error("Error updating menu:", err);
      toast.error("An error occurred while updating the menu.");
    }
    setUpdating(false);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Sidebar Menu Manager</h2>

      {loading ? (
        <p className="text-gray-400">Loading menu items...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load menu items.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-700 mb-4">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2">Name</th>
                <th className="border border-gray-600 p-2">Route</th>
                <th className="border border-gray-600 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, index) => (
                <tr key={index} className="border border-gray-700">
                  <td className="border border-gray-600 p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      className="w-full p-1 bg-gray-900 text-white border border-gray-600 rounded"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">
                    <input
                      type="text"
                      value={item.route}
                      onChange={(e) => handleInputChange(index, "route", e.target.value)}
                      className="w-full p-1 bg-gray-900 text-white border border-gray-600 rounded"
                    />
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <button
                      onClick={() => removeMenuItem(index)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={addMenuItem} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4">
            + Add Menu Item
          </button>
          <br />
          <button
            onClick={updateMenu}
            disabled={updating}
            className={`px-4 py-2 rounded ${updating ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"}`}
          >
            {updating ? "Updating..." : "Update Sidebar"}
          </button>
        </>
      )}
    </div>
  );
};

export default SidebarMenuManager;
