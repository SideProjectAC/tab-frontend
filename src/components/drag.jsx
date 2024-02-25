import { useEffect, useState } from 'react';
import { useActiveTabs } from './activeTabsContext'
import TabItem from './tabItem';

function DragDropComponent() {
    
    const {tabs} = useActiveTabs()
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(tabs)
    },[tabs])

    const [droppedItems, setDroppedItems] = useState({ zone1: [], zone2: [] ,zone3:[]});

    const handleDragStart = (e, itemId, originZone) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("originZone", originZone);
    };

    const handleDrop = (e, targetZone) => {
        e.preventDefault();
        // const itemId = e.dataTransfer.getData("itemId");
        const itemId = parseInt(e.dataTransfer.getData("itemId"), 10);
        const originZone = e.dataTransfer.getData("originZone");

        if (originZone === targetZone) {
            return; // Item dropped in the same zone it was dragged from
        }

        // Moving item from one zone to another (or back to the original list)
        let draggedItem;
        if (originZone === 'items') {
            draggedItem = items.find(item => item.id === itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } else {
            draggedItem = droppedItems[originZone].find(item => item.id === itemId);
            setDroppedItems(prev => ({
                ...prev,
                [originZone]: prev[originZone].filter(item => item.id !== itemId)
            }));
        }

        if (targetZone === 'items') {
            setItems(prev => [...prev, draggedItem]);
        } else {
            setDroppedItems(prev => ({
                ...prev,
                [targetZone]: [...prev[targetZone], draggedItem]
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }} 
            onDrop={(e) => handleDrop(e, 'items')} 
            onDragOver={handleDragOver}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        id={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id, 'items')}
                    >
                        <TabItem tab={item} /> 
                     </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {['zone1', 'zone2','zone3'].map(zone => (
                    <div
                        key={zone}
                        onDrop={(e) => handleDrop(e, zone)}
                        onDragOver={handleDragOver}
                        style={{ width: '40%', minHeight: '100px', padding: '10px', border: '2px dashed blue' }}
                    >
                        Drop items here ({zone})
                        <div>
                            {droppedItems[zone].map(item => (
                                <div 
                                    key={item.id} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, item.id, zone)}
                                    style={{ margin: '10px', padding: '10px', border: '1px solid green' }}
                                >
                                    <TabItem tab={item} /> 
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DragDropComponent;
