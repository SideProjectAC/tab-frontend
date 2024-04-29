import { createContext, useState, useContext, useEffect } from "react";
import { getGroupAPI } from "../../api/groupAPI";
import { GroupsProviderPropTypes } from "../main/PropTypes";

const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);

  async function loadGroups() {
    try {
      const response = await getGroupAPI();
      // console.log('first Groups fetched: ', response.data);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  }

  useEffect(() => {
    loadGroups();
    console;
  }, []);

  return (
    <GroupsContext.Provider value={{ groups, setGroups, loadGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

//Review this and corresponding new import
GroupsProvider.propTypes = GroupsProviderPropTypes;

export const useGroups = () => useContext(GroupsContext);
