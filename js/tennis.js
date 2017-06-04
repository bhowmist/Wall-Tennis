/**
 * Created by Jit on 5/29/2017.
 * Wall Tennis - an intelligent tennis game
 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//paddle size
const paddleWidth=20;
const paddleHeight=100;

//ball size
const ballRadius=5;

//ball start position
var ballX=paddleWidth+ ballRadius;
var ballY=canvas.height/2;

//ball movement
var ballShiftX=5;
var ballShiftY=5;

//number of time frames per second
var timeFrame=30;

//ball deviation
var deltaY;

//players paddle top position
var playerLeft_Y = (canvas.height-paddleHeight)/2;
var playerRight_Y =(canvas.height-paddleHeight)/2;

//right player movement speed
var rightPlayerSpeed=10;

//midway in the game
var speedIncreased=false;

//set the criteria to chase the ball
var halfPaddle=(paddleHeight)/2;
var paddleCenterDistance=halfPaddle/2;  //=50/2=25

//angle of deviation
var leftPlayerAngle=.35;
var rightPlayerAngle=.35;

//player score
var leftPlayerScore=0;
var rightPlayerScore=0;

//winning score
const WINNING_SCORE=5;

//setInterval variable
var interval;

//if someone won or system restarted
var winnerFound=false;



/*start function entry point
reset variables
executed only when one match is finished
or user press the reset button
 */
function systemReset(){
    if (winnerFound) {
        winnerFound = false;

        //reset player score
        leftPlayerScore = 0;
        rightPlayerScore = 0;

        //reset ball position
        ballX=paddleWidth+ ballRadius;
        ballY=canvas.height/2;

        //reset movement speed
        ballShiftX=5;
        ballShiftY=5;

        //reset movement angle
        leftPlayerAngle=.35;
        rightPlayerAngle=.35;


        //reset paddle position
        playerLeft_Y = (canvas.height-paddleHeight)/2;
        playerRight_Y =(canvas.height-paddleHeight)/2;


        //reset right paddle speed
        rightPlayerSpeed=10;

        //reset deviation factor
        deltaY=0;

        //reset winning condition
        speedIncreased=false;


        //reset distance criteria as from the center of the paddle
        paddleCenterDistance=halfPaddle/2;;


        //reset score counter
        document.getElementById("rightPlayer").innerHTML = rightPlayerScore;
        document.getElementById("leftPlayer").innerHTML = leftPlayerScore;

    }

}


//draw components
function drawObjects(){

   if (winnerFound){
        return;
    }

    //canvas properties
    drawSize(0,0,canvas.width,canvas.height,"green");

    //left player
    drawSize(0,playerLeft_Y ,paddleWidth,paddleHeight,"black");

    //right player
    drawSize(canvas.width-paddleWidth,playerRight_Y,paddleWidth,paddleHeight,"black");

    //draw ball
    drawCircle(ballX,ballY,ballRadius,0,2*Math.PI,"red");

    //draw net
    for (var i=0;i<canvas.height;i++){
        drawSize(canvas.width/2,i ,2,5,"white");
    }

}


//draw circle
function drawCircle(xAxis,yAxis,radius,startAngle,endAngle,circleColor){
    ctx.fillStyle = circleColor;
    ctx.beginPath();
    ctx.arc(xAxis,yAxis,radius,startAngle,endAngle);
    ctx.fill();
}


//draw shapes
function drawSize(xAxis,yAxis,pWidth, pHeight,fillColor){
    ctx.fillStyle = fillColor;
    ctx.fillRect(xAxis,yAxis,pWidth,pHeight);
}



