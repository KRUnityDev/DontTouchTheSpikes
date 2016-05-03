
//pobieranie danych z dokumentu
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


//obsluga klawiszy
document.addEventListener("click", Jump, false);
document.addEventListener("click", StartControl, false);


var GameStarded = false;


//Wartosc grawitacji oraz przyspiszenie
var Gravity = 10;


//pobieranie obrazków
var Player_Sprite = new Image();
Player_Sprite.src = "sprites/pig.png";

var R_Spike_Sprite = new Image();
R_Spike_Sprite.src = "sprites/RSpike.png"

var L_Spike_Sprite = new Image();
L_Spike_Sprite.src = "sprites/LSpike.png"


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
//metoda rysująca kolec
SpikeClass.prototype.draw = function()
{
	
ctx.beginPath();
if (this.direction == 1)
{
	//ctx.rect(0, this.position_y, this.Size_x, this.Size_y);
	ctx.drawImage(R_Spike_Sprite,0,this.position_y,this.Size_x,this.Size_y);
}
else
{
	//ctx.rect(canvas.width-this.Size_x, this.position_y, this.Size_x,  this.Size_y);
	ctx.drawImage(L_Spike_Sprite,canvas.width-this.Size_x,this.position_y,this.Size_x,this.Size_y);
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
//Metoda rysująca gracza
Player.prototype.draw = function()
{
	
ctx.beginPath();
//ctx.rect(this.Position_x, this.Position_y, this.Size_x, this.Size_y);
ctx.drawImage(Player_Sprite,this.Position_x,this.Position_y,this.Size_x,this.Size_y);

ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

}
//Metoda odpowiedzielna za poruszanie się gracza oraz sprawdzająca czy nie jest za wysoko lub za nisko
Player.prototype.update = function()
{
	this.Acceleration_Y += 0.1;
	this.Position_y += this.Acceleration_Y;
	
	if (this.Position_x <= 0)
	{
		this.Move_Direction = 1;
		Add_Score();
		GenerateSpikes(-1);
	}
	if(this.Position_x+this.Size_x >= canvas.width)
	{
		this.Move_Direction = -1;
		Add_Score();
		GenerateSpikes(1);
	}
	if(this.Position_y+this.Size_y<0 || this.Position_y>canvas.height)
	{
		EndGame();
	}
	
	
	this.Position_x += this.Player_Speed*this.Move_Direction;
}
//Metoda odpowiedzialna za skok gracza
Player.prototype.jump = function ()
{
	this.Acceleration_Y = -5;
}
//Metoda sprawdzająca czy nastąpiła kolizja z kolcem
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
	else if (SpikeClass.direction == 1)
	{
		
		if ((this.Position_y < SpikeClass.position_y && this.Position_y+this.Size_y > SpikeClass.position_y)||(this.Position_y < SpikeClass.position_y + SpikeClass.Size_y && this.Position_y + this.Size_y > SpikeClass.position_y+SpikeClass.Size_y))
		{
		
			if (this.Position_x<SpikeClass.Size_x)
			{
			EndGame();
			}
			
			
		}
		
		
	}
}

//Deklaracja gracza
var Gracz = new Player(55,55,canvas.width/2-25,canvas.height/2-25,0,-1,2);

//Deklaracja tablicy z kolcami
var LKolce = [10];
LKolce[0] = new SpikeClass(30,30,40,1);
LKolce[1] = new SpikeClass(30,30,200,1);
LKolce[2] = new SpikeClass(30,30,80,1);



var RKolce = [10];
RKolce[0] = new SpikeClass(30,30,40,-1);
RKolce[1] = new SpikeClass(30,30,200,-1);
RKolce[2] = new SpikeClass(30,30,500,-1);

//funkcja rysująca scene
function DrawScene()
{
	//czyszczenie obrazu
	ctx.clearRect(0,0,canvas.width,canvas.height);

	//Rysowanie tablicy wyników
	Draw_Score();
	
	//Rysowanie Gracza
	Gracz.draw();
	
	//Rysowanie Kolców
	

	for(var a = 0; a < LKolce.length; a++)
	{
		LKolce[a].draw();
	}
	
	for(var a = 0; a < RKolce.length; a++)
	{
		RKolce[a].draw();
	}
	
   //Rysowanie "strzałki w kułku" na początku gry
	if(!GameStarded)
	{
	ctx.beginPath();
	ctx.font = "120px FontAwesome";
	ctx.fillStyle = 'grey';
	ctx.textAlign = 'center';
	ctx.fillText("\uf01d",canvas.width/2,canvas.height/2+30);
	ctx.closePath();
	}
}

//Główna pętla gry
function Update() {

//	Jeżeli gra wystartowała to...
	if (GameStarded)
	{
		Gracz.update();
		
		for(var a = 0; a < RKolce.length; a++)
		{
				//Sprawdzanie kolizji z kolcami
				Gracz.collisionDetect(RKolce[a]);
		}
		for(var a = 0; a < LKolce.length; a++)
		{
				//Sprawdzanie kolizji z kolcami
				Gracz.collisionDetect(LKolce[a]);
		}
	}
	//Rysuj scene
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

function GenerateSpikes(Direction)
{
	if (Direction == -1)
	{
		LKolce.length = 6;
		for (var a = 0; a<LKolce.length; a++)
		{
			LKolce[a] = new SpikeClass(30,30,rand(1,64)*10,-1);
		}
	}
	else if (Direction == 1)
	{
		RKolce.length = 6;
		for (var a = 0; a<LKolce.length; a++)
		{
			RKolce[a] = new SpikeClass(30,30,rand(1,64)*10,1);
		}
	}
	
}

function EndGame()
{
	ClearGame();
}

function ClearGame()
{
	Reset();
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

function rand( min, max ){
    min = parseInt( min, 10 );
    max = parseInt( max, 10 );

    if ( min > max ){
        var tmp = min;
        min = max;
        max = tmp;
    }

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}


//Ustawia by funkcja Update wykonywała się co 10 ms
var Interval_ID = setInterval(Update, 10)
