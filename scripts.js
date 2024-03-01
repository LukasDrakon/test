const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = 800);
const height = (canvas.height = 600);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, width, height);
let pressed = false;
let curX;
let curY;
let keys = [];
const controls = [37, 39, 40, 38, 90, 65, 67, 32, 71];
var setting = [false, false, false, false, false, false, false, false, false];
document.getElementById("left").addEventListener("click", function (e){
    setting[0] = true;
    document.getElementById("left").textContent = "Press the desired key";
});
document.getElementById("right").addEventListener("click", function (e){
    setting[1] = true;
    document.getElementById("right").textContent = "Press the desired key";
});
document.getElementById("cw").addEventListener("click", function (e){
    setting[3] = true;
    document.getElementById("cw").textContent = "Press the desired key";
});
document.getElementById("sd").addEventListener("click", function (){
    setting[2] = true;
    document.getElementById("sd").textContent = "Press the desired key";
});
document.getElementById("ccw").addEventListener("click", function (){
    setting[4] = true;
    document.getElementById("ccw").textContent = "Press the desired key";
});
document.getElementById("180").addEventListener("click", function (){
    setting[5] = true;
    document.getElementById("180").textContent = "Press the desired key";
});
document.getElementById("hold").addEventListener("click", function (){
    setting[6] = true;
    document.getElementById("hold").textContent = "Press the desired key";
});
document.getElementById("hd").addEventListener("click", function (){
    setting[7] = true;
    document.getElementById("hd").textContent = "Press the desired key";
});
document.getElementById("sol").addEventListener("click", function (){
    setting[8] = true;
    document.getElementById("sol").textContent = "Press the desired key";
});
document.addEventListener("mousemove", (e) => {
    curX = e.pageX;
    curY = e.pageY;
});
canvas.addEventListener("mousedown", () => (pressed = true));
canvas.addEventListener("mouseup", () => (pressed = false));
window.addEventListener('keydown', this.keyDown, false);
window.addEventListener('keyup', this.keyUp, false);

function keyDown(e){
    if (e.keyCode==37||e.keyCode==38||e.keyCode==39||e.keyCode==40||e.keyCode==32){
        e.preventDefault();
    }
    if (setting[0]){
        controls[0] = e.keyCode;
        document.getElementById("left").textContent = "Change left key: ["+e.key+"]";
        setting[0] = false;
    }
    if (setting[1]){
        controls[1] = e.keyCode;
        document.getElementById("right").textContent = "Change right key: ["+e.key+"]";
        setting[1] = false;
    }
    if (setting[3]){
        controls[3] = e.keyCode;
        document.getElementById("cw").textContent = "Change rotate CW key: ["+e.key+"]";
        setting[3] = false;
    }
    if (setting[2]){
        controls[2] = e.keyCode;
        document.getElementById("sd").textContent = "Change soft drop key: ["+e.key+"]";
        setting[2] = false;
    }
    if (setting[4]){
        controls[4] = e.keyCode;
        document.getElementById("ccw").textContent = "Change rotate CCW key: ["+e.key+"]";
        setting[4] = false;
    }
    if (setting[5]){
        controls[5] = e.keyCode;
        document.getElementById("180").textContent = "Change rotate 180 key: ["+e.key+"]";
        setting[5] = false;
    }
    if (setting[6]){
        controls[6] = e.keyCode;
        document.getElementById("hold").textContent = "Change hold key: ["+e.key+"]";
        setting[6] = false;
    }
    if (setting[7]){
        controls[7] = e.keyCode;
        document.getElementById("hd").textContent = "Change hard drop key: ["+e.key+"]";
        setting[7] = false;
    }
    if (setting[8]){
        controls[8] = e.keyCode;
        document.getElementById("sol").textContent = "Change solution key: ["+e.key+"]";
        setting[8] = false;
    }
    if (started){
        keys[e.keyCode] = true;
    }
}
function keyUp(e){
    keys[e.keyCode] = false;
}
//Global variables here
var board = [[]];
for (let i=0; i<20; i++){
    board[i] = [0,0,0,0,0,0,0,0,0,0];
}
const shapes = [[],
    [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0}], //I
    [{x:-1, y:-1},{x:-1, y:0},{x:0, y:0},{x:1, y:0}], //J
    [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:1, y:-1}], //L
    [{x:0, y:0},{x:1, y:0},{x:1, y:-1},{x:0, y:-1}], //O
    [{x:-1, y:0},{x:0, y:0},{x:0, y:-1},{x:1, y:-1}], //S
    [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:-1}], //T
    [{x:-1, y:-1},{x:0, y:-1},{x:0, y:0},{x:1, y:0}] //Z
];
const colors = [
    "rgb(0, 0, 0)",
    "rgb(0, 255, 255)",
    "rgb(0, 0, 255)",
    "rgb(255, 127, 0)",
    "rgb(255, 255, 0)",
    "rgb(0, 255, 0)",
    "rgb(255, 0, 255)",
    "rgb(255, 0, 0)",
    "rgb(127, 127, 127)"
];
const darkers = [
    "rgba(0, 0, 0, .5)",
    "rgba(0, 255, 255, .5)",
    "rgba(0, 0, 255, .5)",
    "rgba(255, 127, 0, .5)",
    "rgba(255, 255, 0, .5)",
    "rgba(0, 255, 0, .5)",
    "rgba(255, 0, 255, .5)",
    "rgba(255, 0, 0, .5)",
    "rgba(127, 127, 127, .5)"
];
var queue = [];
var hold = 0;
var point = {x:4, y:1};
var rotation = 0;
var das = 105;
var dasTime = 0;
var dasKey = -1;
var canHold = true;
var frame = 0;
var patterns = [];
var positions = [];
var pieces = 0;
var lines = 0;
var pick = 0;
var showSol = false;
var started = false;
var streak = 0;
var ogQueue = [];
var solQueue = [];
var pieces = 0;

