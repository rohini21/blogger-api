const Blog = require('./../controller/blog')

module.exports = function(router) {
	router.route('/blog')
		.post(Blog.create)
		.get(Blog.getAllPublishedBlogs)
		.delete(Blog.deleteAll)

	router.route('/blog/:uid')
		.get(Blog.getOne)
		.put(Blog.update)
		.delete(Blog.deleteOne)

	router.route('/user/:uid/blog')
		.get(Blog.getUserBlogs)
	router.route('/user/:uid/blog/published')
		.get(Blog.getUserPublishedBlogs)
}