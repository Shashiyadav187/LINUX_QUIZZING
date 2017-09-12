module.exports = function()
{

// for linux command execution
const exec = require('child_process').exec;



// get path to check answer dir
const child = exec('pwd',
(error, stdout, stderr) => {
	console.log("IN CONTROLLERS MAIN DIR");
	stdout = stdout.replace("\n", "");
	mainDir = stdout + "/checkAnswer/";

});



// define models and random files/directories
var Question = require('mongoose').model('Question');
var students=require('mongoose').model('StudentsV4');
var files1=["red.txt","blue.txt","pink.txt","green.txt","cyan.txt"];
var files2=["light_red.txt","dark_blue.txt","light_pink.txt","dark_cyan.txt","yellow.txt"];
var directories1=["koala","turtle","dragon","dog","tiger"];
var directories2=["panda","greenstuff","imaginaryanimal","humanfriend","dangerous"];

    

// this function shuffles an array
    function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	while (0 !== currentIndex) {
	    
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	}
	
	return array;
    }



// this controller checks an answer to determine if it is correct
// either by string comparison or by command execution and
// comparison of the directories
// command to check if two directories are the same: diff -r -q dir1 dir2
var checkAnswer = function(req, res, next)
{
    // get user and answer
    var usrAnswer=req.body.usrAnswer;
    var user=req.user.email;

    // find the student
    students.find({email:user},function(err,student)
                  {
                      if (err)
                      {
                          return next(err);
                      } 
		      else
                      {

                          var quizzes=student[0].quizzes;
                          var Questions=quizzes[quizzes.length-1].questions;
                          var latestQuestion=Questions[Questions.length-1];
                          latestQuestion.usrAnswer=usrAnswer;
                          student[0].quizzes[quizzes.length-1].questions[Questions.length-1].usrAnswer = usrAnswer;

                          // check if correct using string comparison
                          if(latestQuestion.checkStandard=="String")
                              {
                                  var uCorrect = false;
                                  var msg = "Incorrect: the correct answer is " + latestQuestion.actualCrtAnswer;
                                  if(usrAnswer==latestQuestion.actualCrtAnswer){
                                      uCorrect = true;
                                      msg = "Your answer is correct!";
                                  }


				  var quizLen = (quizzes.length-1).toString();
				  var questionNum = (Questions.length-1).toString();
                                  var pushStr1 = "quizzes." + quizLen + ".questions." + questionNum + ".usrCorrect";
                                  var pushStr2 = "quizzes." + quizLen + ".questions." + questionNum + ".usrAnswer";
                                  var push = {};
				  //console.log(pushStr1);
                                  push[pushStr1] = uCorrect;
				  push[pushStr2] = usrAnswer;
                                  //console.log("1111111111");
                                        students.update(
                                        { "email": user },
                                        { "$set": push })
                                        .then(function(theStudent) {
					//console.log("IN PUSH CHECK ANSWER");
    					students.find({email:user},function(err,student)
					{
						//console.log(theStudent);
						//console.log(student[0].quizzes[0].questions);
                                          res.json({message:msg});

					});
						

					});




                              }
			else // check if correct using command execution and directory comparison
			{
                             var uCorrect = false;
                             var msg = "Incorrect: the correct answer is " + latestQuestion.actualCrtAnswer;

			     console.log("IN CHECK ANSWER VIA CMD EXECUTION");
			     console.log(mainDir);
                             var nameDir = mainDir + student[0].firstName + "_" + student[0].lastName;
                             var dataDir = nameDir + "/data"
			     var userDir = dataDir + "/userDir"
                             var testDir = dataDir + "/testDir";
                             console.log(nameDir);
                             console.log(dataDir);
                             console.log(testDir);
                             console.log(userDir);

			     // unpackage the tar file, run both commands, and test if they
			     // did the same thing
                             const child = exec('rm -r data && tar -xzf data.tar.gz', {cwd:nameDir},
                                                 (error, stdout, stderr) => {
					console.log("extract tar: "+stdout);
					console.log("extract tar: "+stderr);
					console.log("extract tar: "+error);

				 const child = exec(usrAnswer + ' > output.txt', {cwd:userDir},
                                 (error, stdout, stderr) => {

					//console.log("user cmd: "+stdout);
					//console.log("user cmd: "+stderr);


 				const child = exec(latestQuestion.actualCrtAnswer + ' > output.txt', {cwd:testDir},
                                (error, stdout, stderr) => {


					//console.log("test cmd: "+stdout);
					//console.log("test cmd: "+stderr);


                               const child = exec('diff -r -q userDir testDir', {cwd:dataDir},
                                  (error, stdout, stderr) => {

					//console.log("diff cmd: "+stdout);
					//console.log("diff cmd: "+stderr);

					if (stdout == '')
					{
						uCorrect = true;
                                      		msg = "Your answer is correct!";
					}

                                  	var quizLen = (quizzes.length-1).toString();
                                  	var questionNum = (Questions.length-1).toString();
                                  	var pushStr1 = "quizzes." + quizLen + ".questions." + questionNum + ".usrCorrect";
                                  	var pushStr2 = "quizzes." + quizLen + ".questions." + questionNum + ".usrAnswer";
                                  	var push = {};
                                  	push[pushStr1] = uCorrect;
                                  	push[pushStr2] = usrAnswer;

                                        students.update(
                                        { "email": user },
                                        { "$set": push })
                                        .then(function(theStudent) {
                                        //console.log("IN PUSH CHECK ANSWER FOR CMD");
                                        students.find({email:user},function(err,student)
                                        {
                                                //console.log(theStudent);
                                          res.json({message:msg});

                                        });


                                        });



				});

				});

				});


			     });



			}




		      }
		  });





};


