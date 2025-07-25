import * as log4js from 'log4js'
import {
  getLogger,
  configure,
  isConfigured,
  shutdown,
  connectLogger,
  levels,
  addLayout,
  recording,
} from 'log4js'

export {
  getLogger,
  configure,
  isConfigured,
  addLayout,
  connectLogger,
  recording,
  shutdown,
  levels,
  log4js,
  log4js as default,
}

export type {
  Log4js,
  BasicLayout,
  ColoredLayout,
  MessagePassThroughLayout,
  DummyLayout,
  Level,
  CallStack,
  LoggingEvent,
  Token,
  PatternLayout,
  CustomLayout,
  Layout,
  CategoryFilterAppender,
  NoLogFilterAppender,
  ConsoleAppender,
  FileAppender,
  SyncfileAppender,
  DateFileAppender,
  LogLevelFilterAppender,
  MultiFileAppender,
  MultiprocessAppender,
  RecordingAppender,
  StandardErrorAppender,
  StandardOutputAppender,
  TCPAppender,
  CustomAppender,
  Appenders,
  AppenderModule,
  AppenderFunction,
  Config,
  LayoutsParam,
  PatternToken,
  LayoutFunction,
  Appender,
  Levels,
  Configuration,
  Recording,
  Logger,
} from 'log4js'