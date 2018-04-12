const Blog = require("../schema/blog")

module.exports = {
	create(req, res) {
		var blogData = new Blog(req.body.blog)
		return blogData
		.save()
		.then(blog => {
			return res.status(200).json(blog)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getAllPublishedBlogs(req, res) {
		return Blog.find({$and: [{"title": new RegExp(req.query.term, 'i')},{published: true}]})
		.populate({ path: 'owner', select: ['uid', 'username']})
		.then(blogs => {
			return res.status(200).json(blogs)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getUserBlogs(req, res) {
		return Blog.where("owner", new RegExp(req.params.uid))
		.populate({ path: 'owner', select: ['uid', 'username']})
		.then(blogs => {
			return res.status(200).json(blogs)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getUserPublishedBlogs(req, res) {
		return Blog.find({$and:[{"owner": new RegExp(req.params.uid)},{published: true}]})
		.populate({ path: 'owner', select: ['uid', 'username']})
		.then(blogs => {
			return res.status(200).json(blogs)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	update(req, res) {
		Blog.findOneAndUpdate({ uid: req.params.uid }, req.body.blog, { new: true })
		.populate({ path: 'owner', select: ['uid', 'username']})
		.then(blog => {
			return res.status(200).json(blog)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	getOne(req, res) {
		return Blog.find({uid: req.params.uid})
		.populate({ path: 'owner', select: ['uid', 'username']})
		.then(blogs => {
			return res.status(200).json(blogs)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	deleteOne(req, res) {
		return Blog.find({uid: req.params.uid})
		.remove()
		.then(blog => {
			return res.status(200).json(blog)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	},
	deleteAll(req, res) {
		return Blog.remove()
		.then(blog => {
			return res.status(200).json(blog)
		})
		.catch(error => {
			return res.status(422).json(error)
		})
	}
}
