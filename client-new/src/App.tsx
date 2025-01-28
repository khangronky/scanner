import { BrowserRouter, Routes, Route } from "react-router";
import IDFetch from "./pages/IDFetch";
import IDList from "./pages/IDList";
import "./App.css";

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
