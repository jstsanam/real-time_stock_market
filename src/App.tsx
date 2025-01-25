import Header from "./components/Header";
import "./App.scss";
import Dashboard from "./components/Dashboard";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import StockDetailPage from "./components/stocks-detail/StockDetailPage";
import { useState } from "react";

function App() {
  const [currentStock, setCurrentStock] = useState<any>(null);
  return (
    <div className="body">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard setCurrentStock={setCurrentStock} />}
          />
          <Route
            path="/dashboard/:id"
            element={
              <StockDetailPage
                currentStock={currentStock}
                setCurrentStock={setCurrentStock}
              />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
