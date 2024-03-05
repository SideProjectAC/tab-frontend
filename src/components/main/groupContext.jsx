import  { createContext, useState, useContext, useEffect } from 'react';
import { fetchGroupsAPI } from '../../api/groupAPI';

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {

    const [groups, setGroups] = useState([]);

     async function loadGroups() {
        try {
        const response = await fetchGroupsAPI();
        // console.log('first Groups fetched: ', response.data);
        setGroups(response.data)
        } catch (error) {
        console.error('Error fetching groups', error);
        }
    }

    useEffect(() => {
        loadGroups();
    }, []); 
    
  
  return (
    <GroupsContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupsContext.Provider>
  );
}


 
export const useGroups = () => useContext(GroupsContext);
