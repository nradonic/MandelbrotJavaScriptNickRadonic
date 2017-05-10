var minX = -2.25;
var minY = -2.25;
var maxX = 2.25;
var maxY = 2.25;
var maxCount = 100;

function mb(x1,y1){
    var zx = x1;
    var zy = y1;
    var zx0 = x1;
    var zy0 = y1;
    
    var flag = true;
    var direction = false;
    var count = 0;
    
    while  ( flag ) {
        count += 1;
        var temp = zx * zx  - zy * zy + x1;
        zy = zx * zy * 2 + y1;
        zx = temp;
        zx0 = zx - zx0;
        zy0 = zy - zy0;
        var m = zx0*zx0+zy0*zy0;
        if ( m > 20 ){
            flag = false;
        } 
        zx0 = zx;
        zy0 = zy;
        if ( count > maxCount ) { flag = false;}
    }
    if ( count>maxCount) { count=0; }
    return count;
}

function draw_on_canvas(canvas, x2, kx2, y2, ky2, colorXY){
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x2,y2);
    ctx.fillStyle = colorXY;
    ctx.fillRect(x2,y2,kx2,ky2);
    ctx.stroke();
}

function mandelbrot(){
    var canvas = document.getElementById("myCanvas");
    var cw = canvas.width;
    var ch = canvas.height;
   
    var q = 0xffffff / maxCount;
    var divisions = 1000.0;
    var diffX = (maxX - minX)/divisions;
    var diffY = (maxY - minY)/divisions;
    var kx = cw/(maxX-minX);
    var ky = ch/(maxY-minY);
    var sx = cw/divisions;
    var sy = ch/divisions;
    for (var x = minX ; x <= maxX; x += diffX){
        for (var y = minY ; y < maxY ; y += diffY){
            var k = mb(x, y) * q ;
            var colorXY = "#" + ( "000000" + Math.max(Math.min(Math.floor(k), 0xFFFFFF), 0).toString(16) ).substr(-6);
            draw_on_canvas(canvas, (x-minX)*kx , sx, (y-minY)*ky, sy, colorXY);
        }
    }
}

function displayZoom(){
    var zoom = 1.0/(maxX - minX);
    document.getElementById("ZoomLevel").textContent = zoom.toString();
}

function recenterAndDraw(event){
    var IT = document.getElementById("myCanvas");
    var x = event.offsetX;
    var y = event.offsetY;
    
    var canvas = document.getElementById("myCanvas");
    var cw = canvas.width;
    var ch = canvas.height;
    var cx2 = cw/2;
    var cy2 = ch/2;
    
    var deltaXF = (maxX - minX);
    var deltaYF = (maxY - minY);

    var centerX = (minX + maxX)/2.0;
    var centerY = (minY + maxY)/2.0;
    
    var shiftX1 = deltaXF * (x-cx2)/cw;
    var shiftY1 = deltaYF * (y-cy2)/cw;

    centerX = centerX + shiftX1;
    centerY = centerY + shiftY1;
    
    minX = centerX - deltaXF/4;
    minY = centerY - deltaYF/4;
    maxX = centerX + deltaXF/4;
    maxY = centerY + deltaXF/4;
    mandelbrot();
    displayZoom();
}

//  colorXY = "#" + (0xFFFFFF * Math.random()).toString(16).substring(0,6);

function zoomOut(){
    var deltaXF = (maxX - minX)
    var deltaYF = (maxY - minY);

    minX -= deltaXF;
    minY -= deltaYF;
    maxX += deltaXF;
    maxY += deltaYF;
    mandelbrot();
    displayZoom();
}