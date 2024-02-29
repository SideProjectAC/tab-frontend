import  { createContext, useState, useContext } from 'react';

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {

    const [groups, setGroups] = useState([
      // {group_id:1 ,group_icon:"🍔",group_title: 'group1' , items:[] }
    ]);

    // const handleAddGroup = (newGroupId) => {
    //     setGroups(prev => [
    //         ...prev,
    //         { group_id: newGroupId,group_icon:"🍔", group_title: `group${newGroupId}`, items: [] }
    //     ]);
    // };
  
  return (
    <GroupsContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupsContext.Provider>
  );
}


 
export const useGroups = () => useContext(GroupsContext);
