var noms = 0;
var kitten = document.getElementById("ket");
var displayElm = document.getElementById("displayElm");
var starList = [];
var heartList1k = [];
var heartList5h = [];
kitten.addEventListener("click",eatBread);


function eatBread(){
    noms++
    if(noms%100==0 && !(starList.length >= 200) ){
        starList.push(starGen(...rngHandler()));
    }
    if(noms%500==0 && !(heartList5h.length >= 200)){
        heartList5h.push(heartGen5h(...rngHandler()));
    }
    if(noms%1e3==0 && !(heartList1k.length >= 200)){
        heartList1k.push(heartGen1k(...rngHandler()));
    }
    if(noms >= 1e4){
        displayElm.innerText = "Chomps: "+noms.toExponential(3);
    }else{
        displayElm.innerText = "Chomps: "+noms;
    }
    return;
}

function starGen(x,s,d,r,w){
    //console.log("Creating star with "+[x,s,d,r,w]+".")
    /*
    x pos
    s speed
    d dimensions
    r rotation
    w animation delay
    */
    tmp = document.createElement("div");
    tmp.innerText = "\u2726";
    tmp.style.position = "absolute";
    tmp.style.left = x+"%";
    tmp.style.top = "-10%";
    tmp.style.width = d+"px";
    tmp.style.height = d+"px";
    tmp.style.fontSize = (d/2)+"px";
    tmp.style.animationDuration = s+"s";
    tmp.style.transform = "rotate("+r+"deg)";
    tmp.style.animationDelay = w+"s";
    tmp.classList.add("star");
    tmp.addEventListener("animationend",function(obj){objectRestructure(obj);});
    document.getElementsByTagName("body")[0].appendChild(tmp);
    return tmp
}

function heartGen1k(x,s,d,r,w){
    //console.log("Creating heart_1k with "+[x,s,d,r,w]+".")
    /*
    x pos
    s speed
    d dimensions
    r rotation
    w animation delay
    */
    tmp = document.createElement("div");
    tmp.innerText = "\uD83D\uDC96";
    tmp.style.position = "absolute";
    tmp.style.left = x+"%";
    tmp.style.top = "-10%";
    tmp.style.width = d+"px";
    tmp.style.height = d+"px";
    tmp.style.fontSize = (d/2)+"px";
    tmp.style.animationDuration = s+"s";
    tmp.style.transform = "rotate("+r+"deg)";
    tmp.style.animationDelay = w+"s";
    tmp.classList.add("heart_1k");
    tmp.addEventListener("animationend",function(obj){objectRestructure(obj);});
    document.getElementsByTagName("body")[0].appendChild(tmp);
    return tmp
}

function heartGen5h(x,s,d,r,w){
    //console.log("Creating heart_5h with "+[x,s,d,r,w]+".")
    /*
    x pos
    s speed
    d dimensions
    r rotation
    w animation delay
    */
    tmp = document.createElement("div");
    tmp.innerText = "\uD83D\uDC97";
    tmp.style.position = "absolute";
    tmp.style.left = x+"%";
    tmp.style.top = "-10%";
    tmp.style.width = d+"px";
    tmp.style.height = d+"px";
    tmp.style.fontSize = (d/2)+"px";
    tmp.style.animationDuration = s+"s";
    tmp.style.transform = "rotate("+r+"deg)";
    tmp.style.animationDelay = w+"s";
    tmp.classList.add("heart_5h");
    tmp.addEventListener("animationend",function(obj){objectRestructure(obj);});
    document.getElementsByTagName("body")[0].appendChild(tmp);
    return tmp
}




function rngHandler(){
        var X = Math.ceil(Math.random()*90)
        var S = Math.round(Math.random()*10,2)
        var D = Math.ceil(Math.random()*88)
        var R = Math.ceil(Math.random()*360);
        var W = Math.round(Math.random()*3,2);
        if(S < 5){S = 5}
        if(D < 25){D = 25}
        return [X,S,D,R,W]
}

function objectRestructure(caller){
    var classList = caller.target.classList;
    var index;
    caller.target.remove()
    if(classList.contains("star")){
        index = starList.indexOf(caller.target);
        starList[index] = starGen(...rngHandler());
    }else if(classList.contains("heart_1k")){
        index = heartList1k.indexOf(caller.target);
        heartList1k[index] = heartGen1k(...rngHandler());
    }else if(classList.contains("heart_5h")){
        index = heartList5h.indexOf(caller.target);
        heartList5h[index] = heartGen5h(...rngHandler());
    }
    //console.log(caller.target)
    //console.log(caller)
    return
}