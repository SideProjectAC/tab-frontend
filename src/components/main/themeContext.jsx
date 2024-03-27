import { createContext, useState } from "react";
import { ThemeProviderPropTypes } from './propTypes.jsx'

const ThemeContext = createContext({theme:'light', undefined});

const ThemeProvider = ({children}) => {
    const localTheme = localStorage.getItem('theme');
    const [theme, setTheme] = useState(localTheme || 'light');
    return (
      <ThemeContext.Provider value={{theme, setTheme}}>
        {children}
      </ThemeContext.Provider>
    )
}

//Review this and corresponding new import
ThemeProvider.propTypes = ThemeProviderPropTypes

export { ThemeContext, ThemeProvider }