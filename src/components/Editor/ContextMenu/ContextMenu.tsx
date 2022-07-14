import * as React from 'react';

import './ContextMenu.css';

const ContextMenu = (props) => {
    const handleClick = (e) => {
        e.stopPropagation();
        props.setContextMenuData(null);
    };

    return <>
        <ul
            className="ContextMenu"
            style={{ left: props.left, top: props.top }}
            onClick={handleClick}
            >
            {
                props.items
                    .filter((item) => item.tags.filter((tag) => props.tags.includes(tag)).length)
                    .map((item, key) => (
                        <li key={key} className="Item" onClick={item.handler(props.target)}>
                            <span className="Icon">{item.icon}</span>
                            <span className="Label">{item.label}</span>
                        </li>
                    ))
            }
        </ul>
    </>;
};

export default ContextMenu;