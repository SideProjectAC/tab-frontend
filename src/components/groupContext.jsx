import  { createContext, useState, useContext } from 'react';

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {

    const [groups, setGroups] = useState([
      {id:1 ,name: 'group1' , tabs:[] }
    ]);
    
    // const handleAddGroup = () => {
    //     const newGroupId = groups.length + 1; 
        
    //     setGroups(prev => [
    //         ...prev,
    //         { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
    //     ]);
    //     console.log('groups',groups)
    // };


  return (
    <GroupsContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupsContext.Provider>
  );
}
 
export const useGroups = () => useContext(GroupsContext);
