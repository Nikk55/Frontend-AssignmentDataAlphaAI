import React, { useMemo, useState } from "react";
import useLoans from "../hooks/useLoans";

// TanStack imports
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const DataTable = () => {
  const { items: data = [], loading, error, refetch } = useLoans();

  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [ownershipFilter, setOwnershipFilter] = useState("");

  const unique = (arr, key) =>
    [...new Set((arr || []).map((i) => i && i[key]).filter(Boolean))];

  // --- Filters & Search ---
  const filteredData = useMemo(() => {
    let updated = [...(data || [])];

    if (search) {
      const q = search.toLowerCase();
      updated = updated.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(q)
        )
      );
    }

    if (propertyFilter) {
      updated = updated.filter((item) => item.PROPERTY_STATE === propertyFilter);
    }

    if (ownershipFilter) {
      updated = updated.filter((item) => item.OWNERSHIP_TYPE === ownershipFilter);
    }

    return updated;
  }, [data, search, propertyFilter, ownershipFilter]);

  // --- Columns ---
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) =>
      columnHelper.accessor(key, {
        header: () => <span className="font-semibold capitalize">{key}</span>,
        cell: (info) => {
          const value = info.getValue();
          if (value === true) return "Yes";
          if (value === false) return "No";
          return String(value ?? "");
        },
        enableSorting: true,
      })
    );
  }, [data]);

  // --- Table instance ---
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // --- Loading / Error ---
  if (loading) {
    return <div className="bg-white shadow rounded p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        <div>Error loading data: {String(error)}</div>
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full font-sans">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All States</option>
          {unique(data, "PROPERTY_STATE").map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={ownershipFilter}
          onChange={(e) => setOwnershipFilter(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Ownership Types</option>
          {unique(data, "OWNERSHIP_TYPE").map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#E6F7F4] text-[#475467]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-center font-medium cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <span className="text-xs">▲</span>,
                        desc: <span className="text-xs">▼</span>,
                      }[header.column.getIsSorted()] ?? (
                        <span className="text-xs opacity-50">⇅</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, rIndex) => (
                <tr
                  key={row.id}
                  className={`${
                    rIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-t border-gray-200 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1}>
                  <p className="text-center py-4 text-gray-500">No matching data found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 mt-5">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded-md border text-sm font-medium 
                       hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            ⏮ First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded-md border text-sm font-medium 
                       hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            ◀ Prev
          </button>
        </div>

        {/* Middle controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>

          <span className="text-sm">| Go to page:</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded-md border text-sm font-medium 
                       hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Next ▶
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded-md border text-sm font-medium 
                       hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Last ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;








// import React, { useMemo, useState } from "react";
// import useLoans from "../hooks/useLoans";

// // TanStack imports
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getPaginationRowModel,
//   flexRender,
//   createColumnHelper,
// } from "@tanstack/react-table";

// const columnHelper = createColumnHelper();

// const DataTable = () => {
//   const { items: data = [], loading, error, refetch } = useLoans();

//   const [search, setSearch] = useState("");
//   const [propertyFilter, setPropertyFilter] = useState("");
//   const [ownershipFilter, setOwnershipFilter] = useState("");

//   const unique = (arr, key) =>
//     [...new Set((arr || []).map((i) => i && i[key]).filter(Boolean))];

//   // --- Filters & Search ---
//   const filteredData = useMemo(() => {
//     let updated = [...(data || [])];

//     if (search) {
//       const q = search.toLowerCase();
//       updated = updated.filter((item) =>
//         Object.values(item).some((val) =>
//           String(val).toLowerCase().includes(q)
//         )
//       );
//     }

//     if (propertyFilter) {
//       updated = updated.filter((item) => item.PROPERTY_STATE === propertyFilter);
//     }

//     if (ownershipFilter) {
//       updated = updated.filter((item) => item.OWNERSHIP_TYPE === ownershipFilter);
//     }

//     return updated;
//   }, [data, search, propertyFilter, ownershipFilter]);

//   // --- Columns ---
//   const columns = useMemo(() => {
//     if (!data || data.length === 0) return [];
//     return Object.keys(data[0]).map((key) =>
//       columnHelper.accessor(key, {
//         header: () => (
//           <span className="font-semibold capitalize tracking-wide">
//             {key.replace(/_/g, " ")}
//           </span>
//         ),
//         cell: (info) => {
//           const value = info.getValue();
//           if (value === true) return "Yes";
//           if (value === false) return "No";
//           return String(value ?? "");
//         },
//         enableSorting: true,
//       })
//     );
//   }, [data]);

//   // --- Table instance ---
//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: { pagination: { pageSize: 10 } },
//   });

//   // --- Loading / Error ---
//   if (loading) {
//     return (
//       <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
//         <div>Error loading data: {String(error)}</div>
//         <button
//           className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           onClick={() => refetch()}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // --- Render ---
//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6 w-full font-sans">
//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded-md w-64 text-sm 
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <select
//           value={propertyFilter}
//           onChange={(e) => setPropertyFilter(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm 
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All States</option>
//           {unique(data, "PROPERTY_STATE").map((state) => (
//             <option key={state} value={state}>
//               {state}
//             </option>
//           ))}
//         </select>

//         <select
//           value={ownershipFilter}
//           onChange={(e) => setOwnershipFilter(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm 
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Ownership Types</option>
//           {unique(data, "OWNERSHIP_TYPE").map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="table-auto w-full text-sm text-gray-700">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr
//                 key={headerGroup.id}
//                 className="bg-gradient-to-r from-blue-600 to-blue-500 text-white"
//               >
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                     className="px-5 py-3 text-left font-medium cursor-pointer select-none"
//                   >
//                     <div className="flex items-center gap-1">
//                       {flexRender(header.column.columnDef.header, header.getContext())}
//                       {header.column.getIsSorted() === "asc" && (
//                         <span className="text-xs">▲</span>
//                       )}
//                       {header.column.getIsSorted() === "desc" && (
//                         <span className="text-xs">▼</span>
//                       )}
//                       {!header.column.getIsSorted() && (
//                         <span className="text-xs opacity-50">⇅</span>
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row, rIndex) => (
//                 <tr
//                   key={row.id}
//                   className={`${
//                     rIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <td
//                       key={cell.id}
//                       className="px-5 py-3 border-t border-gray-200"
//                     >
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length || 1}>
//                   <p className="text-center py-5 text-gray-500">
//                     No matching data found
//                   </p>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between gap-4 mt-6 text-sm">
//         {/* Left controls */}
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//             className="px-3 py-1 rounded-md border hover:bg-blue-100 
//                        disabled:opacity-50 disabled:hover:bg-transparent"
//           >
//             ⏮ First
//           </button>
//           <button
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="px-3 py-1 rounded-md border hover:bg-blue-100 
//                        disabled:opacity-50 disabled:hover:bg-transparent"
//           >
//             ◀ Prev
//           </button>
//         </div>

//         {/* Middle controls */}
//         <div className="flex items-center gap-3">
//           <span>
//             Page{" "}
//             <strong>
//               {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//             </strong>
//           </span>

//           <span>| Go to page:</span>
//           <input
//             type="number"
//             defaultValue={table.getState().pagination.pageIndex + 1}
//             onChange={(e) => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               table.setPageIndex(page);
//             }}
//             className="w-16 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <select
//             value={table.getState().pagination.pageSize}
//             onChange={(e) => table.setPageSize(Number(e.target.value))}
//             className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {[5, 10, 20, 50].map((size) => (
//               <option key={size} value={size}>
//                 Show {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Right controls */}
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="px-3 py-1 rounded-md border hover:bg-blue-100 
//                        disabled:opacity-50 disabled:hover:bg-transparent"
//           >
//             Next ▶
//           </button>
//           <button
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//             className="px-3 py-1 rounded-md border hover:bg-blue-100 
//                        disabled:opacity-50 disabled:hover:bg-transparent"
//           >
//             Last ⏭
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;
