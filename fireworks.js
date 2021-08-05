//参考：https://qiita.com/iNaoki04/items/5d420440cf3d89f54f82
function setup(){
    createCanvas(480,480);
    colorMode(RGB,255);
    frameRate(60);
    this.preStar();
    fw = new FireWork();
}

function draw(){
    background(0);
    this.drawStar();
    fw.fire();
}

class FireWork{
    constructor(){
        this.y = 480;
        this.fireHeight = 480-100;//花火の高さを設定
        this.vy = 20;//花火が打ちあがる速さ
    }

    fire(){
        fill(255);
        ellipse(240,this.y,20,20);
        this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);
        if(this.y < 100.001){
            this.y = 480;
        }
    }
}

function preStar(){
    star = [];
    for (let i = 0; i<100; i++){
        star.push([random(width),random(height/2),random(1,4)]);
    }
}

function drawStar(){
    for (let s of star){
        let c = color(random(150,255),random(150,255),255,random(150,200));
        fill(c);
        ellipse(s[0],s[1],s[2],s[2]);
    }
}