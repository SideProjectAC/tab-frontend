import DragDropComponent from "./components/main/Drag";
import { ChromeTabsProvider } from "./components/useContext/ChromeTabsContext";
import { GroupsProvider } from "./components/useContext/GroupContext";
import { ThemeProvider } from "./components/useContext/ThemeContext";
import PopupDrag from "./components/popup/PopupDrag";
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/login/Register";

function determineContext() {
  const views = chrome.extension.getViews({ type: "popup" });
  const token = localStorage.getItem("authToken");
  if (views.length > 0 && window === views[0]) {
    return "/popup";
  } else if (!token) return "/login";
  return "/main";
}

const App = () => {
  const initialPath = determineContext();
  window.addEventListener("storage", (event) => {
    if (event.key === "needReload" && event.newValue === "true") {
      window.location.reload();
      localStorage.removeItem("needReload");
    }
  });

  return (
    <Router initialEntries={[initialPath]}>
      <ThemeProvider>
        <GroupsProvider>
          <ChromeTabsProvider>
            <Routes>
              <Route path="/popup" element={<PopupDrag />} />
              <Route path="/main" element={<DragDropComponent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </ChromeTabsProvider>
        </GroupsProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
