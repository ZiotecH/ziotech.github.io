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
        starGen(...rngHandler());
    }
    if(noms%500==0 && !(heartList5h.length >= 200)){
        heartGen5h(...rngHandler());
    }
    if(noms%1e3==0 && !(heartList1k.length >= 200)){
        heartGen1k(...rngHandler());
    }
    if(noms >= 1e4){
        displayElm.innerText = "Chomps: "+noms.toExponential(3);
    }else{
        displayElm.innerText = "Chomps: "+noms;
    }
    return;
}

function starGen(x,s,d,r,w){
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
    document.getElementsByTagName("body")[0].appendChild(tmp);
    starList.push(tmp);
    return
}

function heartGen1k(x,s,d,r,w){
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
    document.getElementsByTagName("body")[0].appendChild(tmp);
    heartList1k.push(tmp);
    return
}

function heartGen5h(x,s,d,r,w){
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
    document.getElementsByTagName("body")[0].appendChild(tmp);
    heartList5h.push(tmp);
    return
}




function rngHandler(){
        var X = Math.ceil(Math.random()*90)
        var S = Math.round(Math.random()*10,2)
        var D = Math.ceil(Math.random()*88)
        var R = Math.ceil(Math.random()*180);
        var W = Math.round(Math.random()*3,2);
        if(S < 5){S = 5}
        if(D < 25){D = 25}
        return [X,S,D,R,W]
}