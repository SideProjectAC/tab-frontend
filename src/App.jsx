import { useEffect } from 'react'
import DragDropComponent from './components/main/Drag'
import { ChromeTabsProvider } from './components/context/chromeTabsContext'
import { GroupsProvider } from './components/context/GroupContext'
import { ThemeProvider } from './components/context/themeContext'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Login from './components/login/Login'
import Register from './components/login/Register'

const App = () => {
  useEffect(() => {
    const reloadPage = (event) => {
      localStorage.removeItem('needReload')
      if (event.key === 'needReload' && event.newValue === 'true') {
        window.location.reload()
        localStorage.removeItem('needReload')
      }
    }
    window.addEventListener('storage', reloadPage)
    return () => {
      window.removeEventListener('storage', reloadPage)
    }
  }, [])

  return (
    <Router>
      <ThemeProvider>
        <GroupsProvider>
          <ChromeTabsProvider>
            <Routes>
              <Route path='/main' element={<DragDropComponent />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </ChromeTabsProvider>
        </GroupsProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
