// Load the module dependencies
var User = require('mongoose').model('User');
var Student = require('mongoose').model('StudentsV4');
var passport = require('passport');



// Create a new error handling controller method
var getErrorMessage = function(err) {
    // Define the error message variable
    var message = '';
    
    // If an internal MongoDB error occurs get the error message
    if (err.code) {
	switch (err.code) {
	    // If a unique index error occurs set the message error
	case 11000:
	case 11001:
	    message = 'Email already exists';
	    break;
	    // If a general error occurs set the message error
	default:
	    message = 'Something went wrong';
	}
    } else {
	// Grab the first error message from a list of possible errors
	for (var errName in err.errors) {
	    if (err.errors[errName].message) message = err.errors[errName].message;
	}
    }
    
    // Return the message error
    return message;
};

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
    // If user is not connected render the signin page, otherwise redirect the user back to the main application page
    if (!req.user) {
	// Use the 'response' object to render the signin page
	res.render('login', {
	    // Set the page title variable
	    //title: 'Sign-in Form',
	    // Set the flash message variable
	    //messages: req.flash('error') || req.flash('info')
	});
    } else {
	return res.redirect('/');
    }
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
    // If user is not connected render the signup page, otherwise redirect the user back to the main application page
    if (!req.user) {
	console.log(req.user);
	console.log("hellllllo");
	// Use the 'response' object to render the signup page
	/*res.render('signup', {
	    // Set the page title variable
	    title: 'Sign-up Form',
	    // Set the flash message variable
	    //messages: req.flash('error')
	});*/
	res.json({
	    message:true
	    });
    } else {
	return res.redirect('/');
    }
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	console.log("in signup stuffffff");
	console.log(req.body);

	// if someone already signed in log them out
	if (req.user)
	{
		req.logout();
	}
    // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
    if (!req.user) {
	// Create a new 'User' model instance
	var user = new User(req.body);
	var message = null;

	console.log("-------------REQUSER--------------");
	console.log(req.body);

	// Set the user provider property
	user.provider = 'local';
	
	// Try saving the new user document
	user.save(function(err) {
		console.log("in save");

	    // If an error occurs, use flash messages to report the error
	    if (err) {
		// Use the error handling method to get the error message
		var message = getErrorMessage(err);
		console.log("errorroroor in save");
		console.log(message);

		// Set the flash messages
		//req.flash('error', message);
		
		// Redirect the user back to the signup page
		res.json({
			message:false,
			errorMessage:message
		});
	    }
	    else {

		var stuObj = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        quizzes: []
                };

		// add path for user to check their answers
		var mainDir = "";
		userDir = req.body.firstName + "_" + req.body.lastName;

		const exec = require('child_process').exec;

		const child0 = exec("pwd", (error, stdout, stderr) => {
			stdout = stdout.replace("\n", "");
			mainDir = stdout + "/checkAnswer";
			console.log("MAIN DIR INSIDE SIGNUP");
			console.log(mainDir);
		
		const child = exec("mkdir " + userDir, {cwd:mainDir},
		(error, stdout, stderr) => {


		const child2 = exec("mkdir data", {cwd:mainDir+"/"+userDir},
		(error, stdout, stderr) => {

		const child3 = exec("cp data.tar.gz " + userDir + "/data.tar.gz", {cwd:mainDir},
		(error, stdout, stderr) => {

				});

			});

		});
		});

                var stuEntry = new Student(stuObj);
		stuEntry.save().then(function() {
	        	console.log(message);
                	console.log("after save");
            		// If the user was created successfully use the Passport 'login' method to login
            		req.login(user, function(err) {
                	// If a login error occurs move to the next middleware
                	if (err) return next(err);
                	console.log("after login");
                	// Redirect the user back to the main application page
                	//return res.redirect('/login');
                        res.json({
                               message: true,
                        });


            		});

		});



		}
	});
    } else {
	console.log("IN ELSE OF SIGNUP");
	console.log("JASKLDJKS:LADJ:ASLJD");
	return res.redirect('/');
    }
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
    // Try finding a user document that was registered using the current OAuth provider
    User.findOne({
	provider: profile.provider,
	providerId: profile.providerId
    }, function(err, user) {
	// If an error occurs continue to the next middleware
	if (err) {
	    return done(err);
	} else {
	    // If a user could not be found, create a new user, otherwise, continue to the next middleware
	    if (!user) {
		// Set a possible base username
		var possibleEmail = profile.email;
		
		// Find a unique available username
		User.findUniqueEmail(possibleEmail, null, function(availableEmail) {
		    // Set the available user name 
		    profile.email = availableEmail;
		    
		    // Create the user
		    user = new User(profile);
		    
		    // Try saving the new user document
		    user.save(function(err) {
			// Continue to the next middleware
			return done(err, user);
		    });
		});
	    } else {
		// Continue to the next middleware
		return done(err, user);
	    }
	}
    });
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
    // Use the Passport 'logout' method to logout
    req.logout();
    
    // Redirect the user back to the main application page
    res.redirect('/');
};
