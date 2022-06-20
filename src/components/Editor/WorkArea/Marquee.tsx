import * as React from 'react';

import './Marquee.css'

const Marquee = (props) => {
    const { dragCoords } = props;

    return (
        <div className="Marquee" style={{
            left: Math.min(dragCoords.o.x, dragCoords.c.x),
            top: Math.min(dragCoords.o.y, dragCoords.c.y),
            width: Math.abs(dragCoords.o.x - dragCoords.c.x),
            height: Math.abs(dragCoords.o.y - dragCoords.c.y)
        }}>

        </div>
    );
};

export default Marquee;