import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodeLayout from "./pages/CodeLayout";
import { fetchData } from "./services/backendApi";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<CodeLayout /> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
