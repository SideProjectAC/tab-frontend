import TabItem from "./tabItem"

function ActiveTabs({activeTabs , handleDrop, handleDragStart, handleDragOver }) {

  return(
    <div className='activeList'
      onDrop={(e) => handleDrop(e, 0)} 
      onDragOver={(e) => handleDragOver(e)}
    >
      {activeTabs.map((item) => (
        <div className='activeTab'
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id, 0)}
        >
          <TabItem tab={item} /> 
        </div>
      ))}
    </div>
  )
}

export default ActiveTabs