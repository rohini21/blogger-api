const config = require('config')

function bindRoutes(router) {
	router.route('/')
	.get((req, res) => {
		res.json("Welcome to " + config.get('projectName') + " API.")
	})

	require('./user')(router)
	require('./blog')(router)

	return router
}

module.exports = bindRoutes