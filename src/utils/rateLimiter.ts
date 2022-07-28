const rateLimiter = (eventName, eventProcessor, eventLog, timeframe) => {
	const limitEvents = () => eventLog.filter((ts) => Date.now() - ts < timeframe);

	const handler = (e) => {
		eventLog = limitEvents();
		eventLog.push(Date.now());

		if (eventLog.length == 4) {
			setTimeout(() => {
				// console.log(`${eventName} on timeout`, eventLog.length, Date.now());
				eventProcessor(e);
			}, timeframe);
			return;
		}

		if (eventLog.length > 5) return;
		// console.log(eventName, eventLog.length, Date.now());
		eventProcessor(e);
	};

	return handler;
};

export default rateLimiter;