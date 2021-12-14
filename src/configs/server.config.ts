import http from 'http'
import app from './app.config'
class ApplicationServer {
  private server: http.Server
  private port: string

  constructor(){
    this.server = new http.Server(app)
    this.port = process.env.PORT as string
  }

  init() {
    this.server.listen(this.port)
    this.server.on('error', (err) => {
      console.info(err)
    })
    this.server.on('listening', () => {
      console.info(`Your Server Running on http://localhost:${this.port}`)
    })
  }
}

export default new ApplicationServer()