//ball movement
function moveBall() {

    if (winnerFound){
        clearInterval(interval);
        document.getElementById("start").disabled=false;
        return;
    }

    //ball movement
    ballX = ballX + ballShiftX;
    ballY = ballY + ballShiftY;

    //move right paddle
    moveRightPlayer();


    //left player control
    if (ballX <= paddleWidth) {
        if (ballY >= playerLeft_Y && ballY <= (playerLeft_Y + paddleHeight) && (ballX == paddleWidth)) {

            ballShiftX = -ballShiftX;
            //control ball deviation
            deltaY = ballY - (playerLeft_Y + paddleHeight / 2);
            //shift ball
            ballShiftY = deltaY * leftPlayerAngle;
        }

        //left player misses the ball
        else if (ballX <=0 && ballX< paddleWidth) {

            rightPlayerScore += 1;
            //highlight counter
            document.getElementById("rightPlayer").innerHTML = "<div style='background-color: rgba(211,84,0,0.73); border-radius: 6px;'>"+ rightPlayerScore+ "</div>";
            setTimeout(function(){document.getElementById("rightPlayer").innerHTML = "<div style='background-color:  #85980b;border-radius: 6px;'>"+ rightPlayerScore+ "</div>";}, 1000);

            //reset ball position
            ballReset();
        }
    }


    //right player control
    if (ballX >= canvas.width - paddleWidth) {

        if ((ballY >= playerRight_Y) && (ballY <= (playerRight_Y + paddleHeight)) && ballX == (canvas.width - paddleWidth)) {

            ballShiftX = -ballShiftX;
            //ball deviation
            deltaY = ballY - (playerRight_Y + paddleHeight / 2);
            //shift ball
            ballShiftY = deltaY * rightPlayerAngle;
        }

        //right player misses the ball
        else if ((ballX > canvas.width - paddleWidth) && (ballX >= 0)) {

            leftPlayerScore += 1;
            //highlight counter
            document.getElementById("leftPlayer").innerHTML = "<div style='background-color: rgba(211,84,0,0.73); border-radius: 6px;'>"+ leftPlayerScore+ "</div>";
            setTimeout(function(){document.getElementById("leftPlayer").innerHTML = "<div style='background-color: #85980b;border-radius: 6px;'>"+ leftPlayerScore+ "</div>";}, 1000);

            //reset ball position
            ballReset();
        }
    }
    //when the ball hit the upper or lower edge , reflect it
    if (ballY >= canvas.height || ballY <=0){
        ballShiftY=-ballShiftY;
    }
     //if winner found then show on the screen
     getWinner();
}

//find the mouse position inside the canvas
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var html = document.documentElement;
    return {
        x: evt.clientX - rect.left - html.scrollLeft,
        y: evt.clientY - rect.top -html.scrollTop
    };
}


//new serve from the center, in the opposite direction
function ballReset(){
      ballShiftX=-ballShiftX;
      ballX = canvas.width/2;
      ballY = canvas.height/2;
      ballShiftY=-ballShiftY/2;
}

//move the right side player
function moveRightPlayer(){

    var paddleCenter = playerRight_Y + halfPaddle;

    //with increasing winning chance game difficulty increases
    if (leftPlayerScore>= WINNING_SCORE/2 && speedIncreased==false){
        paddleCenterDistance += (halfPaddle/4);
        rightPlayerSpeed*=1.3;
        speedIncreased=true;
        rightPlayerAngle+=.10;
        leftPlayerAngle+=.05;
    }

    //stops shaking of the paddle
    //move up
    if (ballY <= paddleCenter - paddleCenterDistance) {
        playerRight_Y -= rightPlayerSpeed;
        if (playerRight_Y<0){
            playerRight_Y=0;
        }
    }
    //move down
    else if(paddleCenter + paddleCenterDistance<= ballY){
        playerRight_Y+= rightPlayerSpeed;

        if (playerRight_Y+ paddleHeight> canvas.height){
            playerRight_Y=canvas.height- paddleHeight;
        }
    }
}

//find the winner
function getWinner(){
    ctx.font="30px Verdana";
    //left player wins
    if (leftPlayerScore >= WINNING_SCORE){
         ctx.fillText("Congratulations, you won!", canvas.width/2 -200 ,canvas.height/2 -50);
         winnerFound= true;
    }
    //auto paddle wins
    else if (rightPlayerScore >= WINNING_SCORE){
        ctx.fillText("Oops, you lost!", canvas.width/2 - 100,canvas.height/2 - 50);
        winnerFound= true;
    }
}


//after the page is loaded
window.onload = function(){
    drawObjects();

    //execute on start button click
    document.getElementById("start").addEventListener("click",function(){
            document.getElementById("pause").disabled=false;
            document.getElementById("re-set").disabled=false;
            //if winner found or reset button is pressed
            systemReset();
            //execute functions on regular intervals
            interval= setInterval(function(){
                drawObjects();
                moveBall();
            },1000/timeFrame);


            //mouse control
            canvas.addEventListener('mousemove', function(evt) {
                var mousePos = getMousePos(evt);
                //mouse position at the center of the paddle
                playerLeft_Y = mousePos.y - paddleHeight / 2;

                //restrict left paddle inside canvas
                if((playerLeft_Y ) <=0){
                    playerLeft_Y= 0 ;
                }
                else if(playerLeft_Y + paddleHeight>=canvas.height){
                    playerLeft_Y= canvas.height- paddleHeight ;
                }
            });

    });


    //execute when pause button is clicked
    document.getElementById("pause").addEventListener("click",function(){
        clearInterval(interval);
        document.getElementById("re-set").disabled=false;
        document.getElementById("start").disabled=false;
    });

    //when reset button is clicked
    document.getElementById("re-set").addEventListener("click",function(){
        winnerFound=true;
        moveBall();
        systemReset();
        drawObjects();
        document.getElementById("pause").disabled=true;

    });

}



