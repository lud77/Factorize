import React, { useRef } from 'react';
import BareConnector from './BareConnector';

import { Props } from '../../../../types/Props';
import { Point } from '../../../../types/Point';
import { getBounds } from '../../../../domain/Measures';

/**
 * Connect elements with svg paths
 * @param el1 first element (HTML or React component)
 * @param el2 second element (HTML or React component)
 * @param shape s | line | narrow-s
 * @param grid number of columns in X/Y axis from the start point to the end point
 * @param stem min distance from the start point to the first transition
 * @param minStep radius of the transition curve, default is min of (deltaX/grid, deltaY/grid)
 * @param roundCorner true to have a curve transition
 * @param stroke color of the svg path
 * @param strokeWidth width of the svg path
 * @param startArrow true to have an arrow at the start point (not applicable for s shape)
 * @param endArrow true to have an arrow at the end point (not applicable for s shape)
 * @param arrowSize size of arrows
 */

const Connector = (props: Props) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const getStartCoords = (el) => {
        const { right, top, height } = getBounds(el);

        return {
            x: right,
            y: top + height / 2
        };
    };

    const getEndCoords = (el) => {
      const { left, top, height } = getBounds(el);

      return {
          x: left,
          y: top + height / 2
      };
    };

    const transformCoords = (workArea: Element) => (p: Point): Point => {
      const { x, y } = p;
      const { top, left } = workArea.getBoundingClientRect();

      const offsetLeft = left + window.scrollX;
      const offsetTop = top + window.scrollY;

      return {
          x: x - offsetLeft,
          y: y - offsetTop
      };
    };

    const getNewCoordinates = (transformer) => {
        const start = props.coordsStart ? props.coordsStart : getStartCoords(props.el1);
        const end = props.coordsEnd ? props.coordsEnd : getEndCoords(props.el2);

        return {
            start: transformer(start),
            end: transformer(end)
        };
    };

    if (!props.el1 && !props.coordsStart) return null;
    if (!props.el2 && !props.coordsEnd) return null;

    const coordinates = getNewCoordinates(transformCoords(props.workArea.current));

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'absolute',
                top: 0,
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px',
                pointerEvents: 'none'
            }}
        >
            <BareConnector
                {...props}
                startPoint={coordinates.start}
                endPoint={coordinates.end}
                stem={props.stem}
                grids={props.grids}
                roundCorner={props.roundCorner}
                minStep={props.minStep}
                startArrow={props.startArrow}
                endArrow={props.endArrow}
                arrowSize={props.arrowSize}
            />
        </div>
    );
};

export default Connector;