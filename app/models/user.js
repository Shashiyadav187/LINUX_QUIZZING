// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'UserSchema'
var UserSchema = new Schema({
    firstName: {
	type: String,
	// Validate 'first name' value existance
	required: 'first name is required',
	trim: true
    },
    lastName: {
	type: String,
	// Validate 'last name' value existance
	required: 'last name is required',
	trim: true
    },
    email: {
	type: String,
	unique: true,
	// Validate the email format
	match: [/.+\@.+\..+/, "Please fill a valid email address"],
	required: 'Email is required',
	trim: true
    },
    password: {
	type: String,
	// Validate the 'password' value length
	validate: [
	    function(password) {
		return password && password.length > 8;
	    }, 'Password should be longer'
	]
    },
    salt: {
	type: String
    },
    provider: {
	type: String,
	// Validate 'provider' value existance
	required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
	type: Date,
	// Create a default 'created' value
    default: Date.now
    }
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
UserSchema.pre('save', function(next) {
    if (this.password) {
	this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
	this.password = this.hashPassword(this.password);
    }
    
    next();
});

// Create an instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

// Create an instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

// Find possible not used email
UserSchema.statics.findUniqueEmail = function(email, suffix, callback) {
	var _this = this;

	// Add a 'email' suffix
	var possibleEmail = email + (suffix || '');

	// Use the 'User' model 'findOne' method to find an available unique email
	_this.findOne({
		email: possibleEmail
	}, function(err, user) {
		// If an error occurs call the callback with a null value, otherwise find find an available unique email
		if (!err) {
			// If an available unique email was found call the callback method, otherwise call the 'findUniqueemail' method again with a new suffix
			if (!user) {
				callback(possibleEmail);
			} else {
				return _this.findUniqueEmail(email, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);
