import DragDropComponent from './components/main/drag'
import { ChromeTabsProvider } from './components/main/chromeTabsContext';
import { GroupsProvider } from './components/main/groupContext';
import { ThemeProvider } from './components/main/themeContext';

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