function loop() {
    if (pressed){
        started = true;
    }
    if (patterns.length==0){
        requestAnimationFrame(loop);
    }
    if (queue.length==0||(queue.length==1&&hold==0)){
        for (let i=0; i<16; i++){
            board[i] = [0,0,0,0,0,0,0,0,0,0];
        }
        pick = Math.floor(Math.random()*patterns.length);
        for (let y=16; y<20; y++){
            board[y] = [8,8,8,8,8,8,8,8,8,8];
            for (let x=patterns[pick].charAt((y-16)*2); x<parseInt(patterns[pick].charAt((y-16)*2+1))+1; x++){
                board[y][x] = 0;
            }
        }
        for (let i=8; i<11; i++){
            queue[i-8] = patterns[pick].charAt(i);
        }
        getHoldQueue();
        pieces = 0;
        for (let i=0; i<4; i++){
            queue[i] = ogQueue[i];
        }
    }
    //Processing
    if (keys[controls[0]]){ //left
        if (dasKey==controls[0]){
            if (Date.now()>dasTime){
                if (!collide(board, queue[0], {x:point.x-1, y:point.y}, rotation)){
                    point.x--;
                }
            }
        } else {
            if (!collide(board, queue[0], {x:point.x-1, y:point.y}, rotation)){
                point.x--;
            }
            dasKey = controls[0];
            dasTime = Date.now()+das;
        }
    } else if (dasKey==controls[0]){
        dasKey = -1;
    }
    if (keys[controls[1]]){ //right
        if (dasKey==controls[1]){
            if (Date.now()>dasTime){
                if (!collide(board, queue[0], {x:point.x+1, y:point.y}, rotation)){
                    point.x++;
                }
            }
        } else {
            if (!collide(board, queue[0], {x:point.x+1, y:point.y}, rotation)){
                point.x++;
            }
            dasKey = controls[1];
            dasTime = Date.now()+das;
        }
    } else if (dasKey==controls[1]){
        dasKey = -1;
    }
    if (keys[controls[2]]){ //down
        if (!collide(board, queue[0], {x:point.x, y:point.y+1}, rotation)){
            point.y++;
        }
    }
    if (keys[controls[3]]){ //up
        let rotate = srs(board, queue[0], point, rotation+1, true);
        if (rotate!=null){
            point = rotate;
            rotation++;
            rotation%=4;
        }
        keys[controls[3]] = false;
    }
    if (keys[controls[4]]){ //Z
        let rotate = srs(board, queue[0], point, rotation-1, false);
        if (rotate!=null){
            point = rotate;
            rotation--;
            rotation+=4;
            rotation%=4;
        }
        keys[controls[4]] = false;
    }
    if (keys[controls[5]]){ //A
        if (!collide(board, queue[0], point, rotation+2)){
            rotation+=2;
            rotation%=4;
        }
        keys[controls[5]] = false;
    }
    if (keys[controls[6]]){ //C
        keys[controls[6]] = false;
        if (canHold){
            if (hold==0){
                hold = queue.shift();
            } else {
                let temp = queue.shift();
                queue.unshift(hold);
                hold = temp;
            }
            point = {x:4, y:1};
            rotation = 0;
            if (queue[0]==1){
                rotation = 2;
                point.x = 5;
            }
        }
    }
    if (keys[controls[7]]){ //space
        while (!collide(board, queue[0], {x:point.x, y:point.y+1}, rotation)){
            point.y++;
        }
        canHold = true;
        let position = getPosition(queue[0], point, rotation);
        if (showSol){
            let matches = 0;
            for (let i=0; i<4; i++){
                for (let j=0; j<4; j++){
                    if (position[i].x==positions[pick].charAt(pieces*8+j*2)&&position[i].y==20-positions[pick].charAt(pieces*8+j*2+1)){
                        matches++;
                    }
                }
            }
            if (matches<4){
                showSol = false;
            }
        }
        pieces++;
        for (let i=0; i<4; i++){
            board[position[i].y][position[i].x] = queue[0];
        }
        point = {x:4, y:1};
        rotation = 0;
        queue.shift();
        lines+=update();
        if (queue.length==0||(queue.length==1&&hold==0)){
            showSol = false;
            board = [[]];
            for (let i=0; i<16; i++){
                board[i] = [0,0,0,0,0,0,0,0,0,0];
            }
            if (lines==4){
                pick = Math.floor(Math.random()*patterns.length);
                streak++;
            } else {
                streak = 0;
            }
            for (let y=16; y<20; y++){
                board[y] = [8,8,8,8,8,8,8,8,8,8];
                for (let x=patterns[pick].charAt((y-16)*2); x<parseInt(patterns[pick].charAt((y-16)*2+1))+1; x++){
                    board[y][x] = 0;
                }
            }
            for (let i=8; i<11; i++){
                queue[i-8] = patterns[pick].charAt(i);
            }
            if (lines==4){
                getHoldQueue();
            } else {
                hold = 0;
            }
            lines = 0;
            pieces = 0;
            for (let i=0; i<4; i++){
                queue[i] = ogQueue[i];
            }
        }
        keys[controls[7]] = false;
    }
    if (keys[controls[8]]&&positions.length>0){ //G
        streak = 0;
        board = [[]];
        for (let i=0; i<16; i++){
            board[i] = [0,0,0,0,0,0,0,0,0,0];
        }
        pieces = 0;
        lines = 0;
        for (let y=16; y<20; y++){
            board[y] = [8,8,8,8,8,8,8,8,8,8];
            for (let x=patterns[pick].charAt((y-16)*2); x<parseInt(patterns[pick].charAt((y-16)*2+1))+1; x++){
                board[y][x] = 0;
            }
        }
        for (let i=8; i<11; i++){
            queue[i-8] = patterns[pick].charAt(i);
        }
        hold = 0;
        for (let i=0; i<4; i++){
            queue[i] = ogQueue[i];
        }
        showSol = true;
    }
    //Drawing
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);
    if (!started){
        ctx.font = "80px Arial";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("P4RFECT CLEAR", 70, 200);
        ctx.font = "20px Arial";
        ctx.fillText("Click anywhere to start", 300, 400);
    } else {
        for (let y=0; y<20; y++){
            for (let x=0; x<10; x++){
                ctx.fillStyle = colors[board[y][x]];
                ctx.fillRect(x*20+100, y*20+100, 20, 20);
            }
        }
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeRect(100, 100, 200, 400);
        for (let i=1; i<queue.length; i++){
            ctx.fillStyle = colors[queue[i]];
            for (let j=0; j<4; j++){
                ctx.fillRect(shapes[queue[i]][j].x*20+340, shapes[queue[i]][j].y*20+i*60+60, 20, 20);
            }
        }
        let shadow = {x:point.x, y:point.y};
        while (!collide(board, queue[0], shadow, rotation)){
            shadow.y++;
        }
        shadow.y--;
        let drawShadow = getPosition(queue[0], shadow, rotation);
        ctx.fillStyle = "rgb(63, 63, 63)";
        for (let i=0; i<4; i++){
            ctx.fillRect(drawShadow[i].x*20+100, drawShadow[i].y*20+100, 20, 20);
        }
        if (showSol){
            ctx.fillStyle = darkers[solQueue[pieces]];
            for (let i=0; i<4; i++){
                ctx.fillRect(positions[pick].charAt(pieces*8+i*2)*20+100, 400-positions[pick].charAt(pieces*8+i*2+1)*20+100, 20, 20);
            }
        }
        if (hold>0){
            ctx.fillStyle = colors[hold];
            for (let i=0; i<4; i++){
                ctx.fillRect(shapes[hold][i].x*20+30, shapes[hold][i].y*20+50, 20, 20);
            }
        }
        ctx.fillStyle = colors[queue[0]];
        let shape = getPosition(queue[0], point, rotation);
        for (let i=0; i<4; i++){
            ctx.fillRect(shape[i].x*20+100, shape[i].y*20+100, 20, 20);
        }
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "20px Arial";
        ctx.fillText(Math.floor(1000/(Date.now()-frame))+"fps", 600, 50);
        ctx.fillText("Streak: "+streak, 600, 580);
    }
    frame = Date.now();
    requestAnimationFrame(loop);
}
function srs(board, piece, point, rotation, clockwise){
    rotation+=4;
    rotation%=4;
    if (!collide(board, piece, point, rotation)){
        return point;
    }
    if ((rotation==1&&!clockwise)||(rotation==1&&clockwise)){
        if (!collide(board, piece, {x:point.x-1, y:point.y}, rotation)){
            return {x:point.x-1, y:point.y};
        }
        if (!collide(board, piece, {x:point.x-1, y:point.y-1}, rotation)){
            return {x:point.x-1, y:point.y-1};
        }
        if (!collide(board, piece, {x:point.x, y:point.y+2}, rotation)){
            return {x:point.x, y:point.y+2};
        }
        if (!collide(board, piece, {x:point.x-1, y:point.y+2}, rotation)){
            return {x:point.x-1, y:point.y+2};
        }
        return null;
    }
    if ((rotation==2&&clockwise)||(rotation==0&&!clockwise)){
        if (!collide(board, piece, {x:point.x+1, y:point.y}, rotation)){
            return {x:point.x+1, y:point.y};
        }
        if (!collide(board, piece, {x:point.x+1, y:point.y+1}, rotation)){
            return {x:point.x+1, y:point.y+1};
        }
        if (!collide(board, piece, {x:point.x, y:point.y-2}, rotation)){
            return {x:point.x, y:point.y-2};
        }
        if (!collide(board, piece, {x:point.x+1, y:point.y-2}, rotation)){
            return {x:point.x+1, y:point.y-2};
        }
    }
    if ((rotation==3&&!clockwise)||(rotation==3&&clockwise)){
        if (!collide(board, piece, {x:point.x+1, y:point.y}, rotation)){
            return {x:point.x+1, y:point.y};
        }
        if (!collide(board, piece, {x:point.x+1, y:point.y-1}, rotation)){
            return {x:point.x+1, y:point.y-1};
        }
        if (!collide(board, piece, {x:point.x, y:point.y+2}, rotation)){
            return {x:point.x, y:point.y+2};
        }
        if (!collide(board, piece, {x:point.x+1, y:point.y+2}, rotation)){
            return {x:point.x+1, y:point.y+2};
        }
    }
    if ((rotation==0&&clockwise)||(rotation==2&&!clockwise)){
        if (!collide(board, piece, {x:point.x-1, y:point.y}, rotation)){
            return {x:point.x-1, y:point.y};
        }
        if (!collide(board, piece, {x:point.x-1, y:point.y+1}, rotation)){
            return {x:point.x-1, y:point.y+1};
        }
        if (!collide(board, piece, {x:point.x, y:point.y-2}, rotation)){
            return {x:point.x, y:point.y-2};
        }
        if (!collide(board, piece, {x:point.x-1, y:point.y-2}, rotation)){
            return {x:point.x-1, y:point.y-2};
        }
    }
}
function collide(board, piece, point, rotation){
    rotation+=4;
    rotation%=4;
    let position = getPosition(piece, point, rotation);
    for (let i=0; i<4; i++){
        if (position[i].x<0||position[i].x>9){
            return true;
        }
        if (position[i].y<0||position[i].y>19){
            return true;
        }
        if (board[position[i].y][position[i].x]>0){
            return true;
        }
    }
    return false;
}
function getPosition(piece, point, rotation){
    let shape = [];
    for (let i=0; i<4; i++){
        shape[i] = {x:shapes[piece][i].x, y:shapes[piece][i].y};
    }
    if (rotation==1){
        for (let i=0; i<4; i++){
            let temp = shape[i].x;
            shape[i].x = shape[i].y*-1;
            shape[i].y = temp;
        }
    }
    if (rotation==2){
        for (let i=0; i<4; i++){
            shape[i].x*=-1;
            shape[i].y*=-1;
        }
    }
    if (rotation==3){
        for (let i=0; i<4; i++){
            let temp = shape[i].x;
            shape[i].x = shape[i].y;
            shape[i].y = temp*-1;
        }
    }
    for (let i=0; i<4; i++){
        shape[i].x+=point.x;
        shape[i].y+=point.y;
    }
    return shape;
}
function update(){
    let lines = 0;
    for (let y=0; y<20; y++){
        let filled = true;
        for (let x=0; x<10; x++){
            if (board[y][x]==0){
                filled = false;
            }
        }
        if (filled){
            board.splice(y, 1);
            board.unshift([0,0,0,0,0,0,0,0,0,0]);
            lines++;
        }
    }
    return lines;
}
function newBag(){
    let bag = [1,2,3,4,5,6,7];
    let order = [];
    for (let i=0; i<7; i++){
        order[i] = bag.splice(Math.floor(Math.random()*bag.length), 1);
    }
    return order;
}
function getHoldQueue(){
    hold = 0;
    let holdIndex = -1;
    ogQueue = [];
    for (let i=0; i<3; i++){
        let doHold = Math.random()<0.5;
        if (doHold){
            if (holdIndex>=0){
                ogQueue[holdIndex] = queue[i];
                holdIndex = i+1;
            } else {
                holdIndex = i;
                ogQueue[i+1]= queue[i];
            }
        } else {
            if (holdIndex>=0){
                ogQueue[i+1] = queue[i];
            } else {
                ogQueue[i] = queue[i];
            }
        }
    }
    for (let i=0; i<3; i++){
        solQueue[i] = queue[i];
    }
    let remain = [true, true, true, true, true, true, true];
    for (let i=0; i<4; i++){
        if (i==holdIndex){
            continue;
        }
        if (i==3&&holdIndex==-1){
            continue;
        }
        remain[ogQueue[i]-1] = false;
    }
    let unused = Math.random()*4;
    for (let i=0; i<7; i++){
        if (remain[i]){
            unused--;
        }
        if (unused<0){
            if (holdIndex==-1){
                ogQueue[3] = i+1;
            } else {
                ogQueue[holdIndex] = i+1;
            }
            break;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    let fileUrl = 'https://raw.githubusercontent.com/Jacob-RC/Perfect-Clear-Tetris/main/solutions3.txt';
    // Fetch the contents of the file from the URL
    fetch(fileUrl)
      .then(response => response.text())
      .then(data => {
        patterns = data.split('\n');
        patterns.pop();
      })
      .catch(error => {
        console.error('Error fetching file:', error);
      });
    fileUrl = 'https://raw.githubusercontent.com/Jacob-RC/Perfect-Clear-Tetris/main/positions.txt';
    // Fetch the contents of the file from the URL
    fetch(fileUrl)
      .then(response => response.text())
      .then(data => {
        positions = data.split('\n');
        positions.pop();
        loop();
      })
      .catch(error => {
        console.error('Error fetching file:', error);
      });
  });
