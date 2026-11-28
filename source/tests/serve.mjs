import http from 'http'
import fs from 'fs'
import path from 'path'
const dist = path.join(process.cwd(), 'dist')
const mime = { '.html': 'text/html', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' }
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p === '/admin' || p === '/admin/') p = '/index.html'
  if (p === '/') p = '/index.html'
  const file = path.join(dist, p)
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(4173, () => console.log('serving on 4173'))
