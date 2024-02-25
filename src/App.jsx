import './App.css'
import ActiveTab from './components/activeTab';
import DragDropComponent from './components/drag'
import { ActiveTabsProvider } from './components/activeTabsContext';

const App = () => {
 
  return (
    <>
      <ActiveTabsProvider>
        {/* <ActiveTab/> */}
        <DragDropComponent/>
      </ActiveTabsProvider>
    </>
  );

}


export default App
