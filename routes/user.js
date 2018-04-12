const User   = require('./../controller/user')
var passport = require('passport')

module.exports = function(router) {
	
	router.post('/user/login', passport.authenticate('local'), User.login)
	router.delete('/user/logout', User.logout)
	router.get('/user/session', User.session)

	router.route('/user')
		.post(User.create)
		.get(User.getAll)
		.delete(User.deleteAll)

	router.route('/user/:uid')
		.put(User.update)
		.get(User.getOne)
		.delete(User.deleteOne)
}