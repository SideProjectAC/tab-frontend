import TabItem from "./tabItem"
// import "../../styles/main/activeTab.css"

function ActiveTabs({activeTabs , handleDrop, handleDragStart, handleDragOver }) {

  return(
    <div className='activeList'
      onDrop={(e) => handleDrop(e, 'ActiveTabs')} 
      onDragOver={(e) => handleDragOver(e)}
    >
      <h1 className="activeTitle">Active Tabs</h1>
      {activeTabs.map((item) => (
        <div className='activeTab'
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id, 'ActiveTabs')}
        >
          <TabItem tab={item} groupId={'ActiveTabs'} /> 
        </div>
      ))}
    </div>
  )
}

export default ActiveTabs