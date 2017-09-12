var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//This schema is used for questions in database
var QuestionSchema = new Schema({
    questionName:String,
    description:String,
    crtAnswer:String,
    checkStandard:String
});

//This schema is for student report in database
var StuReportSchema = new Schema({
	date: String,
	Grade: Number
});


//This schema is used for student in database
var StudentsSchemaV4 = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    quizzes:[
	{
	    grade:Number,
	    dateTaken:String,
	    finished:Boolean,
	    questionID:[Number],
	    questions: [
		{
		    questionName:String,
		    description: String,
		    actualDescription:String,
		    files:[String],
		    directories:[String],
		    crtAnswer:String,
		    actualCrtAnswer:String,
		    usrAnswer:String,
		    usrCorrect:Boolean,
		    checkStandard:String
		    }
	    ]
	}
    ]
});

//This schema is used for question in database
var questionsSchema = new Schema({
    que:[
	{
	    questionName:String,
	    description:String,
	    crtAnswer:String
	}
    ]
});

//Register schema
mongoose.model('Question',QuestionSchema);
mongoose.model('StuReport',StuReportSchema);
mongoose.model('questions',questionsSchema);
mongoose.model('StudentsV4',StudentsSchemaV4);



//console.log("Question has been installed");
