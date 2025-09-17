# Frontend Assignment – Data Table with Filters & Pagination

This project is built as part of the **Frontend Developer Assignment**.  
It demonstrates skills in **React.js, Redux Toolkit, TanStack Table, and Tailwind CSS** to fetch, filter, search, sort, and paginate loan dataset records in a clean, professional UI.

---

## 🚀 Features

- **React + Vite** setup for fast development.
- **Redux Toolkit** for global state management and async API calls.
- **Custom Hook (`useLoans`)** to fetch and manage loan data.
- **TanStack React Table** for:
  - Dynamic column generation
  - Sorting (asc/desc)
  - Pagination with configurable page size
- **Search functionality** across all fields.
- **Filters** for:
  - Property State
  - Ownership Type
- **Error handling** with retry option.
- **Responsive & Professional UI** using Tailwind CSS.

---

## 🛠️ Tech Stack

- **React 18**
- **Redux Toolkit**
- **TanStack Table**
- **Tailwind CSS**
- **Vite**

---

## 📂 Project Structure

src/
├── App.jsx # Root component rendering the DataTable
├── index.css # Tailwind + base styles
├── main.jsx # App entry with Redux provider
│
├── components/
│ └── DataTable.jsx # Main table component with search, filter, pagination
│
├── hooks/
│ └── useLoans.js # Custom hook for fetching loan data
│
└── redux/
├── loansSlice.js # Redux slice with asyncThunk to fetch data
└── store.js # Redux store configuration


---

## 📊 Data Source

The loan dataset is fetched from a public JSON file hosted on GitHub:

https://raw.githubusercontent.com/rahulsoni-data/data/refs/heads/main/data.json


---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-folder>

## Install Dependencies
npm install