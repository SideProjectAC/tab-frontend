import './App.css'
// import ActiveTab from './components/activeTab';
import DragDropComponent from './components/drag'
import { ActiveTabsProvider } from './components/activeTabsContext';
import { GroupsProvider } from './components/groupContext';

const App = () => {
 
  return (
    <>
      <GroupsProvider>
        <ActiveTabsProvider>
          {/* <ActiveTab/> */}
          <DragDropComponent/>
        </ActiveTabsProvider>
      </GroupsProvider>
    </>
  );

}


export default App
