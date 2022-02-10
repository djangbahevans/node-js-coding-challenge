const {
  createLogger,
  transports,
  format
} = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: new transports.File({
    filename: path.join(__dirname, 'logfile.log')
  }),
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, 'exceptions.log')
    }),
    new transports.Console()
  ]
});

module.exports = logger
