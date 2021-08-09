//参考：https://qiita.com/iNaoki04/items/5d420440cf3d89f54f82
let fireworks = [];
let star = [];

function setup(){
    createCanvas(700,700); //キャンバスを準備
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
    constructor(x, y, vx, vy, gv){
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
        this.large = random(5, 15);//爆発の大きさ
        this.ball = random(20, 100);//爆発の玉の数
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
                this.explosion();
                break;
        }
    }

    rising(){
        //頂点まで達したら消す
        if (this.y * 0.8 < this.maxHeight){
            this.a = this.a - 6;
        }
        this.x += this.vx;
        this.y -= this.vy * ((this.fireHeight-(height-this.y))/this.fireHeight);

        this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));

        for (let ai of this.afterImages){
            if (ai.getAlpha <= 0){
                this.afterImages = this.afterImages.filter((n) => n !== ai);
                continue;
            }
            ai.rsImage();
        }

        this.update(this.x, this.y, this.w, this.a);

        //すべての表示が消えたら，this.typeを変更する
        if (0 == this.afterImages.length){
            if (0 == this.next){
                //消えてから爆発まで遅延させる
                this.next = this.frame + Math.round(this.exDelay);
            }
            else if (this.next == this.frame){
                for (let i = 0; i < this.ball; i++){
                    //爆発の角度
                    let r = random(0, 360);
                    //花火の内側を作る
                    let s = random(0.1, 0.9); //花火の内側はそれぞれ低い確率で計算
                    let vx = Math.sin((r*Math.PI)/180) * s * this.large; //this.large 爆発の最大となっている
                    let vy = Math.cos((r*Math.PI)/180) * s * this.large;
                    this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop));
                    //花火の輪郭を作る
                    let cr = random(0, 360); //花火の輪郭は高い確率で計算
                    let cs = random(0.9, 1);
                    let cvx = Math.sin((r*Math.PI)/180) * cs * this.large; //this.large 爆発の最大となっている
                    let cvy = Math.cos((r*Math.PI)/180) * cs * this.large;
                    this.explosions.push(new FireWork(this.cx, this.cy, cvx, cvy, this.exStop));
                }
                this.a = 255;
                this.type = 1;
            }
        }

    }

    update(x,y,w,a){
        this.frame++;
        if(0 < a){
            let c = color(this.r,this.g,this.b);
            c.setAlpha(a);
            fill(c);
            ellipse(x,y,w,w);
        }
    }

    explosion(){
        for (let ex of this.explosions){
            ex.frame++;
            //爆発し終わったものから排除する．
                if(2 == ex.getType){
                    this.explosions = this.explosions.filter((n) => n !== ex);
                    continue;
                }
                
            if(0 == Math.round(random(0, 32))){
                ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a))
            }

            for(let ai of ex.afterImages){
                if(ai.getAlpha < 0){
                    ex.afterImages = ex.afterImages.filter((n)=>n!==ai);
                    continue;
                }
                ai.exImage();
            }

            this.update(ex.x, ex.y, ex.w, ex.a);
            ex.x += ex.vx;
            ex.y += ex.vy;
            ex.vx = ex.vx * ex.gv;
            ex.vy = ex.vy * ex.gv;
            ex.vy = ex.vy + ex.gv/30;

            if(this.extend < ex.frame){
                ex.w -= 0.1;
                ex.a -= 4;
                if(ex.a < 0 || 0 === ex.afterImages.length){
                    ex.type = 2;
                }
            }
        }
    }
}


class Afterimage{
    constructor(r,g,b,x,y,w,a){
        this.frame = 0;
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.y = y;
        this.w = w;
        this.a = a;
        this.vx = random(-0.24, 0.24);
        this.vy = random(0.2, 0.8);
        this.vw = random(0.05, 0.2);
    }

    get getAlpha(){
        return this.a;
    }

    rsImage(){ //描画と次の描画のための値の更新
        if(0 < this.a){
            this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a)
            this.r += 4;
            this.g += 4;
            this.b += 4;
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            if (this.w > 0){
                this.w = this.w - this.vw;
            }
            this.a = this.a - 4;
        }
    }

    update(r, g, b, x, y, w, a){
        this.frame++;
        let c = color(r, g, b);
        c.setAlpha(a);
        fill(c);
        ellipse(x, y, w, w);
    }

    exImage() {
        if(this.a > 0){
            this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
            this.r += 2.5;
            this.g += 2.5;
            this.b += 2.5;
            this.x += this.x + this.vx;
            this.y += this.y + this.vy;
            if (0 < this.w){
                this.w = this.w - this.vw;
            }
            this.a = this.a - 1.5;
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
