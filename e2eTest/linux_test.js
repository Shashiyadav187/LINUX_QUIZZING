


var getQuestionData = function()
{

return JSON.parse(`
{
  "questions":[
	{
            "questionName":"Change Directory",
            "description":"Change the directory from the current directory to the ::directory::",
	"checkStandard":"String",
            "crtAnswer":"cd ::directory::"
	},
        {
            "questionName":"Who's on",
            "description":"Print out who is using the computer",
	"checkStandard":"String",
            "crtAnswer":"who"
        },
        {
            "questionName":"List long form",
            "description":"List out all of the items in your current directory in long form",
	"checkStandard":"String",
            "crtAnswer":"ls -l"            
        },
        {
            "questionName":"List long form for humans",
            "description":"List out all of the items in your current directory with the file size in a human readable format",
	"checkStandard":"String",
            "crtAnswer":"ls -lh"            
        },
        {
            "questionName":"Make a directory",
            "description":"Make a directory in your current directory called ::directory::",
"checkStandard":"String",
            "crtAnswer":"mkdir ::directory::"
        },
        {
            "questionName":"Copy a file",
            "description":"Copy the ::file:: to ::file::",
	"checkStandard":"File",
            "crtAnswer":"cp ::file:: ::file::"
        },
        {
            "questionName":"Display path",
            "description":"Show the path to your current directory",
	"checkStandard":"String",
"crtAnswer":"pwd"
        },
        {
            "questionName":"Showing text of files",
            "description":"Print out all of the text in file ::file::",
	"checkStandard":"File",
            "crtAnswer":"cat ::file::"
        },
        {
            "questionName":"Getting the first lines",
            "description":"Print out the first ten lines of ::file::",
	"checkStandard":"File",
            "crtAnswer":"head ::file::"
        },
        {
            "questionName":"Getting the last lines",
            "description":"Print out the last ten lines of ::file::",
	"checkStandard":"File",
            "crtAnswer":"tail ::file::"
        },
        {
            "questionName":"Remove a Directory",
            "description":"Remove the directory from the current directory called ::directory::",
	"checkStandard":"File",
            "crtAnswer":"rm -r ::directory::"
        },
        {
            "questionName":"Remove a File",
            "description":"Remove the ::file:: from the current directory",
	"checkStandard":"File",
            "crtAnswer":"rm ::file::"
        },
        {
            "questionName":"SSH",
            "description":"SSH into cs-owl as if your username was john smith",
	"checkStandard":"String",
            "crtAnswer":"ssh john.smith@cs-owl"
        },
   {
            "questionName":"grep",
            "description":"Search for the string 'john' in ::file::",
	"checkStandard":"File",
            "crtAnswer":"grep john ::file::"
        },
   {
            "questionName":"grep multiple files",
            "description":"Search for the string 'john' in any file that ends in .txt in your current directory",
	"checkStandard":"File",
            "crtAnswer":"grep john *.txt"
        },
   {
            "questionName":"history",
            "description":"Display a history of commands you have typed",
	"checkStandard":"String",
            "crtAnswer":"history"
        },
   {
            "questionName":"Diff",
            "description":"Display the differences between ::file:: and ::file::",
	"checkStandard":"File",
            "crtAnswer":"diff ::file:: ::file::"
        },
   {
            "questionName":"count the number of lines",
            "description":"use word count to count the number of lines in ::file::",
	"checkStandard":"String",
            "crtAnswer":"wc -l ::file::"
        },
   {
            "questionName":"count the number of words",
            "description":"use word count to count the number of words in ::file::",
	"checkStandard":"String",
            "crtAnswer":"wc -w ::file::"
        },
{
            "questionName":"count the number of characters",
            "description":"use word count to count the number of characters in ::file::",
	"checkStandard":"String",
            "crtAnswer":"wc -c ::file::"
        },
   {
            "questionName":"Piping",
            "description":"Search for the string john in your command history",
	"checkStandard":"String",
            "crtAnswer":"history | grep john"
        },
   {
            "questionName":"Grep recursively",
            "description":"Search for the string john in all of your files and all subdirectories of your current directory",
	"checkStandard":"File",
            "crtAnswer":"grep john -r *"
        },
{
            "questionName":"show logged-in users",
            "description":"show the list of all the users currently logged in to the system",
	"checkStandard":"String",
            "crtAnswer":"who"
        },
   {
            "questionName":"Active Processes",
            "description":"Use the command that would display all active processes on the computer",
	"checkStandard":"String",
            "crtAnswer":"top"
        },
{
            "questionName":"redirect output",
            "description":"redirect the content of ::file:: to ::file::",
	"checkStandard":"File",
            "crtAnswer":"cat ::file:: > ::file::"
        },
{
            "questionName":"redirect output at the end",
            "description":"redirect the content of ::file:: to ::file:: without overwriting the second file",
	"checkStandard":"File",
            "crtAnswer":"cat ::file:: >> ::file::"
        },
{
            "questionName":"Text editors",
            "description":"Open the ::file:: in emacs",
	"checkStandard":"String",
            "crtAnswer":"emacs ::file::"
        },
{
            "questionName":"Text editors",
            "description":"Open the ::file:: in emacs but run it in the background",
	"checkStandard":"String",
            "crtAnswer":"emacs ::file:: &"
        },
{
            "questionName":"Rerun stopped processes",
            "description":"Take any stopped process and run it in the background",
	"checkStandard":"String",
            "crtAnswer":"bg"
        },
{
            "questionName":"make a tar file",
            "description":"Make a tar file named test123.tar that includes everything in the ::directory:: directory which is in the current directory",
	"checkStandard":"String",
            "crtAnswer":"tar -cvf test123.tar ./::directory::"
        }
    ]

}`);


};



