var player = new (function() {
  
  var t = this;

  t.img = new Image();
  t.img.width = 128;
  t.img.height = 16;
  t.img.src = 'player.png';
  t.img.onload = function() {
    t.loaded = true;
  }
  t.loaded = false;

  t.x = 100;  // x position
  t.y = 50;  // y position
  t.w = 16; // width
  t.h = 16; // height
  t.dx = 0; // direction x
  t.dy = 0; // direction y
  t.s = 0;  // state 1-2:standing 3-4: walking right 5-6:walking left
  t.c = 0;   // counter
  t.ct = 20; // counter total
  t.ka = { l:false, r:false }; // key active
  t.jump = 0; // jumping
  t.fall = 0; // falling
  t.tileref = { x:0, y:0 };
  t.upgrade = { xspeed:3, yspeed:1, jumpheight:3, fallspeed:-8 };
  t.upgradekeys = ['xspeed', 'yspeed', 'jumpheight', 'fallspeed'];
  t.levelcomplete = 0;
  t.totaltime = 0;
  t.leveltime = 0;

  t.update = function() {

    var xstart = t.x,
      ystart = t.y;

    // update the loop
    (t.c < t.ct) ?  t.c++ : t.c = 0;

    // move animation onwards
    if(t.c == 0) {
      switch(t.s){
        case 0: t.s = 1; break; // standing
        case 1: t.s = 0; break;
        case 2: t.s = 3; break; // walking left
        case 3: t.s = 2; break;
        case 4: t.s = 5; break; // walking right
        case 5: t.s = 4; break;
        case 6: t.s = 7; break; // falling
        case 7: t.s = 6; break;
      }
      t.leveltime++;
    }
    
    t.tileref.x = Math.floor((t.x+(t.w/2)) / t.w);
    t.tileref.y = Math.floor((t.y+t.h) / t.h);

    // loop animation
    if(t.dx < 0 && (t.s == 2 || t.s == 3)) t.s = 4;
    if(t.dx > 0 && (t.s == 4 || t.s == 5)) t.s = 2; 

    // pickups
    if(t.checkpickup()) {
      switch(world.tiles[t.tileref.y-1][t.tileref.x]) {
        case 3: t.upgrade.xspeed += 1; break;
        case 4: t.upgrade.jumpheight += 1; break;
        case 5: t.upgrade.fallspeed += 1; break;
        case 7: audio.complete.play(); world.complete = 1; break;
      }
      audio.powerup.play();
      world.tiles[t.tileref.y+-1][t.tileref.x] = 0;
    }

    // deal with gravity
    if(t.jump > 0) {
      t.jump--;
      t.dy = -t.upgrade.jumpheight;
    } else {
      t.jump = 0;
      t.fall = (t.checkfall()) ? 1 : 0; 
      if((t.s == 6 || t.s == 7) && !t.fall) t.s = 0;
      if(t.fall && t.s == 0) t.s = 6;
      t.dy = (t.fall) ? -t.upgrade.fallspeed : 0;
    }

    t.x += t.dx;
    if(t.jump || t.fall) {
      t.y += t.dy;
    } else {
      t.y -= (t.y%16);
    }

    if(t.x > game.w - (t.w*2-1) || t.x < t.w-1) t.x -= t.dx;

    if(t.y <= 0) t.y = 0; // stop the player going off the top of the screen
  }

  t.draw = function() {
    
    /*
    if(t.checkcollision()) {
      ctx.fillStyle = '#ff3333';
    } else {
      ctx.fillStyle = '#33ffff';
    }
    ctx.fillRect((t.tileref.x * t.w), (t.tileref.y * t.h) - t.w, t.w, t.h);
    */

    try {
      ctx.drawImage(t.img, (t.w*t.s), 0, t.w, t.h, t.x, t.y, t.w, t.h);
    } catch(e) {
      // image not loaded
    }
    if(world.current != world.levels.length -1) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Monaco, Courier, Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('Level:'+world.levelnumber+' Time:'+t.leveltime + ' Total:'+ t.totaltime, game.w - t.w-3, t.h+3);
    }

  }

  t.keydown = function(e) {
    if(e.keyCode == 68 || e.keyCode == 39) {
      //t.ka.r = true;
      t.dx = t.upgrade.xspeed;
      t.s = 2;
    }
    if(e.keyCode == 65 || e.keyCode == 37){
      //t.ka.l = true;
      t.dx = -t.upgrade.xspeed;
      t.s = 4;
    }
    if(e.keyCode == 87 || e.keyCode == 38) {
      if(t.jump == 0 && t.fall == 0 && !t.checkfall()) {
        t.jump = t.upgrade.jumpheight;
        t.s = 6;
        audio.jump.play();
      }
    }

    if(e.keyCode == 82) {
      // reload world
      world.loadlevel(); 
    }
    if(e.keyCode == 77) {
      // mute / unmute
      audio.muteall();
    }

  }

  t.keyup = function(e) {
    if(e.keyCode == 68 || e.keyCode == 39) {
      t.dx = 0;
      t.s = 0;
    }
    
    if(e.keyCode == 65 || e.keyCode == 37){
      t.dx = 0;
      t.s = 0;
    }
    if(e.keyCode == 87 || e.keyCode == 38) {
    }
  }

  t.checkfall = function() {
    try {
      var r = false;

      for(i=0;i<world.cleartiles.length;i++) {
        if(world.tiles[t.tileref.y][t.tileref.x] == world.cleartiles[i]) {
          r = true;
        }
      }
      return r;
    } catch(e) {
      return false;
    }

    return false;
  }

  t.checkpickup = function() {
    try {
      var r = false;
      for(i=0; i<world.pickups.length; i++) {
        if(world.tiles[t.tileref.y-1][t.tileref.x] == world.pickups[i]) {
          r = true;
        }
      }
      return r;
    } catch(e) {
      return false;
    }
  }

  t.checkcollision = function() {
    try {
      if((
          world.tiles[t.tileref.y-1][t.tileref.x] != 0
          || world.tiles[(t.y % t.h)-1][t.x % t.w] != 0
        ) && t.jump == 0 && t.fall == 0) {
        return true;
      }
    } catch(e) {
      // do nothing
    }
    return false;
  }

})();
