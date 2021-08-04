//参考：https://qiita.com/iNaoki04/items/5d420440cf3d89f54f82
function setup(){
    createCanvas(480,480);
    fw = new FireWork();
}

function draw(){
    background(0);
    fw.fire();
}

class FireWork{
    constructor(){
        this.y = 480;
        this.fireHeight = 480-300;//花火の高さを設定
        this.vy = 20;//花火が打ちあがる速さ
    }

    fire(){
        color(255);
        ellipse(240,this.y,20,20);
        this.y -= this.vy;
        if(this.y < this.fireHeight){
            this.y = 480;
        }
    }
}