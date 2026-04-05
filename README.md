# Finance Dashboard UI

A modern, responsive, and interactive Finance Dashboard UI built for evaluation purposes. It demonstrates a clean architecture, robust state management, and a premium aesthetic using React and Tailwind CSS.

## 🚀 Live Demo (Local)

To run the project locally, ensure you have Node.js installed, then execute:

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🛠 Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) for blazing-fast development and optimized production builds.
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) using a custom design system token approach. Features glassmorphism and fully supports Light/Dark mode.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/). Lightweight and boiler-plate free. The data is persisted locally using Zustand's `persist` middleware, so any changes survive page refreshes.
- **Charts**: [Recharts](https://recharts.org/). Used to build the Cash Flow Area Chart and the Expenses Breakdown Pie Chart.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Routing**: [React Router DOM v6](https://reactrouter.com/) for a clean SPA experience.

## ✨ Core Features

1. **Dashboard Overview**: 
   - Displays key metrics: Total Balance, Total Income, and Total Expenses.
   - Includes two responsive data visualizations: A time-based Cash Flow Trend (Area Chart) and a categorical Expenses Breakdown (Donut Chart).
2. **Transactions Management**: 
   - View a comprehensive list of dummy financial transactions.
   - Filter transactions based on type (Income/Expense) or search by keyword.
3. **Role-Based Access Control (RBAC) Simulation**:
   - The UI adapts based on the active role (Viewer vs. Admin).
   - *Viewer*: Read-only access to all data.
   - *Admin*: Can Add, Edit, or Delete transactions.
   - Use the Role dropdown in the sidebar (or bottom nav on mobile) to instantly switch perspectives.
4. **Insights Engine**:
   - Compares the current month's spending vs. last month's spending, highlighting percentage differences.
   - Identifies the highest spending category over the transaction history.

## 🎨 UI & UX Focus
- **Premium Aesthetics**: Defaults to a tailored Dark Theme using deep slate hues and vibrant emerald (income) / rose (expense) accents.
- **Glassmorphism**: Subtle translucency on panels to give the dashboard a modern, layered appearance.
- **Responsiveness**: Fully fluid design. Desktop users get a sticky sidebar, while mobile users get a clean top app bar and a fixed bottom navigation bar for easy thumb access.

## 👤 Author Assessment Notes
The assignment parameters mention using flexibility to solve the UI requirements. I opted for Zustand + LocalStorage since it allows for full interactivity (Admins can really test adding data and seeing it change the charts instantly) without needing a backend.
