var audio = new (function() {
  var t = this;

  t.mute = false;
  t.powerup = new Audio('powerup.wav');
  t.jump = new Audio('jump.wav');
  t.complete = new Audio('complete.wav');
  t.soundtrack = new Audio('ld24.wav');

  t.muteall = function() {
    t.mute = (t.mute) ? false : true;
    t.powerup.muted = t.mute;
    t.jump.muted = t.mute;
    t.complete.muted = t.mute;
    t.soundtrack.muted = t.mute;
  }
  //t.muteall();
  
  t.soundtrack.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);


})();
