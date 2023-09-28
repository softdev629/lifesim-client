import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import CreateChatbotPage from "./pages/admin/createchatbot.page";

function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path="admin">
          <Route path="chatbot">
            <Route path="create" element={<CreateChatbotPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
