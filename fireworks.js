//参考：https://qiita.com/iNaoki04/items/5d420440cf3d89f54f82

let fireworks = [];
let star = [];

function setup(){
    createCanvas(480,480); //キャンバスを準備
    colorMode(RGB,255); //色のモードを設定
    frameRate(60); //1秒間のフレーム数
    this.preStar(); //star配列に星を準備
}

function draw(){
    //背景色を設定
    background(0);
    noStroke(); //枠線を描画しない

    this.drawStar(); //星を描画，drawStarのみ毎回呼び出すことで，キラキラした星を描く

    if (0 === frameCount % 100){//花火を打ち上げる時間を調整
    //打ち上がるスピード
        let speed = random(10, 30);
        fireworks.push(new FireWork(random(width), height, 0, speed, 0.98));
        print("ok");
    }

    for (let fw of fireworks){
        if (2 === fw.getType || 30000 < fw.getFrame){
            fireworks = fireworks.filter((n) => n !== fw); //TODO: 冗長かもしれない　要検討
            continue;
        }
        fw.fire();
    }
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
        this.w = random(5, 10);
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
        this.exDelay = random(10, 40);//消えてから爆発までの時間
        this.exLarge = random(5, 15);//爆発の大きさ
        this.exBall = random(20, 100);//爆発の玉の数
        this.extend = random(20, 40);//爆発から消えるまでの長さ
        this.exStop = 0.96;//爆発のブレーキ
    }

    get getFrame(){
        return this.frame; //このオブジェクトが描かれたフレーム数
    }

    get getType(){
        return this.type;
    }

    fire(){
        switch (this.type){
            case 0:
                this.rising();
                break;
            case 1:
                this.explosions();
                break;
        }
    }

    rising(){
        //頂点まで達したら消す
        if (this.y * 0.8 < this.maxHeight){
            this.a = this.a - 6;
        }

        this.x += this.vx;
        this.y -= this.vy * ((this.fireHeight-(height-this.y)/this.fireHeight));
        this.update(this.x, this.y, this.w);
    }

    update(x,y,w){
        this.frame++;
        if(0 < this.a){
            let c = color(this.r,this.g,this.b);
            c.setAlpha(this.a);
            fill(c);
            ellipse(x,y,w,w);
        }
    }
}

function preStar(){ //星の準備，位置と高さ，サイズはランダム
    star = [];
    for (let i = 0; i<100; i++){
        star.push([random(width),random(height/2),random(1,4)]);
    }
}

function drawStar(){
    for (let s of star){ //星を色をその都度変更して表示
        let c = color(random(150,255),random(150,255),255,random(150,200));
        fill(c);
        ellipse(s[0],s[1],s[2],s[2]);
    }
}