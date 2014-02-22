/*
  INSERT TITLE
  ====================

  Author: Matt Gale ( info@littleball.co.uk )
  Created for Ludum Dare 48
  (c) Matt Gale 2012

*/

var game = {
    w:320, h:240
  },
  buffer = document.getElementById('buffer-canvas'),
  canvas = document.getElementById('main-canvas'),
  ctx = buffer.getContext('2d'),
  main_ctx = canvas.getContext('2d'),
  timeout,
  fps = 1000 / 50;
  
canvas.width = game.w * 2;
canvas.height = game.h * 2;
buffer.width = game.w;
buffer.height = game.h;
ctx.mozImageSmoothingEnabled = false;
main_ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
main_ctx.webkitImageSmoothingEnabled = false;


function init() {

  var img = new Image();
  img.width = 21;
  img.height = 206;
  img.onload = function() {
    ctx.drawImage(img, 0, 0, 21, 20, 0, 0, 84, 80);
    doublebuffer();
  }
  img.src = 'title.png';

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Monaco, Courier, Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('Augment to advance', game.w/2, (game.h/2)-10);
  ctx.font = '10px Monaco, Courier, Arial';
  ctx.fillText('Press anything to begin', game.w/2, (game.h/2)+10);

  ctx.fillText('Use "WAD" or arrow keys to move', game.w/2, game.h-45);
  ctx.fillText('You can press "R" at anytime to restart the level', game.w/2, game.h-30);
  ctx.fillText('Press "M" to switch of music and sounds', game.w/2, game.h-15);

  document.addEventListener('keypress', startlistener, false);
}

function startlistener(e) { start(); }

function start() {
  
  audio.soundtrack.play();

  document.removeEventListener('keypress', startlistener, false);

  document.addEventListener('keydown', function(e) {
    var e = (e) ? e : ((event) ? event : null);
    player.keydown(e);
  }, true);
  document.addEventListener('keyup', function(e) {
    var e = (e) ? e : ((event) ? event : null);
    player.keyup(e);
  }, true);

  loop();
}

function update() {
  world.update();
  player.update();
}

function draw() {
  ctx.clearRect(0, 0, game.w, game.h);
  world.draw();
  player.draw();
}


function loop() {
  update();
  draw();
  doublebuffer();
  if(world.current < world.levels.length) {
    timeout = setTimeout(loop, fps);
  } else {
    alert('Game complete');
  }
}

function doublebuffer() {
  main_ctx.clearRect(0,0,game.w*2,game.h*2);
  main_ctx.drawImage(buffer, 0, 0, game.w, game.h, 0, 0, game.w*2, game.h*2);
}

function pause() {
  if(timeout == ''){
    loop();
  } else {
    clearTimeout(timeout);
    timeout = '';
  }
}

window.load = init();
