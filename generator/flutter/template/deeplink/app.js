const express = require('express')
const app = express()
const port = 5200

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/.well-known/assetlinks.json', express.static('assetlinks.json'))
app.use('/testlink', express.static('testlink.html'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})