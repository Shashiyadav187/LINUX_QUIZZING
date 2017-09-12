module.exports = function(app)
{
    // for setting req.user in backend tests...
    var testing = false;
    if (process.env.NODE_ENV == "testing")
    {
        testing = true;
    }
    testStudent={email:"bob@centre.edu"};
    testTeacher={email:"bradshaw@centre.edu"};
    
    // ------------- ROUTES --------------------------------------

    // get the controllers for the routes
    var controller = require("../controllers/linux.server.controller")();
    
    // gets a question from the backend for the quiz page
    app.get("/question", isLoggedIn, function(req,res)
	    {
		if(testing){
		    req.user=testStudent;
		}	
		controller.getQuestion(req,res);});

    // adds a question to the db
    app.post("/addquestion",controller.addQuestion);

    // adds a student to the db
    app.post("/addStudent",controller.addStudent);

    // gets all quiz reports for a student
    app.get("/allQuizReports", isLoggedIn, function(req,res)
	    {
		if(testing){
		    req.user=testStudent;
		}	
		controller.getStuQuizReports(req,res);});

    // gets the quiz report at the end of each quiz
    app.get("/thisQuizReport", isLoggedIn, function(req,res)
	    {
		if(testing){
		    req.user=testStudent;
		}
		controller.getCurrentReport(req,res);
	    });

    // gets a quiz report by id from the all quiz reports page
    app.get("/thisQuizReportWithId/:resultID", isLoggedIn, function(req,res)
            {
                if(testing){
                    req.user=testStudent;
                }
		controller.getReportById(req,res);
	    });

    // checks an answer submitted in the quiz
    app.post("/checkAnswer", isLoggedIn, function(req,res)
	    {
		if(testing){
		    req.user=testStudent;
		}
		controller.checkAnswer(req,res);
	    });

    // teacher view: gets the questions and the percentage
    // of students who got each question correct
    app.get("/questionsSummary", isTeacher, function(req,res)
        {
                if(testing==true){
                   req.user=testTeacher;
                }
        controller.getQuestionsSummary(req,res);
    });

    // teacher view: gets averages for each student
    app.get("/studentsSummary", isTeacher, function(req,res)
        {
		console.log("IN STUDENT SUMMARY ROUTE");
                if(testing==true){
                   req.user=testTeacher;
                }
        controller.getStudentsSummary(req,res);
    });

    // teacher view: get all of the quizzes for one student
    app.get("/allStudentsAllQuizzes", isTeacher, function(req,res)
        {
                if(testing==true){
                   req.user=testTeacher;
                }
        controller.getAllStudentsQuizzes(req,res);
    });

    // teacher view: get one quiz report from one student
    app.get("/studentQuizReportWithId/:studentID/:quizID", isTeacher, function(req,res)
        {
                if(testing==true){
                   req.user=testTeacher;
                }
        controller.getStudentReportWithId(req,res);
    });

    
    
    
    // used to ensure someone is logged in when express routes
    function isLoggedIn(req,res,next){
    	if(!testing){
            if(req.isAuthenticated())
            	return next();
            res.json({
            	redirect:"login"
            });
    	}
	else{
	    return next();
	}
    }

    // used to ensure only the teacher can access the teacher view
    function isTeacher(req,res,next){
        if(!testing){
        	if(req.isAuthenticated())
		{
			if (req.user.email == "dave@centre.edu" || req.user.email == "dave.toth@centre.edu" || req.user.email == "david.toth@centre.edu")
			{
                		return next();
			}
		}
            	res.json({
			redirect:"login"
		});
        }
        else{
            return next();
        }
    }

    
    
    
    
}   