describe("LINUX TESTS", function()
{
var baseURL = "http://localhost:8081/";
var server=require("../test_server.js");
    
    describe('on start of test',function()
	     {
		 beforeEach(function()
			    {
				browser.get(baseURL);
			    });
		

		it("can add questions",function()
		{
			getQuestionData().questions.forEach(function(queObj)
			{
				console.log("abdcderfdsjal;f");
				browser.get(baseURL+"#!/addQuestion");
				console.log("IN ADD QUESTION asdfs");
			
				var qName = element(by.id("questionName"));
				var qDesc = element(by.id("questionDescr"));
				var qAns = element(by.id("crtAnswer"));
				var qStand = element(by.id("checkStandard"));

				qName.sendKeys(queObj.questionName);
				qDesc.sendKeys(queObj.description);
				qAns.sendKeys(queObj.crtAnswer);
				qStand.sendKeys(queObj.checkStandard);

				var button = element(by.css(".greenButton"));
				button.click();
			});
		});




		 it("will have the inputs",function()
		    {	
			var passwordInput=element(by.id("passwordInput"));
			var emailInput=element(by.id("emailInput"));
			expect(passwordInput).toBeDefined();
			expect(emailInput).toBeDefined();
		    });
		 it("will have the buttons",function()
		    {	
			var signupButton=element(by.css(".blueButton"));
			var loginButton=element(by.css(".greenButton"));
			expect(signupButton).toBeDefined();
			expect(loginButton).toBeDefined();
		    });
		 
		 it("will get button text",function()
		    {	
			var signupButton=element(by.css(".blueButton"));
			var loginButton = element(by.css(".greenButton"));
			expect(signupButton.getText()).toEqual("Sign Up");
			expect(loginButton.getText()).toEqual("Login");
		    });

		  it("will go to signup page",function()
		    {	
			var signupButton=element(by.css(".blueButton"));
			signupButton.click();			
		    });
                  it("will go to signup page and get text of signup button",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
			var submitButton = element(by.css(".greenButton"));
			expect(submitButton.getText()).toEqual("Submit");
                    });
                  it("will not sign up a user without first name",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        //firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user without last name",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        //lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user without email",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        //emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user without password",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        //passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user without reentered password",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        //repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user with too short password",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("1234");
                        repasswordInput.sendKeys("1234");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will not sign up a user with passwords that don't match",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscienceisdf110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });
                  it("will sign up a user",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/dashboard");
                    });
		  it("will not sign up a user if the user already exists",function()
                    {
                        var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Alex");
                        lastNameInput.sendKeys("Luken");
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        repasswordInput.sendKeys("ilovecomputerscience110001");
                        submitButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/signup");
                    });

		 it("will log in the user",function()
                    {
                        var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));
                        
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        loginButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/dashboard");
                    });
		 it("will let the log in user to go to take the quiz", function()
		    {
			var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));
                        
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        loginButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/dashboard");

			var takeQuiz=element(by.css(".greenButton"));
			takeQuiz.click();
			expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/quiz");
		
			for (var i=0;i<5;i++){	
			    var textField=element(by.id("commandText"));
			    textField.sendKeys("lalala");
			    textField.sendKeys(protractor.Key.ENTER);
			    var nextButton=element(by.css(".greenButton"));
			    nextButton.click();
			}
			expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/report");
			
		    });
		 it("will let the log in user to go to the view quiz report, and view individual quiz report and retake it",function()
                    {

                        var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));
                        
                        emailInput.sendKeys("alex.luken@centre.edu");
                        passwordInput.sendKeys("ilovecomputerscience110001");
                        loginButton.click();
                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/dashboard");
			
			var viewReport=element(by.css(".blueButton"));
			viewReport.click();
			expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/viewReports");

			var individualReport=element(by.tagName("a"));
			individualReport.click();
			expect(browser.getCurrentUrl()).toContain("report");
			
			var retakeQuizButton=element(by.css(".greenButton"));
			retakeQuizButton.click();
			expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/quiz");
			for (var i=0;i<5;i++){	
			    var textField=element(by.id("commandText"));
			    textField.sendKeys("lalala");
			    textField.sendKeys(protractor.Key.ENTER);
			    var nextButton=element(by.css(".greenButton"));
			    nextButton.click();
			}
			expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/report");
                    });
		 it("will sign up the teacher: dave@centre.edu",function()
		    {

			var signupButton=element(by.css(".blueButton"));
                        signupButton.click();
                        var submitButton = element(by.css(".greenButton"));
                        var emailInput = element(by.id("emailInput"));
                        var passwordInput = element(by.id("passwordInput"));
                        var repasswordInput = element(by.id("repasswordInput"));
                        var firstNameInput = element(by.id("firstNameInput"));
                        var lastNameInput = element(by.id("lastNameInput"));

                        firstNameInput.sendKeys("Dave");
                        lastNameInput.sendKeys("Toth");
                        emailInput.sendKeys("dave@centre.edu");
                        passwordInput.sendKeys("012345678asdf");
                        repasswordInput.sendKeys("012345678asdf");
                        submitButton.click();

                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/dashboard");
		    });
		 it("the teacher can log in to view reports for all different questions",function()
		    {
		
			var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));

                        emailInput.sendKeys("dave@centre.edu");
                        passwordInput.sendKeys("012345678asdf");
                        loginButton.click();

                        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/teacherDashboard");
		    });
		  it("the question exist in teacher table",function()
		    {
		
			var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));

                        emailInput.sendKeys("dave@centre.edu");
                        passwordInput.sendKeys("012345678asdf");
                        loginButton.click();

                        var questionName=element(by.tagName("p"));
			expect(questionName).toBeDefined();
		    });
		 it("redirect to individual student report",function()
		    {
		
			var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));

                        emailInput.sendKeys("dave@centre.edu");
                        passwordInput.sendKeys("012345678asdf");
                        loginButton.click();

			var studentReport=element(by.id("stuReports"));
			studentReport.click();
                        var reportLink=element(by.css(".reportLink"));
			reportLink.click();
			expect(browser.getCurrentUrl()).toContain("studentGrades");
		    });
		  it("redirect to individual student report",function()
		    {
		
			var loginButton=element(by.css(".greenButton"));
			var emailInput = element(by.id("emailInput"));
			var passwordInput = element(by.id("passwordInput"));

                        emailInput.sendKeys("dave@centre.edu");
                        passwordInput.sendKeys("012345678asdf");
                        loginButton.click();

			var studentReport=element(by.id("stuReports"));
			studentReport.click();
                        var reportLink=element(by.css(".reportLink"));
			reportLink.click();
			
			var reportLink2=element(by.css(".reportLink"));
			reportLink2.click();

			expect(browser.getCurrentUrl()).toContain("report");
		    })
	     })

    
});
