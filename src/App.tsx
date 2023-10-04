import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import CreateChatbotPage from "./pages/admin/createchatbot.page";
import BotlistPgae from "./pages/botlist.page";
import ChatbotPage from "./pages/chatbot.page";
import Layout from "./components/Layout";
import LandingPage from "./pages/landing.page";

function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="admin">
            <Route path="chatbot">
              <Route path="create" element={<CreateChatbotPage />} />
            </Route>
          </Route>
          <Route path="chatbots">
            <Route index element={<BotlistPgae />} />
            <Route path=":slug" element={<ChatbotPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
