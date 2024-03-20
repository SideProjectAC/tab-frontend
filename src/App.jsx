import DragDropComponent from './components/main/drag'
import { ChromeTabsProvider } from './components/main/chromeTabsContext';
import { GroupsProvider } from './components/main/groupContext';

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
