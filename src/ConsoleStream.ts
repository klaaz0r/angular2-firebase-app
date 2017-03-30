import { omit } from 'ramda'

const TRACE = 10
const DEBUG = 20
const INFO = 30
const WARN = 40
const ERROR = 50
const FATAL = 60
const LEVEL_NAMES = {
  'trace': TRACE,
  'debug': DEBUG,
  'info': INFO,
  'warn': WARN,
  'error': ERROR,
  'fatal': FATAL
}
const REC_KEYS = ['level', 'name', 'msg', 'levelName', 'pid', 'time', 'v']

var nameFromLevel = {}
Object.keys(LEVEL_NAMES).forEach(function(name) {
  nameFromLevel[LEVEL_NAMES[name]] = name
})

function padZeros(number, len) {
  return Array((len + 1) - (number + '').length).join('0') + number
}

export default class ConsoleStream {
  write(rec) {
    var loggerName = rec.childName ? rec.name + '/' + rec.childName : rec.name

    // get level name and pad start with spacs
    var levelName = nameFromLevel[rec.level].toUpperCase()
    levelName = Array(6 - levelName.length).join(' ') + levelName

    var levelCss
    var defaultCss = 'color: DimGray'
    var msgCss = 'color: SteelBlue'

    if (rec.level < DEBUG) {
      levelCss = 'color: DeepPink'
    } else if (rec.level < INFO) {
      levelCss = 'color: GoldenRod'
    } else if (rec.level < WARN) {
      levelCss = 'color: DarkTurquoise'
    } else if (rec.level < ERROR) {
      levelCss = 'color: Purple'
    } else if (rec.level < FATAL) {
      levelCss = 'color: Crimson'
    } else {
      levelCss = 'color: Black'
    }

    var others = omit(REC_KEYS, rec)
    var rest = Object.keys(others).length ? others : ''

    /* eslint-disable no-console */
    console.log('[%s:%s:%s:%s] %c%s%c: %s: %c%s',
      padZeros(rec.time.getHours(), 2), padZeros(rec.time.getMinutes(), 2),
      padZeros(rec.time.getSeconds(), 2), padZeros(rec.time.getMilliseconds(), 4),
      levelCss, levelName,
      defaultCss, rest.context || loggerName,
      msgCss, rec.msg, rest)
  }
}
