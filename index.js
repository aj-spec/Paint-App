var bgColor;
    var canvas, canvasImage, rectCount, rects, color, context, draggingDraw, draggingMove, dragX, dragY, dragIndexDelete, 
    dragIndexMove, dragStartLocation, mouseX, mouseY, h, w, targetX, targetY, tempX, tempY, dx, dy, lagRandom= false;

window.addEventListener('load', init, false);

//resizing of canvas, based on the window size

window.onload = window.onresize = function() 
	{
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.8;
		drawRects();
	}	

//initialize global variables	

function init() 
	{
		canvas = document.getElementById("canvas");
		context = canvas.getContext('2d');
		context.lineWidth = 4;
		context.lineCap = 'round';
	
		rectCount=0;	
		draggingDraw = false;
		bgColor = "#FFF";
		rects = [];
		
		//event listeners to draw rects
		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
		
		//event listener to delete rect
		canvas.addEventListener('dblclick', deleteRect,false);
    }	
    
//		Drawing Rects with random colors	

function dragStart(event) {
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
	color = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) +")";
    getImage();
}

function drag(event) {
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawRect(position);
        context.fillStyle = color;
        context.strokeStyle = 'black';
		context.fill();
    }
}
function dragStop(event) {
    draggingDraw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawRect(position);		
    context.fillStyle = color;
    context.strokeStyle = 'black';
	context.fill();	
	rectCount=rectCount+1;
	tempRect = {x:tempX, y:tempY, height1:h, width1:w, color:color};
	
	rects.push(tempRect);
	
}
	
function getCanvasCoordinates(event) {

    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

function drawRect(position) {
	
		tempX=dragStartLocation.x;
		tempY=dragStartLocation.y;
		
        h = position.x-tempX ;
        w = position.y-tempY ;
        context.beginPath();
        context.strokeStyle = 'black';
        context.strokeRect(tempX, tempY, h, w);
		context.fillRect(tempX, tempY, h, w);
		context.closePath();
}

//		On click of Erase Button

function drawScreen() {
		rectCount=0;
		rects = [];
        context.fillStyle = bgColor;
        context.strokeStyle = 'black';
		context.fillRect(0,0,canvas.width,canvas.height);
	}	

//		On click of Draw / Move Button
	
function togglebtn(){

		if(document.getElementById("btnMve").name == "Draw Shape")
			{ 	
		
				canvas.removeEventListener("mousedown", mouseDown, false);
				document.getElementById("btnMve").name = "Move Shape";		
				document.getElementById("spid").innerHTML="Move the rects";
		
				canvas.addEventListener('mousedown', dragStart, false);
				canvas.addEventListener('mousemove', drag, false);
				canvas.addEventListener('mouseup', dragStop, false);				
			}
	  else if(document.getElementById("btnMve").name == "Move Shape")
	  {         
		
				canvas.removeEventListener("mousedown", dragStart, false);
				canvas.removeEventListener("mousemove", drag, false);
				canvas.removeEventListener("mouseup", dragStop, false);
				
				document.getElementById("btnMve").name = "Draw Shape";
				document.getElementById("spid").innerHTML="Click here to draw the rects";
				
				canvas.addEventListener('mousedown', mouseDown, false);
	   }
 }

//		To Move/ Delete the Rects 

	function drawRects() {
		var i;
		var x;
		var y;
        var height1;
        var width1;
		var color;
		
        context.fillStyle = bgColor;
        context.strokeStyle = 'black';
        context.strokeRect(0, 0, canvas.width,canvas.height);
		context.fillRect(0,0,canvas.width,canvas.height);		
		
		for (i=0; i < rectCount; i++) {
            height1 = rects[i].height1;
            width1 = rects[i].width1;
			x = rects[i].x;
			y = rects[i].y;
			color=rects[i].color;
            context.beginPath();
            context.strokeStyle = 'black';
            context.strokeRect(x, y, height1, width1);
            context.fillStyle = color;
			context.fillRect(x, y, height1, width1);
			context.closePath();
			
			context.fill();
		}		
	}	
	//To check whether the rect was clicked
	function isRectClicked(shape,mx,my) {		
		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;
		return (dx*dx + dy*dy < shape.height1*shape.height1);
	}

//		To Delete the Rects	on double-click

function deleteRect(event) 
{
		var i;
		var bRect = canvas.getBoundingClientRect();
		dragIndexDelete=-1;
		
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		//To find that which rect has been clicked
		for (i=0; i < rectCount; i++) {
			if	(isRectClicked(rects[i], mouseX, mouseY)) {
				dragIndexDelete = i;		
			}
		}
		//Remove the rect from the array
		if ( dragIndexDelete> -1 ){
			rects.splice(dragIndexDelete,1)[0];
			rectCount=rectCount-1;
		}
		
		if (event.preventDefault) {
			event.preventDefault();
		} 
		else if (event.returnValue) {
			event.returnValue = false;
		} 
		drawRects();				
		return false;
}

//		To Move the Rects Manually

function mouseDown(event) 
{
		var i;
		var highestIndex = -1;		
		var bRect = canvas.getBoundingClientRect();
	
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		//To find that which rect has been clicked
		for (i=0; i < rectCount; i++) {
			if	(isRectClicked(rects[i], mouseX, mouseY)) {
				draggingMove = true;
				if (i > highestIndex) {
					dragX = mouseX - rects[i].x;
					dragY = mouseY - rects[i].y;
					highestIndex = i;
					dragIndexMove = i;
				}				
			}
		}
		if (draggingMove) {
			window.addEventListener("mousemove", mouseMove, false);
			rects.push(rects.splice(dragIndexMove,1)[0]);
			
		}
		canvas.removeEventListener("mousedown", mouseDown, false);
		window.addEventListener("mouseup", mouseUp, false);
		
		if (event.preventDefault) {
				event.preventDefault();
			} 
		else if (event.returnValue) {
				event.returnValue = false;
			} 
		return false;
}
	
	function mouseUp(event) {

		canvas.addEventListener("mousedown", mouseDown, false);
		window.removeEventListener("mouseup", mouseUp, false);
		if (draggingMove) {
			draggingMove = false;
			window.removeEventListener("mousemove", mouseMove, false);
		}
	}

	function mouseMove(event) {
		
		var posX;
		var posY;
        var height3 = rects[rectCount-1].height1;
        var width3 = rects[rectCount-1].width1;
		var minX = height3;
		var maxX = canvas.width - height3;
		var minY = width3;
		var maxY = canvas.height - width3;
		
		var bRect = canvas.getBoundingClientRect();
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		posX = mouseX - dragX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		rects[rectCount-1].x = posX;
		rects[rectCount-1].y = posY;
		
		drawRects();
	} 