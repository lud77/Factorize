import * as React from 'react';

import './ContextMenu.css';

const ContextMenu = (props) => {
    const handleClick = (e) => {
        e.stopPropagation();


        console.log('ContextMenu handleClick');

        props.setContextMenuData(null);
    };

    return <>
        <ul
            className="ContextMenu"
            style={{ left: props.left, top: props.top }}
            onClick={handleClick}
            >
            {
                props.items.map((item, key) => (
                    <li key={key} className="Item" onClick={item.handler}>
                        <span className="Icon">{item.icon}</span>
                        <span className="Label">{item.label}</span>
                    </li>
                ))
            }
        </ul>
    </>;
};

export default ContextMenu;