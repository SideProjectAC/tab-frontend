import { createContext, useState } from "react";

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

export { ThemeContext, ThemeProvider }