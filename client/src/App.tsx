import "./App.css";
import IDFetch from "./pages/IDFetch";
import { BrowserRouter, Routes, Route } from "react-router";
import IDList from "./pages/IDList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IDFetch />} />
        <Route path="/idlist" element={<IDList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
