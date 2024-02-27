import './App.css'
import DragDropComponent from './components/drag'
import { ChromeTabsProvider } from './components/chromeTabsContext';
import { GroupsProvider } from './components/groupContext';

const App = () => {
 
  return (
    <>
      <GroupsProvider>
        <ChromeTabsProvider>
          <DragDropComponent/>
        </ChromeTabsProvider>
      </GroupsProvider>
    </>
  );

}


export default App
