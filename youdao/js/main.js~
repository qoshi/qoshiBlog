window.onload = function() {
    //stop the pinch of the browser
    document.body.addEventListener("touchmove",function() {
        event.preventDefault();
    });
    //create the Pic object
    var pic = new Pic(document.getElementById("mainbox"),"./pic/test.jpeg");
    //bind event for the button
    var but1 = document.getElementById("setVisiable");
    but1.addEventListener("click",function(){
        if ( pic.getZonesVisiable() ) {
            pic.setZonesVisiable(false);
            but1.value="显示红框";
        } else {
            pic.setZonesVisiable(true);
            but1.value="隐藏红框";
        }
    });
    var but2 = document.getElementById("refresh");
    but2.addEventListener("click",function(){
        pic.setZones(getSomeZone(100));
        pic.clear();
    });
}
