const User = require("../schema/user")

module.exports = {
	session(req, res) {
		if(!req.user)
			return res.status(422).json({error: "Access denied."})
		return res.status(200).json(req.user)
	},
	logout(req, res) {
		req.logout()
		return res.status(200).end()
	},
	login(req, res) {
  	delete req.user.password
		res.status(200).json(req.user)
	},
	create(req, res) {
		var userData = new User(req.body.user)
		return userData
		.save()
		.then(user => {
			return res.status(200).json(user)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getAll(req, res) {
		return User.where("username", new RegExp(req.query.term))
		.then(users => {
			return res.status(200).json(users)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	deleteAll(req, res) {
		return User.remove()
		.then(users => {
			return res.status(200).json(users)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	update(req, res) {
		var userData = new User(req.body.user)
		return userData
		.save()
		.then(user => {
			return res.status(200).json(user)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getOne(req, res) {
		return User.find({uid: req.params.uid})
		.then(users => {
			return res.status(200).json(users)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	deleteOne(req, res) {
		return User.find({uid: req.params.uid})
		.remove()
		.then(user => {
			return res.status(200).json(user)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	}
}
