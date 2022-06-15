//This file focuses on centering elements to the middle

function centerElement(element) {
    var tag = document.getElementsByTagName(element)[0];
    var body = document.getElementsByTagName("Body")[0];
    var x1 = body.offsetWidth;
    var x2 = tag.offsetWidth;
    var marginX = (x1 - x2) / 2;
    tag.style.left = marginX + "px";
}

centerElement("canvas");
centerElement("Start");
centerElement("Score");

window.onresize = () => { centerElement("canvas"); centerElement("Start"); centerElement("Score");}
