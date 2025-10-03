/* timekeeper.mehlhase.info */
/* (c) Sascha Mehlhase - kontakt@mehlhase.info */

// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
  // navigator.serviceWorker.register('http://localhost/~saschamehlhase/mehlhase.info_timekeeper/sw.js');
}

window.onload = function() {
  let duration = 15;
  let tNow = new Date();

  // fetch('time.php')
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Using server time:', data.serverTime);
  //     tNow = new Date(data.serverTime);
  //     console.log('Local time:', new Date(tNow).toString());
  //   })
  //   .catch(error => console.error('Error fetching server time:', error));

  let tStart = new Date(tNow);
  let tEnd = new Date(tNow);
  tEnd.setMinutes(tEnd.getMinutes() + duration);
  // tEnd.setSeconds(tEnd.getSeconds() + 30);
  // tStart.setMinutes(tStart.getMinutes() - 4);
  let total = (tEnd - tStart) / 1000 / 60;
  let left = (tEnd - tNow) / 1000 / 60;
  let frac = Math.round(left / total * 100);
  
  // times for a ten-second notification
  function updateNotes(total) {
    // let notes = [Math.trunc(total / 8), Math.trunc(total / 4), Math.trunc(total / 2), Math.trunc(total / 4 * 3)];
    let notes = [];
    for (let i = 5; i < total; i += 5) notes.push(i); 
    notes = notes.filter((value, index) => notes.indexOf(value) === index);
    notes.sort(function(a, b){return a - b});
    for (let index = notes.length - 1; index >= 0; index--) {
      const element = notes[index];
      if (element > total && notes.length > 1) notes.pop();
    }
    return notes;
  }
  let notes = updateNotes(total);
  
  let trans = 1;
  let fadesteps = 10;
  let fadestate = 0;
  let fade = 0;
  // setTimeout(function(){fade = -1}, 2000);
  let isPaused = true;
  let isAlwaysOn = false;
  let punish = [0, 1, 2, 3, 4, 5, 6, 7];

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
      tEnd = new Date(tNow.getTime() + left * 60000)
      if (left == duration) {
        tStart = new Date(tNow);
      }
      fade = 1;
    }

    let showpathinner = document.querySelector("#showpathinner");
    if (isAlwaysOn) {
      fade = 1;
      showpathinner.style.fill = "#ffffff";
    } else {
      showpathinner.style.fill = "#ffffff77";
    }
    
    let punishtext = document.querySelector("#punish");
    punishtext.innerHTML = punish[0];

    // 
    left = (tEnd - tNow) / 1000 / 60;
    frac = (left / total * 100).toFixed(1);
    
    if (left < (notes[notes.length - 1] + 0.05)) {
      fade = 1;
      if (notes.length > 1) {
        notes.pop();
        setTimeout(function(){fade = -1}, 10000);
      }
      console.log(notes);
    }
    if (left < 3.05) fade = 1;
    
    // update transparency
    let timekeeperbar = document.querySelector(".timekeeperbar");
    timekeeperbar.style.opacity = trans;

    // update bar position
    let timebar = document.querySelector(".timebar");
    if (left > 0) {
      let warning = (1 / total * 100 * 100 / frac).toFixed(1);
      timebar.style.width = frac + "%";
      timebar.style.background = "linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.5), " + warning + "%, rgba(255, 160, 0, 0.5), " + (3 * warning) + "%, rgba(26, 138, 185, 0.5))";
    } else {
      timebar.style.width = "100%";
      timebar.style.background = "rgba(255, 0, 0, " + trans + ")";
    }

    // update timer
    let frame = document.querySelector(".frame");
    let timelabel = document.querySelector(".timelabel");
    let timeleft = document.querySelector(".timeleft");
    let mins = Math.abs(Math.trunc(left));
    let secs = Math.trunc((Math.abs(left) - mins) * 60).toString().padStart(2, '0');
    timeleft.innerHTML = mins + ":" + secs;
    if (left > 0) {
      timelabel.innerHTML = "time left";
      frame.style.background = "";
    } else {
      timelabel.innerHTML = "time over";
      switch(punish[0]) {
        case 1:
          frame.style.background = "radial-gradient(circle at center, rgba(0, 0, 0, 0) " + Math.max(0, 100 + left * 100)  + "%, rgba(0, 0, 0, 0.5) 100%)";
          break;
        case 2:
          frame.style.background = "radial-gradient(circle at center, rgba(255, 0, 0, 0) " + Math.max(0, 100 + left * 100)  + "%, rgba(255, 0, 0, 0.5) 100%)";
          break;
        case 3:
          frame.style.background = "radial-gradient(circle at center, rgba(0, 0, 0, 0) " + Math.max(0, 100 + left * 100)  + "%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(circle at center, rgba(255, 0, 0, 0) " + Math.max(80, 100 + (left + 1) * 100)  + "%, rgba(255, 0, 0, 0.5) 100%)";
          break;
        case 4:
          frame.style.background = "radial-gradient(circle at bottom center, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0)" + Math.min(100, left * -100)  + "%)";
          break;
        case 5:
          frame.style.background = "radial-gradient(circle at bottom center, rgba(255, 0, 0, 0.5) 0, rgba(255, 0, 0, 0)" + Math.min(100, left * -100)  + "%)";
          break;
        case 6:
          frame.style.background = "radial-gradient(circle at top left, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at top right, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at bottom left, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0)" + Math.min(50, left * -50)  + "%)";
          break;
        case 7:
          frame.style.background = "radial-gradient(circle at top left, rgba(255, 0, 0, 0.5) 0, rgba(255, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at top right, rgba(255, 0, 0, 0.5) 0, rgba(255, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at bottom right, rgba(255, 0, 0, 0.5) 0, rgba(255, 0, 0, 0)" + Math.min(50, left * -50)  + "%), radial-gradient(circle at bottom left, rgba(255, 0, 0, 0.5) 0, rgba(255, 0, 0, 0)" + Math.min(50, left * -50)  + "%)";
          break;
        default:
          frame.style.background = "";
      }
    }

    // update timespan
    let timespan = document.querySelector(".timespan");
    timespan.innerHTML = tStart.getHours().toString().padStart(2, '0') + ":" + tStart.getMinutes().toString().padStart(2, '0') +
                          " – " +
                          tEnd.getHours().toString().padStart(2, '0') + ":" + tEnd.getMinutes().toString().padStart(2, '0') +
                          " (" + duration + "')";;

    // update current time
    let timenow = document.querySelector(".timenow");
    timenow.innerHTML = tNow.getHours().toString().padStart(2, '0') + ":" + tNow.getMinutes().toString().padStart(2, '0') + ":" + tNow.getSeconds().toString().padStart(2, '0');

  }

  window.addEventListener('resize', function(event) {
    let WoverH = 16/9;
    let border = 0;
    let maxW = Math.round(Math.min(window.visualViewport.width, window.visualViewport.height * WoverH) - border);
    let maxH = Math.round(Math.min(window.visualViewport.height, window.visualViewport.width / WoverH) - border);
    let frame = document.querySelector(".frame");
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
  
  let reset = document.querySelector("#reset");
  let minus = document.querySelector("#minus");
  let plus = document.querySelector("#plus");
  let play = document.querySelector("#play");
  let pause = document.querySelector("#pause");
  let show = document.querySelector("#show");
  let punishtext = document.querySelector("#punish");

  reset.addEventListener('click', function(event) {
    // console.log("reset clicked");
    if (isPaused) {
      left = duration;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  minus.addEventListener('click', function(event) {
    // console.log("minus clicked");
    if (isPaused) {
      duration = Math.max(1, duration - 1);
      (left == duration) ? left = Math.max(1, left - 1) : left -= 1;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  plus.addEventListener('click', function(event) {
    // console.log("plus clicked");
    if (isPaused) {
      if (left > 0) duration += 1;
      left += 1;
      total = duration;
      notes = updateNotes(total)
      fadeCheck();
    }
    updateTime();
  }, true);
  
  play.addEventListener('click', function(event) {
    // console.log("play clicked");
    isPaused = !isPaused;
    play.style.display = "none";
    pause.style.display = "block";
    plus.style.opacity = 0.5;
    minus.style.opacity = 0.5;
    reset.style.opacity = 0.5;
    fadeCheck();
    updateTime();
  }, true);

  pause.style.display = "none";
  pause.addEventListener('click', function(event) {
    // console.log("pause clicked");
    isPaused = !isPaused;
    play.style.display = "block";
    pause.style.display = "none";
    plus.style.opacity = 1;
    minus.style.opacity = 1;
    reset.style.opacity = 1;
    fadeCheck();
    updateTime();
  }, true);
  
  show.addEventListener('click', function(event) {
    // console.log("show clicked");
    isAlwaysOn = !isAlwaysOn;
    fadeCheck();
    updateTime();
  }, true);

  punishtext.addEventListener('click', function(event) {
    // console.log("punish clicked");
    punish.push(punish.shift());
  }, true);

  window.addEventListener("keydown", function(event){
    switch(event.key) {
      case "1":
      case "r":
      case "ArrowLeft":
        reset.click();
        break;
      case "4":
      case "ArrowRight":
      case " ":
        if (isPaused) play.click();
        else pause.click();
        break;
      case "3":
      case "+":
      case "ArrowUp":
        plus.click();
        break;
      case "2":
      case "-":
      case "ArrowDown":
        minus.click();
        break;
      case "5":
      case "v":
        show.click();
        break;
      case "p":
      case "6":
        punishtext.click();
        break;
    }
  }, false);
  
  window.addEventListener('click', function(event) {
    fadeCheck();
    updateTime();
  }, true);

  setInterval(updateTime, 125);
};

