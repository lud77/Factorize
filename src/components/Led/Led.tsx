import React from 'react';

import './Led.css';

const Led = (props) => {
    if (props.status != null) return <div className={`Led ${props.status}`}></div>;

    const color = `hsl(${props.hue}, 100%, 50%)`;

    const style = {
        boxShadow: `0 0 4px #fff, 0 0 8px #fff, 0 0 13px #fff, 0 0 16px ${color}, 0 0 25px ${color}, 0 0 30px ${color}`
    };

    return <div className={`Led Custom`} style={ style }></div>;
};

export default Led;