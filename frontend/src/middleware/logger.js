// A simple logger that keeps track of what happens in the app, using localStorage

export function logEvent(eventName, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = { event: eventName, data, timestamp };
  const allLogs = JSON.parse(localStorage.getItem('appLogs')) || [];
  allLogs.push(logEntry);
  localStorage.setItem('appLogs', JSON.stringify(allLogs));
}