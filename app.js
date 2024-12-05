/* bogenspiele.mehlhase.info */
/* (c) Sascha Mehlhase - kontakt@mehlhase.info */

// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

window.onload = function() {
  var duration = 15;
  var tNow = new Date();
  var tStart = new Date();
  var tEnd = new Date();
  tEnd.setMinutes(tEnd.getMinutes() + duration);
  // tEnd.setSeconds(tEnd.getSeconds() + 30);
  // tStart.setMinutes(tStart.getMinutes() - 4);
  var total = (tEnd - tStart) / 1000 / 60;
  var left = (tEnd - tNow) / 1000 / 60;
  var frac = Math.round(left / total * 100);
  
  // times for a ten-second notification
  function updateNotes(total) {
    var notes = [1, 2, 3, 5, 10, Math.trunc(total / 8), Math.trunc(total / 4), Math.trunc(total / 2)];
    notes = notes.filter((value, index) => notes.indexOf(value) === index);
    notes.sort(function(a, b){return a - b});
    for (let index = notes.length - 1; index >= 0; index--) {
      const element = notes[index];
      if (element > total && notes.length > 1) notes.pop();
    }
    return notes;
  }
  var notes = updateNotes(total);
  
  var trans = 1;
  var fadesteps = 10;
  var fadestate = 0;
  var fade = 0;
  // setTimeout(function(){fade = -1}, 2000);
  var isPaused = true;
  var isAlwaysOn = false;

  // draw timer
  function updateTime() {
    if (fade < 0 && fadestate > 0) {
      fadestate += fade;
    } else if (fade > 0 && fadestate < fadesteps) {
      fadestate += fade;
    } else fade = 0;
    trans = fadestate / fadesteps;
    
    tNow = new Date();
    if (isPaused) {
      tEnd = new Date(tNow);
      tEnd.setMinutes(tEnd.getMinutes() + left);
      tEnd.setSeconds(tEnd.getSeconds() + (left - Math.trunc(left)) * 60);
      if (left == duration) {
        tStart = new Date(tNow);
      }
      fade = 1;
    }

    if (isAlwaysOn) fade = 1;
    
    // 
    left = (tEnd - tNow) / 1000 / 60;
    frac = (left / total * 100).toFixed(1);
    // console.log(total + " " + Math.round(left * 1000) / 1000 + " " + Math.round(left/total * 1000)/1000 + " " + fadesteps + " " + fadestate + " " + fade + " " + notes);
    
    if (left < notes[notes.length - 1] + 0.05) {
      fade = 1;
      if (notes.length > 1) {
        notes.pop();
        setTimeout(function(){fade = -1}, 10000);
      }
    }
    
    // update transparency
    var timekeeperbar = document.querySelector(".timekeeperbar");
    timekeeperbar.style.opacity = trans;
    // var infobar = document.querySelector(".infobar");
    // infobar.style.opacity = trans;

    // update bar position
    var timebar = document.querySelector(".timebar");
    if (left > 0) {
      var warning = (1 / total * 100 * 100 / frac).toFixed(1);
      timebar.style.width = frac + "%";
      timebar.style.background = "linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1), " + warning + "%, rgba(255, 160, 0, 1), " + (3 * warning) + "%, rgba(26, 138, 185, 1))";
      // timebar.style.background = "linear-gradient(90deg, rgba(255, 0, 0, " + trans + "), rgba(255, 0, 0, " + trans + "), " + warning + "%, rgba(255, 160, 0, " + trans + "), " + (3 * warning) + "%, rgba(26, 138, 185, " + trans + "))";
    } else {
      timebar.style.width = "100%";
      timebar.style.background = "rgba(255, 0, 0, " + trans + ")";
    }

    // update timer
    var timelabel = document.querySelector(".timelabel");
    var timeleft = document.querySelector(".timeleft");
    var mins = Math.abs(Math.trunc(left));
    var secs = Math.trunc((Math.abs(left) - mins) * 60).toString().padStart(2, '0');
    timeleft.innerHTML = mins + ":" + secs;
    if (left > 0) {
      timelabel.innerHTML = "time left";
    } else {
      timelabel.innerHTML = "time over";
    }

    // update timespan
    var timespan = document.querySelector(".timespan");
    timespan.innerHTML = tStart.getHours().toString().padStart(2, '0') + ":" + tStart.getMinutes().toString().padStart(2, '0') +
                          " – " +
                          tEnd.getHours().toString().padStart(2, '0') + ":" + tEnd.getMinutes().toString().padStart(2, '0');

    // update current time
    var timenow = document.querySelector(".timenow");
    timenow.innerHTML = tNow.getHours().toString().padStart(2, '0') + ":" + tNow.getMinutes().toString().padStart(2, '0');

  }

  window.addEventListener('resize', function(event) {
    let WoverH = 16/9;
    let border = 0;
    let maxW = Math.round(Math.min(window.visualViewport.width, window.visualViewport.height * WoverH) - border);
    let maxH = Math.round(Math.min(window.visualViewport.height, window.visualViewport.width / WoverH) - border);
    var frame = document.querySelector(".frame");
    // next two line overwrite to use full window width
    maxW = window.visualViewport.width;
    maxH = window.visualViewport.height;
    frame.style.width = maxW + "px";
    frame.style.height = maxH + "px";
    frame.style.marginTop = -(maxH / 2) + "px";
    frame.style.marginLeft = -(maxW / 2) + "px";
    frame.width = maxW;
    frame.height = maxH;
  }, true);
  window.dispatchEvent(new Event('resize'));
  
  function fadeCheck() {
    if (fade < 1) {
      fade = 1;
      setTimeout(function(){fade = -1}, 1000);
    }
    if (!isPaused) setTimeout(function(){fade = -1}, 1000);
  }
  
  var reset = document.querySelector("#reset");
  reset.addEventListener('click', function(event) {
    // console.log("reset");
    if (isPaused) {
      left = duration;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  var minus = document.querySelector("#minus");
  minus.addEventListener('click', function(event) {
    // console.log("minus");
    if (isPaused) {
      duration -= 1.;
      left -= 1.;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  var plus = document.querySelector("#plus");
  plus.addEventListener('click', function(event) {
    // console.log("plus");
    if (isPaused) {
      duration += 1.;
      left += 1.;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  var play = document.querySelector("#play");
  play.addEventListener('click', function(event) {
    // console.log("play");
    isPaused = !isPaused;
    fadeCheck();
    updateTime();
  }, true);
  
  var show = document.querySelector("#show");
  show.addEventListener('click', function(event) {
    // console.log("show");
    isAlwaysOn = !isAlwaysOn;
    fadeCheck();
    updateTime();
  }, true);
  
  window.addEventListener('click', function(event) {
    fadeCheck();
    updateTime();
  }, true);

  setInterval(updateTime, 125);
};

