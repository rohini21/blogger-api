const mongoose = require('mongoose')
const bcrypt	 = require('bcryptjs')
const Utils 	 = require('../utils.js')

const BlogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	uid: {
		type: String,
		unique: true
	},
	owner: {
    type: String,
		ref: "user",
		required: true
	},
	published: {
		type: Boolean,
		required: true
	},
	created_at: Date,
	updated_at: Date
})

BlogSchema.pre("save", function(next) {
	var currDate = new Date()
	if(!this.created_at) {
		this.created_at = currDate
		this.uid = Utils.createUid();
	}
	this.updated_at = currDate
	next()
})

let Blog = mongoose.model("blog", BlogSchema)
module.exports = Blog