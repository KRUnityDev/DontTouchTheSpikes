
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var Actual_Score = 0;
var Best_Score = 0;


function Reset()
{
	if (Actual_Score>Best_Score)
	{
		Best_Score = Actual_Score;
	}
	Actual_Score = 0;
}

function Draw_Score()
{
	
	ctx.fillStyle = 'grey';
	ctx.textAlign = 'center';
	ctx.font = "100px FontAwesome";
	ctx.fillText(Actual_Score,canvas.width/2,canvas.height/2-150);
	ctx.font = "20px FontAwesome";
	ctx.fillText("BEST SCORE: "+Best_Score,canvas.width/2,canvas.height/2-120);
}

function Add_Score()
{
	Actual_Score++;
}