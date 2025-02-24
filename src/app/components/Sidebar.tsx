"use client";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [menuItems, setMenuItems] = useState<{ name: string; route: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
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
                value: "app1_menu",
                search_type: "exact",
              },
            ],
            combination_type: "and",
            page: 1,
            limit: 100,
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          const menuData = result.data[0].more_data?.config || [];
          setMenuItems(menuData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(true);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen p-5 transition-all ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <h1 className="text-xl font-bold mb-6">My Dashboard</h1>

        {loading ? (
          <p className="text-gray-400">Loading menu...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load menu.</p>
        ) : (
          <nav>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    href={item.route}
                    className={`block px-3 py-2 rounded-lg ${
                      pathname === item.route ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 text-white bg-gray-800 p-2 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Sidebar;
