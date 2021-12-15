import app from './app'
import config from './config/config'
import logger from './config/logger'
import 'colors'
import https from 'https'
import pem from 'pem'

const runningApp = () => {
  const server = app.listen(
    config.port,
    logger.info(
      // `Server running in ${config.env} mode on port ${config.port}`.cyan
      `Server running in ${config.env} at http://localhost:${config.port}`.cyan
        .underline
    )
  )

  // Handle unhandled promise rejections
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed')
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  }
  const unexpectedErrorHandler = error => {
    logger.error(error)
    exitHandler()
  }
  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
      server.close()
    }
  })
}

// const runningAppWithPem = () => {
//   pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
//     https
//       .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
//       .listen(8888, () =>
//         console.log(
//           `Server running in ${config.env} at https://localhost:${config.port}`
//             .bold.cyan
//         )
//       )
//   })
// }

runningApp()
// runningAppWithPem()
