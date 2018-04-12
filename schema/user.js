const mongoose = require('mongoose')
const bcrypt	 = require('bcryptjs')
const Utils 	 = require('../utils.js')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	uid: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	created_at: Date,
	updated_at: Date
})

UserSchema.pre("save", function(next) {
	var currDate = new Date()
	if(!this.created_at) {
		this.created_at = currDate
		this.uid = Utils.createUid();
	}
	this.updated_at = currDate
	
	if(this.password){
		bcrypt.hash(this.password, 10, (err, hash) => {
			this.password = hash
			next()
		})
	}
	else {
		next()
	}
})

UserSchema.post('find', function(result) {
  result = result.filter(function (x) {
  	delete x['password']
  	return x
  })
})

let User = mongoose.model("user", UserSchema)
module.exports = User