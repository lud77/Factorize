import * as React from 'react';
import { flushSync } from 'react-dom';

import './ComboBox.css';

const ComboBox = (props) => {
    const [ search, setSearch ] = React.useState('');
    const [ list, setList ] = React.useState([]);
    const inputRef = React.useRef();

    React.useEffect(() => {
        inputRef.current.focus();

        if (search == '' && list.length === 0) {
            const sieve = getSieve(props.side, props.signal, props.type);

            setList(props.items.filter(sieve));
        }
    });

    const areEndpointsCompatible = (ep1, ep2) => {
        const isPulse = ep1.signal === 'Pulse' && ep2.signal === 'Pulse';
        const areSignalsCompatible = ep1.signal === ep2.signal;
        const areTypesCompatible = ep1.type === 'any' || ep2.type === 'any' || ep1.type === ep2.type;

        return isPulse || (areSignalsCompatible && areTypesCompatible);
    };

    const getSieve = (side, signal, type) => {
        if (!side) return () => true;

        if (side === 'input') {
            return (panelFactory) => {
                return (panelFactory.inputEndpoints || []).find((epDef) => areEndpointsCompatible(epDef, { signal, type }));
            };
        }

        return (panelFactory) => {
            return (panelFactory.outputEndpoints || []).find((epDef) => areEndpointsCompatible(epDef, { signal, type }));
        };
    };

    const handleChange = (e) => {
        setSearch(e.target.value);

        const sieve = getSieve(props.side, props.signal, props.type);

        if (e.target.value == '') {
            setList(props.items.filter(sieve));
            return;
        }

        const compatiblePanels =
            props.index
                .search(e.target.value)
                .map((ndx) => props.items[ndx])
                .filter(sieve);

        setList(compatiblePanels);
    };

    const handleItemClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const [newPanel, newPanelCoords] = props.addPanel(e.target.innerText, { x: props.left, y: props.top });
        props.setSearchBoxData(null);

        if (!props.side) return;

        setTimeout(() => {
            const otherEndpoint = { signal: props.signal, type: props.type };

            if (props.side === 'input') {
                const firstCompatibleEp = newPanel.inputEndpoints.find((endpoint) => areEndpointsCompatible(endpoint, otherEndpoint));

                const toRef = newPanel.inputRefs[`input${firstCompatibleEp.name}`];

                const newConnection = props.machine.makeConnection(props.connectorAnchor.fromRef, toRef, props.connectorAnchor.fromPanelId, newPanel.panelId);
                props.machine.executePanelLogic(props.connectorAnchor.fromPanelId);

                if (newConnection) {
                    flushSync(() => {
                        props.setConnections((connections) => [
                            ...connections,
                            newConnection
                        ]);
                    });
                }
            }

            if (props.side === 'output') {
                const firstCompatibleEp = newPanel.outputEndpoints.find((endpoint) => areEndpointsCompatible(endpoint, otherEndpoint));

                const fromRef = newPanel.outputRefs[`output${firstCompatibleEp.name}`];

                const newConnection = props.machine.makeConnection(fromRef, props.connectorAnchor.toRef, newPanel.panelId, props.connectorAnchor.toPanelId);

                if (newConnection) {
                    flushSync(() => {
                        props.setConnections((connections) => [
                            ...connections,
                            newConnection
                        ]);
                    });
                }
            }

            props.setConnectorAnchor(null);
            props.redraw(Math.random());
        }, 1);
    };

    const backdropClick = (e) => {
        e.stopPropagation();
        if (!e.target.classList.contains('Backdrop')) return;

        props.setConnectorAnchor(null);
        props.setSearchBoxData(null);
    };

    return <>
        <div className="ComboBox Backdrop" onClick={backdropClick}>
            <div
                className="Content"
                style={{ left: props.left, top: props.top }}
                >
                <div className="Search">
                    <input ref={inputRef} type="text" placeholder="Search..." defaultValue={search} onChange={handleChange} />
                </div>
                {
                    list.length > 0
                        ? <>
                            <ul className="Results">
                            {
                                list.map((item, key) => (
                                    <li key={key} className="Item" onClick={handleItemClick}>{item.type}</li>
                                ))
                            }
                            </ul>
                        </>
                        : <div className="EmptySearch">{props.emptySearchMessage}</div>
                }
            </div>
        </div>
    </>;
};

export default ComboBox;