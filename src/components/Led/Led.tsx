import React from 'react';

import './Led.css';

const Led = (props) => {
    if (props.status != null) return <div className={`Led ${props.status}`}></div>;

    const hue = Math.round(props.hue);

    const bulb = `hsl(${hue}, 100%, 95%)`;
    const halo = `hsl(${hue}, 100%, 50%)`;

    const style = {
        boxShadow: `0 0 4px ${bulb}, 0 0 8px ${bulb}, 0 0 13px ${bulb}, 0 0 16px ${halo}, 0 0 25px ${halo}, 0 0 30px ${halo}`,
        backgroundColor: bulb
    };

    return <div className={`Led Custom`} style={ style }></div>;
};

export default Led;