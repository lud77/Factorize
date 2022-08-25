const getBounds = (el: HTMLElement) => {
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
};

const buildScreenSize = () => ({
    top: 0,
    left: 0,
	bottom: window.innerHeight - 1,
	right: window.innerWidth - 1,
    width: window.innerWidth,
    height: window.innerHeight
});

const overlapsArea = (areaCoords) => (testCoords) => {
	if (testCoords.right < areaCoords.left) return false;
	if (testCoords.bottom < areaCoords.top) return false;
	if (testCoords.left > areaCoords.right) return false;
	if (testCoords.top > areaCoords.bottom) return false;
	return true;
};

const isIncludedInArea = (areaCoords) => (testCoords) => {
	if (testCoords.left < areaCoords.Left) return false;
	if (testCoords.top < areaCoords.top) return false;
	if (testCoords.right > areaCoords.right) return false;
	if (testCoords.bottom > areaCoords.bottom) return false;
	return true;
};

const getSelectorsFor = (workAreaOffset) => {
	const getPanelWorkAreaCoords = (panelCoord) => {
		const left = panelCoord.left + workAreaOffset[0];
		const top = panelCoord.top + workAreaOffset[1];

		return {
			left,
			top,
			right: left + panelCoord.width - 1,
			bottom: top + (panelCoord.isCollapsed ? 22 : panelCoord.height) - 1
		};
	};

	const selectInclusive = (panels, panelCoords, selection) =>
		Object.values(panels)
			.map((panel) => {
				const coords = getPanelWorkAreaCoords(panelCoords[panel.panelId]);

				const isOverlapping = overlapsArea(selection)(coords);
				return isOverlapping ? panel : null;
			})
			.filter(Boolean);

	const selectExclusive = (panels, panelCoords, selection) =>
		Object.values(panels)
			.map((panel) => {
				const coords = getPanelWorkAreaCoords(panelCoords[panel.panelId]);

				const isOverlapping = isIncludedInArea(selection)(coords);
				return isOverlapping ? panel : null;
			})
			.filter(Boolean);

    return {
        selectInclusive,
        selectExclusive
    };
};

const linear = (x) => x;
const snapping = (x) => Math.floor(x / 16) * 16;

const middleRight = (coords) => {
	const { right, top, height } = coords;

	return {
		x: right,
		y: top + height / 2
	};
};

const middleLeft = (coords) => {
  const { left, top, height } = coords;

  return {
	  x: left,
	  y: top + height / 2
  };
};

const middleRightEl = (el) => {
	if (!el) return null;
	const coords = getBounds(el);
	return middleRight(coords);
};

const middleLeftEl = (el) => {
	if (!el) return null;
	const coords = getBounds(el);
	return middleLeft(coords);
};

const getEndpointElByRef = (ref: number): HTMLDivElement | null => document.querySelector(`div.Endpoint[data-ref="${ref}"]`);

const computeEpCoords = (panel, panelCoord, setPanelCoords, workAreaOffset) => {
	const epCoords =
		Object.values<number>(panel.inputRefs).concat(Object.values<number>(panel.outputRefs))
			.map((epRef) => [epRef, getEndpointElByRef(epRef)])
			.map(([epRef, epEl]) => [epRef, middleLeftEl(epEl)])
			.map(([epRef, pos]) => [
				epRef, {
					x: pos.x - panelCoord.left - workAreaOffset[0],
					y: pos.y - panelCoord.top - workAreaOffset[1]
				}
			]);

	setPanelCoords((panelCoords) => {
		return {
			...panelCoords,
			[panelCoord.panelId]: {
				...panelCoords[panelCoord.panelId],
				epCoords: Object.fromEntries(epCoords),
			}
		};
	});
};

export {
    getBounds,
    buildScreenSize,
    getSelectorsFor,
    linear,
    snapping,
	overlapsArea,
	isIncludedInArea,
	middleRight,
	middleLeft,
	middleRightEl,
	middleLeftEl,
	getEndpointElByRef,
	computeEpCoords
};