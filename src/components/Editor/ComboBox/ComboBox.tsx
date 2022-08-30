import * as React from 'react';

import './ComboBox.css';

const ComboBox = (props) => {
    const [ search, setSearch ] = React.useState('');
    const [ list, setList ] = React.useState([]);

    console.log(props.searchableItems);

    const handleChange = (e) => {
        setSearch(e.target.value);

        if (search == '') {
            setList([]);
            return;
        }

        setList(props.index.search(e.target.value));
    };

    return <>
        <div
            className="ComboBox"
            style={{ left: props.left, top: props.top }}
            >
            <div className="Search">
                <input type="text" placeholder="Search..." defaultValue={search} onChange={handleChange} />
            </div>
            {
                list.length > 0
                    ? <>
                        <ul className="Results">
                        {
                            list
                                .map((item, key) => (
                                    <li key={key} className="Item" onClick={null}>{item}</li>
                                ))
                        }
                        </ul>
                    </>
                    : <div className="EmptySearch">{props.emptySearchMessage}</div>
            }
        </div>
    </>;
};

export default ComboBox;