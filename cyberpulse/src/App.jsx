import { Routes, Route } from "react-router-dom";

import Reader from "./pages/Reader";

import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";

import Latest from "./pages/Latest";
import India from "./pages/India";
import Breaches from "./pages/Breaches";
import Malware from "./pages/Malware";
import Vulnerabilities from "./pages/Vulnerabilities";

export default function App() {
  return (
    <>
      <TopBar />

      <div className="app-layout">
        <Sidebar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Latest />} />
            <Route path="/india" element={<India />} />
            <Route path="/breaches" element={<Breaches />} />
            <Route path="/malware" element={<Malware />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/reader" element={<Reader />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
