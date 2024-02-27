import TabItem from "./tabItem"
// import { useGroups } from './groupContext';

function Groups ({groups , handleDrop, handleDragOver, handleDragStart, newGroupId, handleAddGroup}) {

  // const {setGroups} = useGroups()
  // const handleAddGroup = (newGroupId) => {
  //     setGroups(prev => [
  //       ...prev,
  //       { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
  //     ]);
  //   };  


  return (
    <>
      <div className='groups'>
        {groups.map(group => (
          <div
            className='group'
            key={group.id}
            onDrop={(e) => handleDrop(e, group.id)}
            onDragOver={handleDragOver}
          >
            Drop items here ({group.name})
            <div>
              {group.tabs.map(item => (
                <div 
                  key={item.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, item.id, group.id)}
                >
                  <TabItem tab={item} /> 
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
        <div className='newGroup'
          onDrop={(e) => {
            handleAddGroup(newGroupId)
            handleDrop(e, newGroupId)
          }} 
          onDragOver={handleDragOver}
        ></div>
        {/* <button 
          onClick={() => handleAddGroup(newGroupId)}
        >
          add group
        </button> */}
    </>
  )
}

export default Groups