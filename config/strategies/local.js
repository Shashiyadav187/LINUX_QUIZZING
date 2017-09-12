var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('mongoose').model('User');

module.exports=function(){
	console.log("inside local");
    passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done){
	console.log("11111");
	User.findOne({
	    email: email
	    },function(err, user){
		if(err){
		    return done(err);
		    }

		if(!user){
		    return done(null,false,{
			message:'Unknown user'
			});
		    }
		if(!user.authenticate(password)){
		    return done(null, false, {
			message: 'Invalid password'
			});
		    }

		return done(null, user);
		});
	}));
};
