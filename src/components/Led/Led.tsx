import React from 'react';

import './Led.css';

const Led = (props) => {
    return <div className={`Led ${props.status}`}></div>;
};

export default Led;