// this controller gets a random question that the user has not
// had yet
var getQuestion = function(req, res,next){
    // length of the quiz
    var max=5;
    var user=req.user.email;
    //console.log(user);
    //console.log("------------------------------------/////");

    // get the correct student
    students.find({email:user},function(err,student)
                  {
                      if (err)
                      {
                          return next(err);
                      } 
		      else
                      {
			  var quizzes = student[0].quizzes;
                          var fin;
                          if (quizzes.length == 0)
                          {
                                fin = true;
                          }
                          else
                          {
                                fin=quizzes[quizzes.length-1].finished;
                          }
                          var allQuestions;
			  var theUser = "checkuser";
                          var promise = Question.find({}).exec();
                          // get the questions and wait for promise
                          promise.then(function(que)
                                {
                                        allQuestions = que;
                                        // if on new quiz, insert new quiz into db
                                        if (fin)
                                        {
                                                var idArray = [];
                                                que.forEach(function(obj, index, array)
                                                {
                                                        idArray.push(index);    
                                                });
                                                var shuffledQuestions = shuffle(idArray);
                                                var newquiz={
                                                                grade:-1,
                                                                dateTaken:new Date(),
                                                                finished:false,
                                                                questionID:shuffledQuestions,
                                                                questions:[]
                                                };
                                                student[0].quizzes.push(newquiz);
						theUser = req.user.email;
                                        }

				        students.update(
                                        { "email": theUser },
                                        { "$push": { "quizzes": newquiz } })
					.then(function(theStudent) {
						students.find({email:user},function(err,theStudent)
                                                {
                                         
                                        // get quiz data
 					var stuQuizzes = theStudent[0].quizzes;
                                        var curQuiz = stuQuizzes[stuQuizzes.length-1];
                                        var qQuestions = curQuiz.questions;
                                        var questionNum = qQuestions.length+1;
                                        var questionIDs = curQuiz.questionID;
                                        var qID = questionIDs[questionNum-1];
                                        var question=allQuestions[qID];
                                        var name=question.description;
                                    //We assume that there are at most two files and two directories in each question
                                        var actualFile1=files1[Math.floor(Math.random() * files1.length)];
                                        var actualFile2=files2[Math.floor(Math.random() * files2.length)];
                                        var actualDirect1=directories1[Math.floor(Math.random() * directories1.length)];
                                        var actualDirect2=directories2[Math.floor(Math.random() * directories2.length)];
                                        var count=0;
                                        var actualName=name;
                                        var actualFiles=[];
                                        var actualDirectories=[];

                                        // get random files and directories for the question
                                        while(actualName.includes("::file::")){
                                            count++;
                                            if(count==1){
                                                actualName=actualName.replace("::file::",actualFile1);
                                                actualFiles.push(actualFile1);}
                                            else if(count==2){
                                                actualName=actualName.replace("::file::",actualFile2);
                                                actualFiles.push(actualFile2);
                                                }
                                            }
                                         count=0;
                                         while(actualName.includes("::directory::")){
                                             
                                            count++;
                                            if(count==1){
                                                actualName=actualName.replace("::directory::",actualDirect1);
                                                actualDirectories.push(actualDirect1);}
                                            else if(count==2){
                                                actualName=actualName.replace("::directory::",actualDirect2);
                                                actualDirectories.push(actualDirect2)
                                                }
                                             }

                                        // get what the actual answer should be with the
					// random directories
					count=0
					var actualCorrectAnswer = question.crtAnswer;
					var theFiles = [actualFile1, actualFile2];
					while (actualCorrectAnswer.includes("::file::"))
					{
						actualCorrectAnswer = actualCorrectAnswer.replace("::file::", theFiles[count]);
						count++;
					}
                                        count=0
                                        var theDirs = [actualDirect1, actualDirect2];
                                        while (actualCorrectAnswer.includes("::directory::"))
                                        {
                                                actualCorrectAnswer = actualCorrectAnswer.replace("::directory::", theDirs[count]);
                                                count++;
                                        }

                                        // make object to send to store
                                        var storedQues={
                                            questionName:question.questionName,
                                            description:question.description,
                                            actualDescription:actualName,
                                            files:actualFiles,
                                            directories:actualDirectories,
                                            crtAnswer:question.crtAnswer,
					    actualCrtAnswer:actualCorrectAnswer,
                                            usrAnswer:"",
                                            usrCorrect:false,
                                            checkStandard:question.checkStandard
                                            }

                                        // store the object and return the question to front end
					var quizLen = (stuQuizzes.length-1).toString();
					var pushStr = "quizzes." + quizLen + ".questions";
					var push = {};
					push[pushStr] = storedQues;
					//console.log("1111111111"); 
                                        students.update(
                                        { "email": user },
                                        { "$push":push })
                                        .then(function(theStudent) {
                                                students.find({email:user},function(err,theStudent2)
                                                {

					             var tquizzes=theStudent2[0].quizzes;
                                             var tquestions=theStudent2[0].quizzes[tquizzes.length-1].questions;
                                     		//console.log(tquestions);
					res.json({
                                        questionName:tquestions[tquestions.length-1].questionName,
                                        description:tquestions[tquestions.length-1].actualDescription,
                                        questNum:tquestions.length,
                                        maxQuestNum:max
                                        });




						});
					});




                                                });



					});


                                });

	
		      }
		});
};








