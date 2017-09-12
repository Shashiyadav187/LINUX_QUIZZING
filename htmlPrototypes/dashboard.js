var interval;
var timerStorage = "q1Time";
var timesThrough = 0;

/*
window.onload = function () {
    var seconds = 60,
        display = document.querySelector('#timer');
    startTimer(seconds, display);
};*/


/*
function startTimer(duration, display) {
    var start = Date.now()
    if (localStorage.getItem(timerStorage) != undefined)
        {
            start = localStorage.getItem(timerStorage);
            console.log(start);
        }
    var diff,
        minutes,
        seconds;
    function timer() {
        timesThrough = timesThrough + 1;
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);
        
        if (diff != -1) {

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        if (seconds <= 20)
        {
            $( "#timer" ).removeClass("normalTime");
            $( "#timer" ).addClass("littleTime");
        }
        localStorage.setItem(timerStorage, start);

        display.textContent = minutes + ":" + seconds;
        console.log(seconds);
        if (seconds == 0 && timesThrough != 1)
            {
                document.getElementById("commandText").value = document.getElementById("commandText").value + "\n\nUh oh, you ran out of time!";
                document.getElementById("commandText").readOnly = "true";
                localStorage.removeItem(timerStorage);
                clearInterval(interval);  
            }
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    interval = setInterval(timer, 1000);
}*/

// function to catch 'enter' key pressed on quiz dashboard
function onTestChange() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        if (document.getElementById("commandText").readOnly == false)
        {
            document.getElementById("commandText").value = document.getElementById("commandText").value + "\n\nYour Answer has been Recorded, Please proceed to the next question.";
            document.getElementById("commandText").readOnly = "true";
            clearInterval(interval);
            localStorage.removeItem(timerStorage);
        }
        return false;
    }
}