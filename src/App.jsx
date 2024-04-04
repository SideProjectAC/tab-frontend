import DragDropComponent from './components/main/drag'
import { ChromeTabsProvider } from './components/useContext/chromeTabsContext';
import { GroupsProvider } from './components/useContext/groupContext';
import { ThemeProvider } from './components/useContext/themeContext';
import { MemoryRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Login from './components/login/login';
import Register from './components/login/register';


const App = () => {
 
  return (
    <Router>
      <ThemeProvider>
        <GroupsProvider>
          <ChromeTabsProvider>
            <Routes>
              <Route path="/main" element={<DragDropComponent/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </ChromeTabsProvider>
        </GroupsProvider>
      </ThemeProvider>
    </Router>
  );

}


export default App