// this controller adds a question to the db
var addQuestion = function(req,res,next)
{
    var ques=new Question(req.body);
    ques.save(function(err)
	      {
		  if(err)
		      {
			  return next(err);
			  }
		  else
		     {
			 res.json(req.body);
		     }
		  });
};


// this controller adds a student to the db
var addStudent = function(req,res,next)
	     {
		 var stu = new students(req.body);
		 ////console.log(req.body);
		 stu.save(function(err)
			  {
			      if(err)
			      {
				  return next(err);
			      }
			      else
			      {
				  res.json(stu);
			      }
			  });
	     };



// this controller returns all of the reports for a student
var getStuQuizReports = function(req,res,next)
    {
	var user=req.user.email;
	students.find({email:user},function(err,student)
		 {
		     if(err)
		     {
			 return next(err);
		     } else
		     {
			var quizes = student[0].quizzes;
			if (quizes.length != 0)
			{
				// if there is a finished quiz
				if (quizes[quizes.length-1].finished == false)
				{
					quizes.pop();
				}
			 	res.json({quizzes:quizes});
			}
			else
			{
				res.json({quizzes:{}});
			}
		     }
		 });
	};
	



// this controller returns the latest report for a student
var getCurrentReport = function(req,res,next)
{
	var user=req.user.email;
	var gradeNum=0;
	var gradeDen=0;
	students.find({email:user},function(err,student)
	{
		if (err)
		{
			return next(err);
		} else
		{
			var quizzes = student[0].quizzes;
			var quiz = quizzes[quizzes.length-1];
			var questionsData = quiz.questions;
                        // grade the quiz
			questionsData.forEach(function(que)
			{
				if (que.usrCorrect==true)
				{
					gradeNum = gradeNum + 1;
				}
				gradeDen = gradeDen + 1;
			});
			var gradeData = (gradeNum / gradeDen)*100;
			student[0].quizzes[quizzes.length-1].grade = gradeData;
			student[0].quizzes[quizzes.length-1].finished=true;
			// store the quiz in the db
			var quizLen = (quizzes.length-1).toString();
                        var pushStr1 = "quizzes." + quizLen + ".grade";
                       	var pushStr2 = "quizzes." + quizLen + ".finished";
                                  var push = {};
                                  push[pushStr1] = gradeData;
                                  push[pushStr2] = true;
                                        students.update(
                                        { "email": user },
                                        { "$set": push })
                                        .then(function(theStudent) {
                                        students.find({email:user},function(err,student)
                                        {
                                        	res.json({
							grade: gradeData,
                                        		questions: questionsData
                                		});

                                        });


                          });






		}

	});
};


// this function gets an element of an array
// that contains a given key
function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i]._id == nameKey) {
            return myArray[i];
        }
    }
}




// this controller gets a report by its id
var getReportById = function(req,res,next)
{
	var resultID = req.params.resultID;
	var user=req.user.email;
        students.find({email:user},function(err,student)
        {
                if (err)
                {
                        return next(err);
                } else
                {
                        var quizzes = student[0].quizzes;
			var obj = search(resultID, quizzes);
                        var questionsData = obj.questions;
                        var gradeData = obj.grade;
                        res.json({
                                grade: gradeData,
                                questions: questionsData
                        });
                }

        });

};


