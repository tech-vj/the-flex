"use client";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen p-5 transition-all ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <h1 className="text-xl font-bold mb-6">My Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                href="/dynamic-table"
                className="block px-3 py-2 rounded-lg hover:bg-gray-700"
              >
                Dynamic Table
              </Link>
            </li>
          </ul>
        </nav>
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
