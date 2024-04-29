import DragDropComponent from "./components/main/Drag";
import { ChromeTabsProvider } from "./components/useContext/ChromeTabsContext";
import { GroupsProvider } from "./components/useContext/GroupContext";
import { ThemeProvider } from "./components/useContext/ThemeContext";
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/login/Register";

const App = () => {
  window.addEventListener("storage", (event) => {
    localStorage.removeItem("needReload");
    if (event.key === "needReload" && event.newValue === "true") {
      window.location.reload();
      localStorage.removeItem("needReload");
    }
  });

  return (
    <Router>
      <ThemeProvider>
        <GroupsProvider>
          <ChromeTabsProvider>
            <Routes>
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