// this controller gets the questions percentage of
// all of the students for the teacher view
var getQuestionsSummary = function(req,res,next)
{
	var user = req.user.email;
	var questionDict = {}
	students.find({},function(err,student)
        {
		//console.log("IN GET QUESTIONS");
                if (err)
                {
                        return next(err);
                } else
                {
                        // for each student tally up how they did
                        // on each question to get the class
                        // ratio for each question
			student.forEach(function(stu)
			{
				var stuQuizzes = stu.quizzes;
				stuQuizzes.forEach(function(stuQuiz)
				{
					var stuQuestions = stuQuiz.questions;
					stuQuestions.forEach(function(stuQuestion)
					{
						var correctBool = stuQuestion.usrCorrect;
						var qName = stuQuestion.questionName;
						var desc = stuQuestion.description;
						var cAnswer = stuQuestion.crtAnswer;
						if (questionDict[desc] == undefined)
						{
							questionDict[desc] = {
								questionName: qName,
								crtAnswer: cAnswer,
								correct: 0,
								total: 0.0
							};
						}
						if (correctBool)
						{
							questionDict[desc].correct = questionDict[desc].correct + 1;
						}
						questionDict[desc].total = questionDict[desc].total + 1;
						
					});
				});
			});

                        // send the data to the front end
			resArray = [];
			for (var key in questionDict)
			{
				//console.log("------xxxxx-----------");
				//console.log(questionDict[key]);
				var keyObj = questionDict[key];
				resArray.push({
					questionName: keyObj.questionName,
					description: key,
					crtAnswer: keyObj.crtAnswer,
					crtRatio: (keyObj.correct / keyObj.total)*100
				});

			}
                        
			res.json({
				questions: resArray
                        });
                }

        });

};




// this controller returns the average for each student
// for the teacher view
var getStudentsSummary = function(req,res,next)
{
	var user = req.user.email;
	var stuArray = [];
	//console.log("IN STU SUMMARY");
	students.find({},function(err,student)
        {
		//console.log(student);
		//console.log("end student>>>>");
                if (err)
                {
                        return next(err);
                } else
                {
                        // calculate each students average
                        student.forEach(function(stu)
                        {
				var stuID = stu._id;
				var stuFirst = stu.firstName;
				var stuLast = stu.lastName;
				var quizzes = stu.quizzes;
				//console.log(quizzes);
				if (quizzes.length != 0)
				{
					var dateTaken = quizzes[quizzes.length-1].dateTaken;
					var gradeNum = 0;
					var gradeDen = 0;
					quizzes.forEach(function(quiz)
					{
						gradeNum = gradeNum + quiz.grade;
						gradeDen = gradeDen + 1;
					});
					var totalGrade = (gradeNum / gradeDen);
					stuArray.push({
						_id: stuID,
						firstName: stuFirst,
						lastName: stuLast,
						latestDate: dateTaken,
						averageGrade: totalGrade
					});
				}
			});
			res.json({
				students: stuArray
			});
		}
	});
	
};



// this controller gets all of the quizzes for a student
// for the teacher view
var getAllStudentsQuizzes = function(req,res,next)
{
	students.find({},function(err,student)
	{
		if (err)
                {
                        return next(err);
                } 
		else
                {
			res.json({students:student});
		}


	});
};


// this controller gets the report for a single
// quiz for the teacher view
var getStudentReportWithId = function(req,res,next)
{
	var ObjectId = require('mongoose').Types.ObjectId; 
	////console.log("IN GET STUDENT REPORT WITH ID");
	var stuID = req.params.studentID;
	var quizID = req.params.quizID;
	////console.log(stuID);
	students.find({_id:stuID},function(err,student)
        {
                if (err)
                {
                        return next(err);
                }
                else
                {
			////console.log(student);
			////console.log("ABCDEFGH");
			var quizzes = student[0].quizzes;
			var quiz = search(quizID, quizzes);
                        res.json({
				grade: quiz.grade,
				questions: quiz.questions
			});
                }


        });

};


    


    // define functions for express routing
    return {
	getQuestion:getQuestion,
	addQuestion:addQuestion,
	getStuQuizReports:getStuQuizReports,
	addStudent:addStudent,
	getCurrentReport:getCurrentReport,
	getReportById:getReportById,
	checkAnswer:checkAnswer,
        getQuestionsSummary:getQuestionsSummary,
        getStudentsSummary:getStudentsSummary,
        getAllStudentsQuizzes:getAllStudentsQuizzes,
        getStudentReportWithId:getStudentReportWithId

	}


}
