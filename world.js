var world = new (function() {
  
  var t = this;
  
  t.current = 0;
  t.levels = [
    'level0.js?2',
    'level1.js?2',
    'level2.js?2',
    'level3.js?2',
    'level4.js?2',
    'level5.js?2',
    'level6.js?2',
    'level7.js?2',
    'level8.js?2',
    'level9.js?2',
    'level10.js?2',
    'level11.js?2',
    'level12.js?2',
    'level13.js?2',
    'level14.js?2',
    'final.js?2'
  ];
  t.complete = 0;
  t.completed_level = false;
  t.levelnumber = 0;
  
  t.loadlevel = function() {
    t.loaded = false;
    player.leveltime = 0;
    t.currentlevel = document.createElement('script');
    t.currentlevel.type = 'text/javascript';
    t.currentlevel.onload = function() {
      t.loaded = true;
      var text = document.getElementById('leveltext');
      text.innerHTML = t.leveltext;
    }
    t.currentlevel.src = t.levels[t.current];
    t.levelnumber = parseInt(t.currentlevel.src.replace(/(.*)level(\d\d?).js\?\d/, '$2'))+1;
    document.body.appendChild(t.currentlevel);
  }

  t.img = new Image();
  t.img.width = 128;
  t.img.height = 16;
  t.img.src = 'world.png';
  t.img.onload = function() {
    t.loadlevel();
  }
  t.loaded = false;

  t.x = 0;
  t.y = 0;
  t.w = 16; // tile width
  t.h = 16; // tile height

  t.update = function() {
    if(t.complete == 1) {
      t.current++;
      if(t.current < t.levels.length) {
        player.totaltime += (300 - player.leveltime > 0) ? 300 - player.leveltime : 0;
        t.complete = 0;
        t.loadlevel();
      }
    }
  }

  t.draw = function() {
    
    if(t.loaded) { 
      for(y=0; y<t.tiles.length; y++) {
        for(x=0; x<t.tiles[0].length; x++) {
          if(t.tiles[y][x] != 0)
          ctx.drawImage(t.img, t.w*t.tiles[y][x]-t.w, 0, t.w, t.h, x * t.w, y * t.h, t.w, t.h);
        }
      }
    }
  }
  
 

})();
