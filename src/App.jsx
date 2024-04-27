import DragDropComponent from "./components/main/drag";
import { ChromeTabsProvider } from "./components/useContext/chromeTabsContext";
import { GroupsProvider } from "./components/useContext/groupContext";
import { ThemeProvider } from "./components/useContext/themeContext";
import PopupDrag from "./components/popup/popupDrag";
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/login/register";

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
