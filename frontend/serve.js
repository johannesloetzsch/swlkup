const express = require('express')

const path = process.argv[2] || 'out'
const port = Number.parseInt(process.argv[3]) || 3000

const app = express()

app.use(function(req, _res, next) {
  if ((new RegExp("^\/token\/*")).test(req.url)) {
    req.url = '/token/\[token\].html';
  }
  next();
});

app.use(express.static(path))

app.listen(port, () => {
  console.log(`swlkup-frontend listening at http://localhost:${port}`)
})
