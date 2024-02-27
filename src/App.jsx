import './App.css'
// import ActiveTab from './components/activeTab';
import DragDropComponent from './components/drag'
import { ChromeTabsProvider } from './components/activeTabsContext';
import { GroupsProvider } from './components/groupContext';

const App = () => {
 
  return (
    <>
      <GroupsProvider>
        <ChromeTabsProvider>
          {/* <ActiveTab/> */}
          <DragDropComponent/>
        </ChromeTabsProvider>
      </GroupsProvider>
    </>
  );

}


export default App
