import { useState, useEffect, useContext } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faArrowRightFromBracket , faUser} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from './themeContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../scss/main/drag.scss'
import {fetchGroupsAPI} from '../../api/groupAPI';
import { useDragDrop } from './handleDragDrop';


function DragDropComponent() {
    const [activeTabs, setActiveTabs] = useState([]);
    const {groups , setGroups} = useGroups()
    const {chromeTabs} = useChromeTabs()
    const {theme, setTheme} = useContext(ThemeContext);
    
    //有關dragDrop的function拉到 useDragDrop.jsx 裡面
    const {handleDragStart, handleDragOver, handleDrop, handleAddGroup} = useDragDrop(activeTabs, groups, setGroups, setActiveTabs);

    

    //切換theme
    const toggleTheme = () => {
        setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        return newTheme;
    });
    }

    useEffect(() => {
        //setActiveTabs從chromeTabs取得目前正打開的ActiveTabs
        setActiveTabs(chromeTabs);
        //設定theme
        document.documentElement.setAttribute('data-theme', theme);
    },[chromeTabs,theme])
    
    
    //這只是debug用，可抓取後端資料(GET api) ，同時比對前端的groups 和 activeTabs
    function handleFetch() {
        const fetchData = async () => {
            const response = await fetchGroupsAPI();
            console.log('Groups fetched from Backend: ', response.data);
        }
        fetchData()
        console.log('frontEnd groups',groups)
        console.log('activeTabs',activeTabs)
     
    }


    return (
    <>
        <div className='wrapper'>
            <ActiveTabs
                activeTabs={activeTabs}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
            />
            <div className='mainRight'>
                <div className='header'>
                    <div className='searchBar'> search bar </div>
                    <div className='headerButtons'>
                        <div className='iconWrapper themeIcon' onClick={toggleTheme}>
                            <FontAwesomeIcon icon={faCircleHalfStroke} />
                        </div>
                        <div className='iconWrapper logoutIcon'>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </div>
                        <div className='iconWrapper userIcon'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                </div>
                <Groups
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                />
            </div>
        </div>
        <button onClick={() => handleFetch()} > fetch Data</button>
        <button onClick={handleAddGroup}>addGroup</button>
    </>
    );
}

export default DragDropComponent;
