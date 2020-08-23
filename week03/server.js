const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  let body = []
  request.on('error', err => {
    console.error(err)
  }).on('data', chunk => {
    body.push(chunk.toString)
  }).on('end', () => {
    console.log(1)
    body = body.join('')
    console.log(2)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    console.log(3)
    fs.readFile('./index.html', 'utf-8', (err, data) => {
      console.log(4)
      if (err) {
        throw err
      }
      console.log(data)
      response.end(data)
    })
  })
}).listen(8088)

console.log('server started')
