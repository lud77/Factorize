const Measures = (params) => {
	const {
		workAreaOffset,
		panelCoords
	} = params;

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
		if (testCoords.left < areaCoords.left) return false;
		if (testCoords.top < areaCoords.top) return false;
		if (testCoords.right > areaCoords.right) return false;
		if (testCoords.bottom > areaCoords.bottom) return false;
		return true;
	};

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

	const computeEpCoords = (panel, panelCoord, setPanelCoords) => {
		const inputEpCoords =
			Object.values<number>(panel.inputRefs)
				.map((epRef) => {
					const epEl = getEndpointElByRef(epRef);
					if (!epEl) return null;
					return [epRef, epEl, true];
				});

		const outputEpCoords =
			Object.values<number>(panel.outputRefs)
				.map((epRef) => {
					const epEl = getEndpointElByRef(epRef);
					if (!epEl) return null;
					return [epRef, epEl, false];
				});

		const epCoords =
			inputEpCoords.concat(outputEpCoords)
				.filter(Boolean)
				.map(([epRef, epEl, isInput]) => [epRef, (isInput ? middleLeftEl : middleRightEl)(epEl)])
				.map(([epRef, pos]) => [
					epRef, {
						x: pos.x - panelCoord.left - workAreaOffset[0],
						y: pos.y - panelCoord.top - workAreaOffset[1]
					}
				]);

		if (!epCoords.length) return;

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

	const computeCenter = (panelIds, selection = null) => {
		const panels = (panelIds == null)
			? selection
			: panelIds.toArray().map((panelId) => panelCoords[panelId]);

		if (panels.length == 0) return null;

		const totalX = panels.reduce((a, v) => a + v.left + v.width / 2, 0);
		const totalY = panels.reduce((a, v) => a + v.top + v.height / 2, 0);

		return {
			x: totalX / panels.length,
			y: totalY / panels.length
		};
	};

	const getPanelBoundingBox = (panelId) => {
		const panelCoord = panelCoords[panelId];

		return {
			left: workAreaOffset[0] + panelCoord.left,
			top: workAreaOffset[1] + panelCoord.top,
			right: workAreaOffset[0] + panelCoord.left + (panelCoord.isCollapsed ? 120 : panelCoord.width) - 1,
			bottom: workAreaOffset[1] + panelCoord.top + (panelCoord.isCollapsed ? 22 : panelCoord.height) - 1,
		};
	};

	const getConnectionBuilderCoords = (connectorAnchor) => {
		if ((connectorAnchor != null && connectorAnchor.fromRef != null)) return {
			start: middleRightEl(getEndpointElByRef(connectorAnchor.fromRef)),
			end: connectorAnchor.to
		};

		if ((connectorAnchor != null && connectorAnchor.toRef != null)) return {
			start: connectorAnchor.from,
			end: middleLeftEl(getEndpointElByRef(connectorAnchor.toRef))
		};

		return null;
	};

	const getStartConnectionCoords = (connection) => {
		const panelCoord = panelCoords[connection.sourcePanelId];

		if (panelCoord.isCollapsed) return middleRight({
			right: panelCoord.left + workAreaOffset[0] + 120 - 1,
			top: panelCoord.top + workAreaOffset[1],
			height: 22
		});

		const epCoords = panelCoord.epCoords[connection.source];
		return {
			x: epCoords.x + panelCoord.left + workAreaOffset[0],
			y: epCoords.y + panelCoord.top + workAreaOffset[1]
		};
	};

	const getEndConnectionCoords = (connection) => {
		const panelCoord = panelCoords[connection.targetPanelId];

		if (panelCoord.isCollapsed) return middleLeft({
			left: panelCoord.left + workAreaOffset[0],
			top: panelCoord.top + workAreaOffset[1],
			height: 22
		});

		const epCoords = panelCoord.epCoords[connection.target];
		return {
			x: epCoords.x + panelCoord.left + workAreaOffset[0],
			y: epCoords.y + panelCoord.top + workAreaOffset[1]
		};
	};

	const getConnectionBoundingBox = (connection) => {
		const s = getStartConnectionCoords(connection);
		const t = getEndConnectionCoords(connection);

		return {
			left: Math.min(s.x, t.x) - 30,
			top: Math.min(s.y, t.y),
			right: Math.max(s.x, t.x) + 30,
			bottom: Math.max(s.y, t.y)
		};
	};


	const getVisibleObjects = (panels, connections, screenSize) => {
		const isInView = overlapsArea(screenSize);

		const panelsToRender =
			Object.keys(panels)
				.map((panelId) => {
					const boundingBox = getPanelBoundingBox(panelId);

					if (isInView(boundingBox)) return panelId;
					return null;
				})
				.filter(Boolean);

		const connectionsToRender =
			connections
				.map((connection) => {
					const boundingBox = getConnectionBoundingBox(connection);

					if (isInView(boundingBox)) return connection;
					return null;
				})
				.filter(Boolean);

		return [panelsToRender, connectionsToRender];
	};

	const getAnchorsPointsFor = (panelIds) => {
		return panelIds
			.map((panelId) => panelCoords[panelId])
			.filter(Boolean)
			.map((panelCoord) => ({
				panelId: panelCoord.panelId,
				o: {
					x: panelCoord.left,
					y: panelCoord.top
				}
			}));
	};

	return {
		getBounds,
		buildScreenSize,
		linear,
		snapping,
		overlapsArea,
		isIncludedInArea,
		middleRight,
		middleLeft,
		middleRightEl,
		middleLeftEl,
		getEndpointElByRef,
		computeEpCoords,
		getPanelBoundingBox,
		getConnectionBuilderCoords,
		getConnectionBoundingBox,
		getStartConnectionCoords,
		getEndConnectionCoords,
		selectInclusive,
		selectExclusive,
		getVisibleObjects,
		getAnchorsPointsFor,
		computeCenter
	};
};

export default Measures;