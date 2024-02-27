import  { createContext, useState, useContext } from 'react';

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {

    const [groups, setGroups] = useState([
      // {id:1 ,name: 'group1' , tabs:[] }
    ]);

    const handleAddGroup = (newGroupId) => {
        setGroups(prev => [
            ...prev,
            { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
        ]);
    };
  
  return (
    <GroupsContext.Provider value={{ groups, setGroups,handleAddGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}


 
export const useGroups = () => useContext(GroupsContext);
