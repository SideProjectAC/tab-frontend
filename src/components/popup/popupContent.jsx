
function PopupContent () {

  let currentTab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTab = tabs[0];
    console.log('currentTab',currentTab)
  })
  return (
    <>
    <div id="mydivheader">Click here to move</div>
        <div className='tabInfo'>
          <div>{currentTab}</div>
          <div>tab icon</div>
          <h2>currentTab.title</h2>
          <div>currentTab.url</div>
        </div>
        <form>
          <textarea placeholder='New note'></textarea>
        </form>
        <div className='buttons'>
          <i className="fa-solid fa-circle-half-stroke" id='darkLight'></i>
          <i className="fa-solid fa-list" id='changeMode'></i>
          <i className="fa-solid fa-palette" id='changeColor'></i>
          <i className="fa-solid fa-map-pin" id='pinTab'></i>
          <button>Save</button>
        </div>
    </>
        
  )
}

export default PopupContent