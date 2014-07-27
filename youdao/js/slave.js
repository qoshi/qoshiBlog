//the div shown on the pictue when the picture is clicked
function Info( point ) {
    //some default variable
    var defaultWidth = 100;
    var defaultHeight = 40;
    
    //create the info div
    var infoDiv = document.createElement("div");
    infoDiv.style.position = "absolute";
    infoDiv.style.left = (point.x-defaultWidth/2)+"px";
    infoDiv.style.top = (point.y-defaultHeight)+"px";
    infoDiv.style.width = defaultWidth;
    infoDiv.style.height = defaultHeight;
    infoDiv.className = "infoDiv";
    infoDiv.innerHTML = point.text;
    
    return infoDiv;
}

//to check if zone is in now(a zone aleady exist)
function checkOne(zone, now) {
    if ( zone.x >= now.x && zone.x <= now.x+now.width && zone.y >= now.y && zone.y <= now.y+now.width ) {
        return false;
    }
    if ( zone.x+zone.width >= now.x && zone.x+zone.width <= now.x+now.width && zone.y >= now.y && zone.y <= now.y+now.width ) {
        return false;
    }
    if ( zone.x >= now.x && zone.x <= now.x+now.width && zone.y+zone.width >= now.y && zone.y+zone.width <= now.y+now.width ) {
        return false;
    }
    if ( zone.x+zone.width >= now.x && zone.x+zone.width <= now.x+now.width && zone.y+zone.width >= now.y && zone.y+zone.width <= now.y+now.width ) {
        return false;
    }
    return true;
}

//get some random zones
function getSomeZone( counts ) {
    var result = [];
    var i;
    //check if one is in zones already generated
    function check(zone){
        var i;
        for ( i in result ) {
            if ( !checkOne(zone,result[i]) || !checkOne(result[i],zone) ) {
                return false;
            }
        }
        return true;
    }
    //generate some zones
    i = 0;
    while( i < counts ) {
        var width = Math.floor(Math.random()*150);
        var x = Math.floor(Math.random()*(1280-width-10));
        var y = Math.floor(Math.random()*(425-width-10));
        var zone = {x:x,y:y,width:width};
        if ( true === check(zone) ) {
            result[i++] = zone;
        }
    }
    return result;
}

