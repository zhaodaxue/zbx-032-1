import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ArrivalDetail from "@/pages/ArrivalDetail";
import Inventory from "@/pages/Inventory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arrival/:id" element={<ArrivalDetail />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}
