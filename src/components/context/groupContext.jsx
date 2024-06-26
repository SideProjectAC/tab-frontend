import { createContext, useState, useContext, useEffect } from 'react'
import { getGroupAPI } from '../../api/groupAPI'
import { GroupsProviderPropTypes } from '../propTypes/propTypes'

const groupsContext = createContext()

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadGroups() {
    setIsLoading(true)
    try {
      const response = await getGroupAPI()
      // console.log('first Groups fetched: ', response.data);
      setGroups(response.data)
    } catch (error) {
      console.error('Error fetching groups', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  return (
    <groupsContext.Provider
      value={{ groups, setGroups, loadGroups, isLoading }}>
      {children}
    </groupsContext.Provider>
  )
}

//Review this and corresponding new import
GroupsProvider.propTypes = GroupsProviderPropTypes

export const useGroups = () => useContext(groupsContext)
