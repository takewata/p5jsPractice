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
    constructor(x,y,vx,vy,gv){
        //フレームカウンター
        this.frame = 0;
        this.type = 0;
        this.next = 0;
        //花火の色
        this.r = random(155)+80;
        this.g = random(155)+80;
        this.b = random(155)+80;
        this.a = 255;
        //初期位置
        this.x = x;
        this.y = y;
        //玉の大きさ
        this.w = random(10,5);
        //打ち上がる高さ
        this.maxHeight = random(height/6, height/2);
        this.fireHeight = height - this.maxHeight;//花火の高さを設定
        //重力
        this.vx = vx;
        this.vy = vy;
        this.gv = gv;

        //残像表示用配列
        this.afterImages = [];
        //爆発用配列
        this.explosions = [];
        this.exDelay = random(10,40);//消えてから爆発までの時間
        this.exLarge = random(5,15);//爆発の大きさ
        this.exBall = random(20,100);//爆発の玉の数
        this.extend = random(20, 40);//爆発から消えるまでの長さ
        this.exStop = 0.96;//爆発のブレーキ
    }

    get getFrame(){
        return this.frame;
    }

    get getType(){
        return this.type;
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