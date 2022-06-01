import React, { useRef } from 'react';
import BareConnector from './BareConnector';
import { Props } from './Props';


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

export default function Connector(props: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    function getMeasures(el: HTMLElement) {
        const parentEl = el.offsetParent;
        const box = el.getBoundingClientRect();

        const top = box.top + window.pageYOffset + (parentEl?.scrollTop || 0);
        const right = box.right + window.pageXOffset + (parentEl?.scrollLeft || 0);
        const bottom = box.bottom + window.pageYOffset + (parentEl?.scrollTop || 0);
        const left = box.left + window.pageXOffset + (parentEl?.scrollLeft || 0);

        return {
            top,
            right,
            bottom,
            left,
            width: right - left,
            height: bottom - top
        };
    }

    function getStartCoords(el) {
        const measures = getMeasures(el);
        
        return {
            x: measures.right,
            y: measures.top + measures.height / 2
        };
    }

    function getEndCoords(el) {
      const measures = getMeasures(el);
        
      return {
          x: measures.left,
          y: measures.top + measures.height / 2
      };
    }

    function getNewCoordinates() {
        const start = props.coordsStart ? props.coordsStart : getStartCoords(props.el1);
        const end = props.coordsEnd ? props.coordsEnd : getEndCoords(props.el2);

        return { start, end };
    }

    if (!props.el1 && !props.coordsStart) return null;
    if (!props.el2 && !props.coordsEnd) return null;

    const coordinates = getNewCoordinates();

    return (
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            top: 0,
            width: window.innerWidth + 'px',
            height: window.innerHeight + 'px',
            zIndex: -1
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
}