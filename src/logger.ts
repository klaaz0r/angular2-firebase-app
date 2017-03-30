import * as bunyan from 'browser-bunyan'
import { isEmpty } from 'ramda'

import ConsoleStream from './ConsoleStream'

const logger = bunyan.createLogger({
  name: 'APP',
  streams: [
    {
      level: 'trace',
      stream: new ConsoleStream()
    }
  ],
  serializers: bunyan.stdSerializers,
  src: false
});

export default function log(level, message, data = {}): void {
  if (isEmpty(data)) {
    // if objects are not included just log message
    logger[level](message)
  } else {
    logger[level]({ data }, message)
  }
}
