// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

// Define the routes module' method
module.exports = function(app) {
    // Set up the 'signup' routes 
    app.route('/signup')
	.get(users.renderSignup)
	.post(users.signup);
    
    // Set up the 'signin' routes 
    app.route('/login')
	.post(passport.authenticate('local', {
		failureRedirect: "/"}), 
		function(req, res) {
			console.log("in login route post");
			console.log(req.user.email);
			console.log("*****");
			var path = "dashboard";
			if (req.user.email == "dave@centre.edu" || req.user.email == "dave.toth@centre.edu" || req.user.email == "david.toth@centre.edu")
			{
				path = "teacherDashboard";
			}
			console.log("path:"+path);
			res.json({
				message: true,
				thePath: path
			});
		}
	);

};
