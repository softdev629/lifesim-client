import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import CreateChatbotPage from "./pages/admin/createchatbot.page";
import BotlistPgae from "./pages/botlist.page";
import ChatbotPage from "./pages/chatbot.page";

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
        <Route path="/" element={<BotlistPgae />} />
        <Route path="/chatbot/:slug">
          <Route index element={<ChatbotPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
