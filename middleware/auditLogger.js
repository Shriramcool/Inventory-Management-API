const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/audit.log');

const auditLogger = (req, res, next) => {
  const { method, originalUrl, user } = req;
  const log = `[${new Date().toISOString()}] ${method} ${originalUrl} by ${user?.id || 'Anonymous'}\n`;
  fs.appendFileSync(logFile, log);
  next();
};

module.exports = auditLogger;
