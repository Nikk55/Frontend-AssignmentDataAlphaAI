import React from "react";
import DataTable from "./components/DataTable";

export default function App() {
  return (
    // <div className="min-h-screen flex items-start justify-center py-10">
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Frontend Assignment</h1>
        <DataTable />
      </div>
    // </div>
    //  <div className="bg-red-500 text-white p-10 text-3xl">
    //   Tailwind Test 🚀
    // </div>
  );
}
