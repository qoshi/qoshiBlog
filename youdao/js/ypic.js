function Pic ( div, url ) {
    //save the detail
    var div = div;
    var url = url;

    //zoom level
    var scale = 1;

    //default zoom level
    var defaultZoomScale = 0.2;

    //default max and min scale of the picture
    var defaultMaxScale = 3;
    var defaultMinScale = 0.4;

    //position offsetX and offsetY
    var offsetX = 0;
    var offsetY = 0;

    //record the position when touchdown
    var initX = 0;
    var initY = 0;

    //use to caculate the new position
    var startX = 0;
    var startY = 0;

    //whether it is dragging
    var isDragging = false;

    //use this to record when pinch action the distance between two fingures
    var originDistance = undefined;

    //use this to record pinch result
    var zoomAction = null;
    
    //zones are clickable
    var zones = getSomeZone(100);

    //Zones visiblity
    var isZonesVisible = true;
    
    //build the innerDiv
    var innerDiv = document.createElement("div");
    innerDiv.style.position = "absolute";
    innerDiv.id = "innerDiv";
    innerDiv.style.left = "0";
    innerDiv.style.top = "0";

    //build the innerCanvas
    var innerCanvas = document.createElement("canvas");
    innerCanvas.style.position = "absolute";
    innerCanvas.style.left = "0";
    innerCanvas.style.top = "0";
    
    //get the 2D canvas context
    var context = innerCanvas.getContext("2d");

    //add the two element to the dom tree
    div.appendChild(innerDiv);
    innerDiv.appendChild(innerCanvas);

    //using Image as the src of canvacs
    var img = new Image();
    img.onload = init;
    img.src = url;

    //save the width and height of img
    var imgWidth = 0;
    var imgHeight = 0;

    //save the infoDiv's dom
    var info = null;
    
    //init the picture
    function init() {
        imgWidth = parseFloat(img.width);
        imgHeight = parseFloat(img.height);
        draw();
    }
    
    //draw the picture and the zones
    function draw() {
        drawImage();
        if ( true === isZonesVisible ) {
            drawZones();
        }
    }
    
    //draw the picture
    function drawImage() {
        context.clearRect(0,0,innerCanvas.width,innerCanvas.height);
        var newW = imgWidth*scale;
        var newH = imgHeight*scale;
        innerCanvas.width = newW;
        innerCanvas.height = newH;
        context.drawImage(img,0,0,newW,newH);
    }
    
    //draw the zones
    function drawZones() {
        var i;
        for ( i in zones ) {
            context.lineWidth = 1;
            context.strokeStyle = "red";
            context.strokeRect(zones[i].x*scale,zones[i].y*scale,zones[i].width*scale,zones[i].width*scale);
        }
    }

    //use click replace the tap function it's faster than tap
    function click(event) {
        var x = parseFloat(event.pageX)-offsetX-div.offsetLeft;
        var y = parseFloat(event.pageY)-offsetY-div.offsetTop;
        var point = {x:x/scale,y:y/scale};
        var num = isInZones(point);
        if ( false !== num ) {
            if ( info ) {
                innerDiv.removeChild(info);
                info = null;
            }
            point.x *= scale;
            point.y *= scale;
            point.text="this is zone "+num;
            info = new Info(point);
            innerDiv.appendChild(info);
        }
    }


    //move the left top to new position
    function move() {
        innerDiv.style.left = offsetX+"px";
        innerDiv.style.top = offsetY+"px";
    }
    
    //zoom the pic with deltaScale
    function zoom( deltaScale ) {
        scale += deltaScale;
        draw();
    }

    //zoomIn
    function zoomIn( deltaScale ) {
        if ( scale >= defaultMaxScale ) {
            return;
        }
        else {
            if ( deltaScale ) {
                zoom(deltaScale);
            } else {
                zoom(defaultZoomScale);
            }
        }
        return false;
    }
    
    //zoomOut
    function zoomOut( deltaScale ) {
        if ( scale <= defaultMinScale ) {
            return;
        }
        else {
            if ( deltaScale ) {
                zoom(deltaScale);
            } else {
                zoom(-defaultZoomScale);
            }
        }
        return false;
    }

    //zoom  and keep the pinch center stay where it was
    function zoomToPoint( point ) {
        if ( point == null ) {
            return;
        }
        var left = parseFloat(innerDiv.style.left);
        var top =  parseFloat(innerDiv.style.top);
        var midLeft = point.x - left;
        var midTop = point.y - top;
        midLeft /= scale;
        midTop /= scale;
        if ( point.action == -1 && scale <= defaultMinScale ) {
            return;
        }
        if ( point.action == 1 && scale >= defaultMaxScale ) {
            return;
        }
        scale += point.action*defaultZoomScale;
        midLeft *= scale;
        midTop *= scale;
        offsetX = point.x - midLeft;
        offsetY =  point.y - midTop;
        move ();
        draw();
    }
    
    // touchdown and start to move
    function moveStart( event ) {
        isDragging = true;
        startX = event.gesture.deltaX;
        startY = event.gesture.deltaY;
        initX = startX;
        initY = startY;
        return false;
    }

    // touchmove
    function moving( event ) {
        if ( isDragging ) {
            var dx = event.gesture.deltaX - startX;
            var dy = event.gesture.deltaY - startY;
            startX = event.gesture.deltaX;
            startY = event.gesture.deltaY;
            offsetX += dx;
            offsetY += dy;
            move();
        }
        return false;
    }

    //touchend and end move
    function moveEnd(event) {
        isDragging = false;
        return false;
    }
    
    //pinch start 
    function pinchStart( event ) {
        if ( info )   {
            innerDiv.removeChild(info);
            info = null;
        }
        var gesture = event.gesture;
        if ( originDistance === undefined ) { 
            originDistance = getDistance( gesture.touches );
        }
        var currentDistance = getDistance( gesture.touches );
        if ( currentDistance < originDistance ) {
            zoomAction = { x : event.gesture.center.pageX - div.offsetLeft,
                           y : event.gesture.center.pageY - div.offsetTop,
                           action : -1
                         };
        } else if ( currentDistance > originDistance ) {
            innerDiv.className = "zoomIn";
            zoomAction = { x : event.gesture.center.pageX - div.offsetLeft,
                           y : event.gesture.center.pageY - div.offsetTop,
                           action : 1
                         };
        }
        return false;
    }

    //pinch end and make zoomIn or zoomOut
    function pinchEnd( event ) {
        innerDiv.className = "";
        zoomToPoint(zoomAction);
        originDistance = undefined;
        zoomAction = null;
    }
    
    //get distance from hammer gestures
    function getDistance( touches ) {
        var p1 = touches[0];
        var p2 = touches[1];
        x = p1.pageX - p2.pageX;
        y = p2.pageY - p2.pageY;
        var result = Math.sqrt( x*x + y*y );
        return result;
    }

    // bind the event
    function bindEvent() {
        var hammer = new Hammer(div);
        hammer.on("pinch",pinchStart);
        hammer.on("release",pinchEnd);
        hammer.on("dragstart",moveStart);
        hammer.on("drag",moving);
        hammer.on("dragend",moveEnd);
        hammer.on("click",click);
    }

    //make sure that the position clicked is in one of the zones
    function isInZones( point ) {
        var i;
        var zone = {x:point.x,y:point.y,width:0};
        for ( i in zones ) {
            if ( !checkOne(zone,zones[i]) ) {
                return i;
            }
        }
        return false;
    }
    
    //open some API
    //set zones
    this.setZones = function( _zones ) {
        zones = _zones;
        draw();
    }
    //get zones
    this.getZones = function () {
        return zones;
    }
    //set zones' visibility
    this.setZonesVisiable = function ( visiable ) {
        isZonesVisible = visiable;
        draw();
    }
    //get zones' visibility
    this.getZonesVisiable = function() {
        return isZonesVisible;
    }
    //clear info div
    this.clear = function() {
        if ( info ) {
            innerDiv.removeChild(info);
            info = null;
        }
    }
    
    bindEvent();
    return this;
}



