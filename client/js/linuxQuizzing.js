( function()
{
    angular.module("linuxQuiz",['ngRoute']);
    
//service 
    var linuxQuizModel = function($http)
    {
	//send the user's email and password to comfirm the user's identity at login
	var confirmIdentity=function(email,password)
	{
	    var data={
		"email":email,
		"password":password
	    }
	    return $http.post("/login",data);
	}

	//store the new user's information at signup
	var storeUser = function(fn, ln, email, passwd)
	{
	    var data={
		"firstName":fn,
		"lastName":ln,
		"email":email,
		"password":passwd
	    }
	    return $http.post("/signup",data);
	}

	//get the question from the backEnd
	var requestQuestion = function()
	{
	    return $http.get("/question");
	}

	//check if the answer to the question is correct
	var checkAnswer = function(answer)
	{
	    return $http.post("/checkAnswer",answer);
	}

	//get the current quiz result for the report after taking one quiz
	var getOneQuizResult = function()
	{
	    return $http.get("/thisQuizReport");
	}

	//get the results of all the quizzes for the viewReports page
	var getQuizResults = function()
	{
	    return $http.get("/allQuizReports");
	}

	//get the specific quiz report after clicking the report link on the viewReports page
	//input: id of the quiz
	var getQuizResultWithId = function(quizID)
	{
	    return $http.get("/thisQuizReportWithId/"+quizID);
	}

	//get the question summary for teacherDashboard page
	var getQuestionsSummary = function()
	{
	    return $http.get("/questionsSummary");
	}

	//get the student summary for teacherDashboard page
	var getStudentsSummary = function()
	{
	    return $http.get("/studentsSummary");
	}

	//get the results of all the students and all their quizzes for the studentGrade/:studentID page
	var getAllStudentsAllQuizzes = function()
	{
	    return $http.get("/allStudentsAllQuizzes");
	}

	//get the specific quiz report of a specific student after clicking the report link on the studentGrades/:studentID page
	//inputs: student ID and quiz ID
	var getStudentQuizResultWithId = function(studentID,quizID)
	{
	    return $http.get("/studentQuizReportWithId/"+studentID+"/"+quizID);
	}
	//add question
	var addQuestion = function(question)
	{
	    return $http.post("/addquestion",question);
	}

	return{
	    login:confirmIdentity,
	    signup:storeUser,
	    getQuestion:requestQuestion,
	    checkAnswer:checkAnswer,
	    getThisQuizResult:getOneQuizResult,
	    getAllQuizResults:getQuizResults,
	    getQuizResultWithId:getQuizResultWithId,
	    getQuestionsSummary:getQuestionsSummary,
	    getStudentsSummary:getStudentsSummary,
	    getAllStudentsAllQuizzes:getAllStudentsAllQuizzes,
	    getStudentQuizResultWithId:getStudentQuizResultWithId,
	    addQuestion:addQuestion
	}
    };

    //convert the string date to a date object
    var convertToDate = function(arrayInput, fieldInput)
    {
	arrayInput.forEach(function(element)
			   {
			       element.dateObject = new Date(element[fieldInput]);
			   });
    }

    //based on the given key value, add the keys icon and gradeColor for each element in the given array, and return the average grade
    var setColorIconAvg = function(arrayInput, fieldInput)
    {
	var totalGrade = 0;
	console.log(arrayInput);
	arrayInput.forEach(function(element)
			   {
			       totalGrade += element[fieldInput];
			       
			       if (element[fieldInput] >= 90)
			       {
				   element.icon = "check.png";
				   element.gradeColor = "greenColor";
			       }
			       else if (element[fieldInput] >= 60)
			       {
				   element.icon = "error.png";
				   element.gradeColor = "blueColor";
			       }
			       else {
				   element.icon = "cancel.png";
				   element.gradeColor = "redColor";
			       };
			       element[fieldInput]=Math.round(element[fieldInput] * 100) / 100;
			   });
	return (Math.round((totalGrade / arrayInput.length) * 100)/100);
    }
    
//controller
    var loginController = function($scope,$location,linuxQuizModel)
    {
	$scope.emailVal = "";
	$scope.passwdVal = "";
	$scope.warning = "";
	$scope.visibility = true;
	
	//when click signup button, go to signup page
	$scope.signupButton = function()
	{
	    $location.path("signup");
	};

	//when click login button, if the user is confirmed, redirect the page to the given path; 
	//otherwise, display the warning
	$scope.loginButton = function()
	{
	    console.log("login button pressed");
	    linuxQuizModel.login($scope.emailVal,$scope.passwdVal).then(function(message)
		  {
		      var response = message.data.message;
		      if (response == true)
		      {
			  $scope.visibility = true;
			  $location.path(message.data.thePath);
		      }
		      else 
		      {
			  $scope.warning = "Email or password is invalid!";
			  $scope.visibility = false;
		      }
		  });
	};
    }

    var signupController = function($scope,$location,linuxQuizModel)
    {
	$scope.firstNameVal = "";
	$scope.lastNameVal = "";
	$scope.emailVal = "";
	$scope.passwdVal = "";
	$scope.rePasswdVal = "";
	$scope.warning = "";
	$scope.visibility = true;

	$scope.submitButton = function()
	{
/*	    console.log("fn: ",$scope.firstNameVal);
	    console.log("ln: ",$scope.lastNameVal);
	    console.log("email: ",$scope.emailVal);
	    console.log("passwdVal: ",$scope.passwdVal);
	    console.log("rePasswdVal: ",$scope.rePasswdVal);
*/
	    //if the reentered password is different from the first password, display the warning
	    if ($scope.passwdVal != $scope.rePasswdVal)
	    {
		$scope.warning = "ReEntered password is different!";
		$scope.visibility = false;
	    }
	    else
	    {
		$scope.visibility = true;
		//send the new user's information
		linuxQuizModel.signup($scope.firstNameVal, $scope.lastNameVal, $scope.emailVal, $scope.passwdVal)
		.then(function(message)
		{
		    var response = message.data.message;
		    //if the user's information is stored correctly, redirected the page to the dashboard
		    if (response == true)
		    {
			console.log(message.data);
			console.log("--------");
			$location.path("dashboard");
		    }
		    //if the user's information is not stored successfully, display the warning
		    else
		    {
			$scope.warning = message.data.errorMessage;
			$scope.visibility = false;
		    }
		})
	    }
	};
    }
    
    var dashboardController = function($scope,$location)
    {
	//when click the viewReports button, redirect to viewReports page
	$scope.viewReportsButton = function()
	{
	    $location.path("viewReports");
	};
	
	//when click the startQuiz button, redirect to quiz page
	$scope.startQuizButton = function()
	{
	    $location.path("quiz");
	};
    }

    var quizController = function($scope,$location,linuxQuizModel,$route)
    {
	$scope.questionName = "";
	$scope.description = "";
	$scope.number = 0;
	$scope.maxQuest = 0;
	$scope.progress = "";
	$scope.userAnswer = "";
	$scope.readonly = false;
	$scope.responseText="";
	$scope.warnVisibility=true;
	$scope.correctVisibility=true;
	$scope.warnAnswer=true;
	
/*
  testing code
	$scope.questionName = "Question name";
	$scope.description = "Question description";
	$scope.number = 1;
	$scope.maxQuest = 3;
	$scope.progress = $scope.number/$scope.maxQuest*100+"%";
*/

	//get a question from the backEnd
	linuxQuizModel.getQuestion()
	.then(function(message)
	{
	    var response = message.data;
	    $scope.questionName = response.questionName;
	    $scope.description = response.description;
	    $scope.number=response.questNum;
	    $scope.maxQuest=response.maxQuestNum;
	    $scope.progress = ($scope.number-1)/$scope.maxQuest*100+"%";
	});

	$scope.keyPress=function(keyEvent){
	    //when the enter key is pressed, the user should be locked from typing, 
	    //and the answer should be sent to the backEnd in order to be checked.
	    if(keyEvent.which === 13)
	    {
		$scope.readonly = true;
		linuxQuizModel.checkAnswer({usrAnswer:$scope.userAnswer})
		.then(function(message)
		{
		    var response = message.data.message		
		    if(response.includes("Incorrect")){
			$scope.responseText=response;
			$scope.warnVisibility=false;
			$scope.correctVisibility=true;
		    }
		    else{
			$scope.responseText=response;
			$scope.correctVisibility=false;
			$scope.warnVisibility=true;
		    }				  
		});
	    }
	}
	
	//when click the next button
	$scope.nextButton = function()
	{
	    //if the user has pressed the enter key
	    if ($scope.readonly)
	    {
		//if this is not the last question, reload another question
		if ($scope.number != $scope.maxQuest)
		{
		    $route.reload();
		}
		//if this is the last question, redirect to the report page
		else
		{
		    $location.path("report");
		}
	    }
	    //if the user hasn't pressed the enter key, show the warning
	    else
	    {
		$scope.warnAnswer=false;
	    }
	};
    }

    var quizReportController = function($scope,$location,linuxQuizModel)
    {
	$scope.grade = 0;
	$scope.questions = [];

/*
	//testing
	$scope.grade = 45;
	$scope.questions = [
	    {
                "questionName":"Change Directory",
                "description":"Change the directory from the current directory to the scapy",
                "crtAnswer":"cd scapy",
                "usrAnswer":"cd scapy",
                "usrCorrect":true
	    },
	    {
                "questionName":"List long form",
                "description":"List out all of the items in your current directory in long form",
                "crtAnswer":"ls -l",
                "usrAnswer":"ls -l",
                "usrCorrect":true
	    },
	    {
                "questionName":"Make a directory",
                "description":"Make a directory in your current directory called red",
                "crtAnswer":"mkdir red",
                "usrAnswer":"mkdr red",
                "usrCorrect":false
	    },
	    {
                "questionName":"Copy a file",
                "description":"Copy the red.txt file to green.txt",
                "crtAnswer":"cp red.txt green.txt",
                "usrAnswer":"copy red.txt green.txt",
                "usrCorrect":false
	    }		    
	]

*/
	//get the report of the quiz that just finished and only show it if the user is logged in
	linuxQuizModel.getThisQuizResult()
	.then(function(message)
	{
	    var response = message.data;
	    if (checkLogin(response, $location))
	    {
	    	$scope.grade = response.grade;
	    	$scope.questions = response.questions;
	    }
	});

	//when click quiz button, redirect to the quiz page to take another quiz
	$scope.retakeQuizButton = function()
	{
	    $location.path("quiz");
	};

	//when click home button, redirect to the dashboard page
	$scope.homeButton = function()
	{
	    $location.path("dashboard");
	};
    }

    var viewReportsController = function($scope,$location,linuxQuizModel)
    {
	$scope.quizzes = [];
	$scope.orderByValue = "";

	//set the orderByValue to dateObject
	$scope.orderByDate = function()
	{
	    if (($scope.orderByValue == "") || ($scope.orderByValue == "grade"))
	    {
		$scope.orderByValue = "dateObject";
	    }
	    else {
		$scope.orderByValue = "";
	    };
	};

	//set the orderByValue to grade
	$scope.orderByGrade = function()
	{
	    if (($scope.orderByValue == "") || ($scope.orderByValue == "dateObject"))
	    {
		$scope.orderByValue = "grade";
	    }
	    else {
		$scope.orderByValue = "";
	    };
	};
	
/*
	//test
	$scope.quizzes = [
	    {
		"_id":1,
		"grade": 98,
		"dateTaken":"4/29/2017"
	    },
	    {
		"_id":2,
		"grade": 75,
		"dateTaken":"4/21/2017"
	    }
	]

	convertToDate($scope.quizzes, "dateTaken");
	$scope.averageGrade = setColorIconAvg($scope.quizzes, "grade");
*/


	//get all the reports for all the quizzes if the user is logged in
	linuxQuizModel.getAllQuizResults()
	.then(function(message)
 	{

	    var response = message.data;
	    if(checkLogin(response,$location))
		{
		    $scope.quizzes = response.quizzes;
		    convertToDate($scope.quizzes, "dateTaken");
		    $scope.averageGrade = setColorIconAvg($scope.quizzes, "grade");
		    }
	});


	//when click the home button, redirect to the dashboard page
	$scope.homeButton = function()
	{
	    $location.path("dashboard");
	};
    }

    var quizReportWithIdController = function($scope,$location,$routeParams,linuxQuizModel)
    {
	$scope.grade = 0;
	$scope.questions = [];

/*
	//testing
	$scope.grade = 45;
	$scope.questions = [
	    {
                "questionName":"Change Directory",
                "description":"Change the directory from the current directory to the scapy",
                "crtAnswer":"cd scapy",
                "usrAnswer":"cd scapy",
                "usrCorrect":true
	    },
	    {
                "questionName":"List long form",
                "description":"List out all of the items in your current directory in long form",
                "crtAnswer":"ls -l",
                "usrAnswer":"ls -l",
                "usrCorrect":true
	    },
	    {
                "questionName":"Make a directory",
                "description":"Make a directory in your current directory called red",
                "crtAnswer":"mkdir red",
                "usrAnswer":"mkdr red",
                "usrCorrect":false
	    },
	    {
                "questionName":"Copy a file",
                "description":"Copy the red.txt file to green.txt",
                "crtAnswer":"cp red.txt green.txt",
                "usrAnswer":"copy red.txt green.txt",
                "usrCorrect":false
	    }		    
	]

*/

	//get the report of a specific report with the report's ID if the user is logged in
	linuxQuizModel.getQuizResultWithId($routeParams.reportId)
	.then(function(message)
	{
	    var response = message.data;
	    if (checkLogin(response, $location))
	    {
	    	$scope.grade = response.grade;
	    	$scope.questions = response.questions;
	    }
	});


	//when click the retake quiz button, redirect to quiz page
	$scope.retakeQuizButton = function()
	{
	    $location.path("quiz");
	};

	//when click the home button, redirect to dashboard page
	$scope.homeButton = function()
	{
	    $location.path("dashboard");
	};
    }

    var teacherDashboardController = function($scope,$location,linuxQuizModel)
    {
	$scope.showClassTrends = false;
	$scope.showStudentReports = true;

	//show classTrend and hide studentReport
	$scope.switchTabs1 = function()
	{
	    $scope.showClassTrends = false;
	    $scope.showStudentReports = true;
	};

	//hide classTrend and show studentReport
	$scope.switchTabs2 = function()
	{
	    $scope.showClassTrends = true;
	    $scope.showStudentReports = false;
	};

	$scope.orderByValue = "";


	//set the orderByValue to crtRatio
	$scope.orderByPerc = function()
	{
	    if ($scope.orderByValue == "")
	    {
		$scope.orderByValue = "crtRatio";
	    }
	    else {
		$scope.orderByValue = "";
	    };
	};

	$scope.questions = [];


/*
	$scope.questions = [
	    {
		"questionName":"Change Directory",
		"description":"Change the directory from the current directory to the ::directory::",
		"crtAnswer":"cd ::directory::",
		"crtRatio":92
	    },
            {
		"questionName":"List long form",
		"description":"List out all of the items in your current directory in long form",
		"crtAnswer":"ls -l",
		"crtRatio":78
            },
            {
		"questionName":"Make a directory",
		"description":"Make a directory in your current directory called ::directory::",
		"crtAnswer":"mkdir ::directory::",
		"crtRatio":56
            }
	];

	setColorIconAvg($scope.questions, "crtRatio");
*/
	
	//get the summary of all the questions
	linuxQuizModel.getQuestionsSummary()
	.then(function(message)
 	{
	    var response = message.data;
	    if (checkTeacher(response, $location))
	    {
	    	$scope.questions = response.questions;
	    	console.log($scope.questions);
	    	setColorIconAvg($scope.questions, "crtRatio");
	    }


	});

	$scope.students = [];
/*
	$scope.students = [
	    {
		"_id":1,
		"firstName":"Ross",
    		"lastName":"Murrell",
		"latestDate":"4/3/2017",
		"averageGrade":95
	    },
	    {
		"_id":2,
		"firstName":"Minyi",
    		"lastName":"Hu",
		"latestDate":"4/19/2017",
		"averageGrade":48
	    },
	    {
		"_id":3,
		"firstName":"Leyu",
    		"lastName":"Fei",
		"latestDate":"4/8/2017",
		"averageGrade":91
	    },
	    {
		"_id":4,
		"firstName":"Alex",
    		"lastName":"Luken",
		"latestDate":"4/4/2017",
		"averageGrade":95
	    }
	];

	convertToDate($scope.students, "latestDate");
	$scope.averageGrade = setColorIconAvg($scope.students, "averageGrade");
*/



	$scope.oderByStudentValue = "";

	//set the orderByValue to firstName and lastName
	$scope.orderByName = function()
	{
	    var array1 = $scope.oderByStudentValue;
	    var array2 = ['firstName','lastName'];
	    
	    if (($scope.oderByStudentValue == "") || ($scope.oderByStudentValue == "dateObject") || ($scope.oderByStudentValue == "averageGrade"))
	    {
		$scope.oderByStudentValue = ['lastName','firstName'];
	    }
	    else {
		$scope.oderByStudentValue = "";
	    };
	    console.log($scope.oderByStudentValue);
	};

	//set the orderByValue to dateObject
	$scope.orderByDate = function()
	{
	    if (($scope.oderByStudentValue == "") || ($scope.oderByStudentValue == ['lastName','firstName']) || ($scope.oderByStudentValue == "averageGrade"))
	    {
		$scope.oderByStudentValue = "dateObject";
	    }
	    else {
		$scope.oderByStudentValue = "";
	    };
	    console.log($scope.oderByStudentValue);
	};

	//set the orderByValue to averageGrade
	$scope.orderByGrade = function()
	{
	    if (($scope.oderByStudentValue == "") || ($scope.oderByStudentValue == ['lastName','firstName']) || ($scope.oderByStudentValue == "dateObject"))
	    {
		$scope.oderByStudentValue = "averageGrade";
	    }
	    else {
		$scope.oderByStudentValue = "";
	    };
	    console.log($scope.oderByStudentValue);
	};

	//get the students' quiz summary
	linuxQuizModel.getStudentsSummary()
	.then(function(message)
 	{
	    var response = message.data;
	    $scope.students = response.students;
	    convertToDate($scope.students, "latestDate");
	    $scope.averageGrade = setColorIconAvg($scope.students, "averageGrade");

	    $scope.dat=[];
	
	    $scope.students.forEach(function(element){
		console.log(element);
		$scope.dat.push(element.averageGrade/100);
	    })
	    var data=$scope.dat;


	    var formatCount = d3.format(",.0f");
	    var svg = d3.select("svg");
	    var margin = {top: 10, right: 30, bottom: 30, left: 30};

	    if(!(svg._groups[0][0]==null)){
		var width = +svg.attr("width") - margin.left - margin.right;
		var height = +svg.attr("height") - margin.top - margin.bottom;
		//might need var g
		var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleLinear()
		    .rangeRound([0, width]);
		
		var bins = d3.histogram()
		    .domain(x.domain())
		    .thresholds(x.ticks(20))
		(data);

		var y = d3.scaleLinear()
		    .domain([0, d3.max(bins, function(d) { return d.length; })])
		    .range([height, 0]);
	    
	    var bar = g.selectAll(".bar")
		.data(bins)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

	    bar.append("rect")
		.attr("x", 1)
		.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
		.attr("height", function(d) { return height - y(d.length); });

	    bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { return formatCount(d.length); });

	    g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	    }
	});


//*/


    }

    var teacherViewGradeController = function($scope,$location,$routeParams,linuxQuizModel)
    {
	$scope.studentsWithQuizzes = [];
	$scope.studentID = $routeParams.studentID;
	$scope.orderByValue = "";

	//set the orderByValue to dateObject
	$scope.orderByDate = function()
	{
	    if (($scope.orderByValue == "") || ($scope.orderByValue == "grade"))
	    {
		$scope.orderByValue = "dateObject";
	    }
	    else {
		$scope.orderByValue = "";
	    };
	};

	//set the orderByValue to grade
	$scope.orderByGrade = function()
	{
	    if (($scope.orderByValue == "") || ($scope.orderByValue == "dateObject"))
	    {
		$scope.orderByValue = "grade";
	    }
	    else {
		$scope.orderByValue = "";
	    };
	};
	
	/*
	$scope.studentsWithQuizzes = [
	    {
		"_id":1,
    		"firstName":"Ross",
    		"lastName":"Murrell",
		"quizzes":[
		    {
			"_id":1,
			"grade": 88,
			"dateTaken":"4/20/2017"
		    },
		    {
			"_id":2,
			"grade": 78,
			"dateTaken":"4/29/2017"
		    },
		    {
			"_id":3,
			"grade": 92,
			"dateTaken":"5/2/2017"
		    }
		]
	    },
	    {
		"_id":2,
		"firstName":"Minyi",
    		"lastName":"Hu",
		"quizzes":[
		    {
			"_id":1,
			"grade": 90,
			"dateTaken":"4/18/2017"
		    },
		    {
			"_id":2,
			"grade": 88,
			"dateTaken":"4/25/2017"
		    }
		]
	    },
	    {
		"_id":3,
		"firstName":"Leyu",
    		"lastName":"Fei",
		"quizzes":[
		    {
			"_id":1,
			"grade": 77,
			"dateTaken":"4/20/2017"
		    },
		    {
			"_id":2,
			"grade": 70,
			"dateTaken":"4/23/2017"
		    },
		    {
			"_id":3,
			"grade": 96,
			"dateTaken":"5/1/2017"
		    }
		]
	    },
	    {
		"_id":4,
    		"firstName":"Alex",
    		"lastName":"Luken",
		"quizzes":[
		    {
			"_id":1,
			"grade": 93,
			"dateTaken":"4/28/2017",
		    }
		]
	    }
	];
	*/

	//set the student value to a specific student based on the given student ID 
	//and set the average grade for this student
	var chooseStudent = function()
	{
	    $scope.student = $scope.studentsWithQuizzes.find(function(element)
							     {
								 return element._id == $scope.studentID;
							     });
	    
	    $scope.student.averageGrade = Math.round(setColorIconAvg($scope.student.quizzes, "grade") * 100) / 100;
	};

	/*
	chooseStudent();
	convertToDate($scope.student.quizzes, "dateTaken");
	*/

	///*
	//get the results of all the students and all their quizzes 
	//and set the student, averageGrade and add the dateObject for the student
	linuxQuizModel.getAllStudentsAllQuizzes()
	.then(function(message)
	{
	    $scope.studentsWithQuizzes = message.data.students;
	    chooseStudent();
	    convertToDate($scope.student.quizzes, "dateTaken");
	});
	//*/

	//update the student value and add the dateObject for the new student
	$scope.updateStudent = function()
	{
	    chooseStudent();
	    convertToDate($scope.student.quizzes, "dateTaken");
	};

	//when click the home button, redirect to the teacherDashbard page
	$scope.homeButton = function()
	{
	    $location.path("teacherDashboard");
	};
    }

    var studentQuizResultWithIdController = function($scope,$location,$routeParams,linuxQuizModel)
    {
	$scope.grade = 0;
	$scope.questions = [];
	$scope.visibility = true;

/*
	//testing
	$scope.grade = 45;
	$scope.questions = [
	    {
                "questionName":"Change Directory",
                "description":"Change the directory from the current directory to the scapy",
                "crtAnswer":"cd scapy",
                "usrAnswer":"cd scapy",
                "usrCorrect":true
	    },
	    {
                "questionName":"List long form",
                "description":"List out all of the items in your current directory in long form",
                "crtAnswer":"ls -l",
                "usrAnswer":"ls -l",
                "usrCorrect":true
	    },
	    {
                "questionName":"Make a directory",
                "description":"Make a directory in your current directory called red",
                "crtAnswer":"mkdir red",
                "usrAnswer":"mkdr red",
                "usrCorrect":false
	    },
	    {
                "questionName":"Copy a file",
                "description":"Copy the red.txt file to green.txt",
                "crtAnswer":"cp red.txt green.txt",
                "usrAnswer":"copy red.txt green.txt",
                "usrCorrect":false
	    }		    
	]
*/

	//get the specific quiz report of a specific student
	linuxQuizModel.getStudentQuizResultWithId($routeParams.studentId,$routeParams.reportId)
	.then(function(message)
	{
	    var response = message.data;
	    $scope.grade = response.grade;
	    $scope.questions = response.questions;
	});

	//when click the home button, redirect to the teacherDashboard page
	$scope.homeButton = function()
	{
	    $location.path("teacherDashboard");
	};
    }

    //return true if the user is logged in; otherwise, return false
    var checkLogin = function(response, $location)
    {
	if(response.redirect !=undefined){
	    $location.path("");
	    return false;
	    }
	return true;
    }

    //return true if the teacher is logged in; otherwise, return false
    var checkTeacher = function(response, $location)
    {
        if(response.redirect !=undefined){
            $location.path("");
            return false;
            }
        return true;
    }

    var addQuestionController = function($scope,linuxQuizModel){
	$scope.questionName="";
	$scope.questionDescr="";
	$scope.crtAnswer="";
	$scope.checkStandard="";
	$scope.submitQuestion = function(){
	    linuxQuizModel.addQuestion(
		{
		    questionName:$scope.questionName,
		    description:$scope.questionDescr,
		    crtAnswer:$scope.crtAnswer,
		    checkStandard:$scope.checkStandard
		}
	    )
	}
    }
    var routingConfig = function($routeProvider)
    {
	$routeProvider
	.when("/",
	      {
		  templateUrl:"login.html",
		  controller:"loginController"
	      })
	.when("/signup",
	      {
		  templateUrl:"signup.html",
		  controller:"signupController"
	      })
	.when("/dashboard",
	      {
		  templateUrl:"intro.html",
		  controller:"dashboardController"
	      })
	.when("/quiz",
	      {
		  templateUrl:"quizDashboard.html",
		  controller:"quizController"
	      })
	.when("/report",
	      {
		  templateUrl:"quizReport.html",
		  controller:"quizReportController"
	      })
	.when("/viewReports",
	      {
		  templateUrl:"viewReports.html",
		  controller:"viewReportsController"
	      })
	.when("/report/:reportId",
	      {
		  templateUrl:"quizReport.html",
		  controller:"quizReportWithIdController"
	      })
	.when("/teacherDashboard",
	      {
		  templateUrl:"teacherDashboard.html",
		  controller:"teacherDashboardController"
	      })
	.when("/studentGrades/:studentID",
	      {
		  templateUrl:"teacherStudentGrades.html",
		  controller:"teacherViewGradeController"
	      })
	.when("/report/:studentId/:reportId",
	      {
		  templateUrl:"quizReport.html",
		  controller:"studentQuizResultWithIdController"
	      })
	.when("/addQuestion",
	      {
		  templateUrl:"addQuestion.html",
		  controller:"addQuestionController"
	      })

	.otherwise({redirectTo:"/badlink"});
    };

    angular
    .module("linuxQuiz")
    .config(['$routeProvider',routingConfig])
    .controller("loginController",loginController)
    .controller("signupController",signupController)
    .controller("dashboardController",dashboardController)
    .controller("quizController",quizController)
    .controller("quizReportController",quizReportController)
    .controller("viewReportsController",viewReportsController)
    .controller("quizReportWithIdController",quizReportWithIdController)
    .controller("teacherDashboardController",teacherDashboardController)
    .controller("teacherViewGradeController",teacherViewGradeController)
    .controller("studentQuizResultWithIdController",studentQuizResultWithIdController)
    .controller("addQuestionController",addQuestionController)
    .service("linuxQuizModel", linuxQuizModel);

})();
