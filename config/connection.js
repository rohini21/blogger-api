var mongoose = require('mongoose')

//connect with db
mongoose.connect('mongodb://localhost/blogger')
mongoose.Promise = Promise

var db = mongoose.connection
db.on('error', function(err) {
  console.log(err)
  console.log('error while connecting to DB')
})
db.once('open', function(callback) {
  console.log('database connection established')
})