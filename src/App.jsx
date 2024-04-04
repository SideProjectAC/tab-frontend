import DragDropComponent from './components/main/drag'
import { ChromeTabsProvider } from './components/useContext/chromeTabsContext';
import { GroupsProvider } from './components/useContext/groupContext';
import { ThemeProvider } from './components/useContext/themeContext';

const App = () => {
 
  return (

      <ThemeProvider>
        <GroupsProvider>
          <ChromeTabsProvider>
            <DragDropComponent/>
          </ChromeTabsProvider>
        </GroupsProvider>
      </ThemeProvider>
  );

}


export default App
