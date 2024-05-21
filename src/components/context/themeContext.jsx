import { createContext, useState } from 'react'
import { ThemeProviderPropTypes } from '../propTypes/propTypes'

const themeContext = createContext({ theme: 'light', undefined })

const ThemeProvider = ({ children }) => {
  const localTheme = localStorage.getItem('theme')
  const [theme, setTheme] = useState(localTheme || 'light')
  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      {children}
    </themeContext.Provider>
  )
}

//Review this and corresponding new import
ThemeProvider.propTypes = ThemeProviderPropTypes

export { themeContext, ThemeProvider }
