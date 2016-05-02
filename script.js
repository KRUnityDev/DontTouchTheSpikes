
//pobieranie danych z dokumentu
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//ustawianie ctx
ctx.font = "120px FontAwesome";

//obsluga klawiszy
document.addEventListener("click", Jump, false);
document.addEventListener("click", StartControl, false);

var GameStarded = false;


//Wartosc grawitacji oraz przyspiszenie
var Gravity = 10;



var Sprite = new Image();
Sprite.src = "sprites/Logo.png";


//Left Direction = -1 Right Direction = 1
function SpikeClass(Size_x, Size_y, position_y,direction)
{
	this.direction = direction;
	this.position_y = position_y;
	this.Size_x = Size_x;
	this.Size_y = Size_y;
	this.position_x = canvas.width - Size_x;
}
SpikeClass.prototype.draw = function()
{
ctx.beginPath();
if (this.direction == 1)
{
	ctx.rect(0, this.position_y, this.Size_x, this.Size_y);
}
else
{
	ctx.rect(canvas.width-this.Size_x, this.position_y, this.Size_x,  this.Size_y);
}

ctx.fillStyle = "#0000FF";
ctx.fill();
ctx.closePath();
}


function Player(Size_x,Size_y, Position_x,Position_y, Acceleration_Y, Move_Direction,Player_Speed)
{
	this.Size_x = Size_x;
	this.Size_y = Size_y;
	this.Position_x = Position_x;
	this.Position_y = Position_y;
	this.Acceleration_Y = Acceleration_Y;
	this.Move_Direction = Move_Direction;
	this.Player_Speed = Player_Speed;
}
Player.prototype.draw = function()
{
	
ctx.beginPath();
ctx.rect(this.Position_x, this.Position_y, this.Size_x, this.Size_y);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

}
Player.prototype.update = function()
{
	this.Acceleration_Y += 0.1;
	this.Position_y += this.Acceleration_Y;
	
	if (this.Position_x <= 0)
	{
		this.Move_Direction = 1;
	}
	if(this.Position_x+this.Size_x >= canvas.width)
	{
		this.Move_Direction = -1;
	}
	if(this.Position_y+this.Size_y<0 || this.Position_y>canvas.height)
	{
		EndGame();
	}
	
	
	this.Position_x += this.Player_Speed*this.Move_Direction;
}
Player.prototype.jump = function ()
{
	this.Acceleration_Y = -5;
}
Player.prototype.collisionDetect = function(SpikeClass)
{
	if (SpikeClass.direction == -1)
	{
		
		if ((this.Position_y < SpikeClass.position_y && this.Position_y+this.Size_y > SpikeClass.position_y)||(this.Position_y < SpikeClass.position_y + SpikeClass.Size_y && this.Position_y + this.Size_y > SpikeClass.position_y+SpikeClass.Size_y))
		{
		
			if (this.Position_x+this.Size_x>SpikeClass.position_x)
			{
			EndGame();
			}
			
			
		}

	}
	
}


var Gracz = new Player(50,50,canvas.width/2-25,canvas.height/2-25,0,-1,2);
var Kolec = new SpikeClass(20,20,canvas.height/2,-1);

function DrawScene()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);

	Gracz.draw();
	Kolec.draw();

	if(!GameStarded)
	{
	ctx.beginPath();
	ctx.fillStyle = 'grey';
	ctx.textAlign = 'center';
	ctx.fillText("\uf01d",canvas.width/2,canvas.height/2+30);
	ctx.closePath();
	}
}

function Update() {

if (GameStarded)
{
Gracz.update();
Gracz.collisionDetect(Kolec);
}
DrawScene();
}

function Jump(e)
{
		Gracz.jump();
}

function StartControl()
{
	if (!GameStarded)
	{
		GameStarded = true;
	}
}

function EndGame()
{
	ClearGame();
}

function ClearGame()
{
	refreshScript('script.js');
}

var index = 0;
function refreshScript (src) {
  window.clearInterval(Interval_ID);
  var scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.src = src + '?' + index++;
  document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

//Ustawia by funkcja Update wykonywała się co 10 ms
var Interval_ID = setInterval(Update, 10)
