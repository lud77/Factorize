import * as React from 'react';

import './Marquee.css'

const Marquee = (props) => {
    const { dragCoords } = props;

    return (
        <div className="Marquee" style={{ 
            left: dragCoords.o?.x, 
            top: dragCoords.o?.y,  
            width: dragCoords.c?.x - dragCoords.o?.x,
            height: dragCoords.c?.y - dragCoords.o?.y
        }}>

        </div>
    );
};

export default Marquee;