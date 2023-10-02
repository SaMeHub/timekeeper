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
  
  // times for a ten-second notification
  var notes = [1, 2, 3, 5, 10, total / 4, total / 8, total / 2];
  notes.sort(function(a, b){return a - b});
  
  var trans = 1;
  var fadesteps = 10;
  var fadestate = 0;
  var fade = 0;
  // setTimeout(function(){fade = -1}, 2000);
  var isPaused = true;
  var isAlwaysOn = false;

  // set up canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // draw timer
  function drawClock() {
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
    
    total = (tEnd - tStart) / 1000 / 60;
    left = (tEnd - tNow) / 1000 / 60;
    // console.log(total + " " + Math.round(left * 1000) / 1000 + " " + Math.round(left/total * 1000)/1000 + " " + fadesteps + " " + fadestate + " " + fade + " " + notes);
    
    if (left < notes[notes.length - 1] + 0.05) {
      fade = 1;
      if (notes.length > 1) {
        notes.pop();
        setTimeout(function(){fade = -1}, 10000);
      }
    }

    ctx.reset();
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
    ctx.font = canvas.width * 0.09 + "px sans-serif";

    // ctx.beginPath();
    // ctx.rect(0, 0, canvas.width * 0.09, canvas.width * 0.09);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    ctx.fillText("+", canvas.width * 0.09 / 2, canvas.width * 0.09 / 2);
    // ctx.beginPath();
    // ctx.rect(0, canvas.height - canvas.width * 0.09, canvas.width * 0.09, canvas.width * 0.09);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    ctx.fillText("–", canvas.width * 0.09 / 2, canvas.height - canvas.width * 0.09 / 2);
    // ctx.beginPath();
    // ctx.rect(canvas.width - canvas.width * 0.09, 0, canvas.width * 0.09, canvas.width * 0.09);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    ctx.fillText("↺", canvas.width - canvas.width * 0.09 / 2, canvas.width * 0.09 / 2);
    // ctx.beginPath();
    // ctx.rect(canvas.width - canvas.width * 0.09, canvas.height / 2 - canvas.width * 0.09 / 2, canvas.width * 0.09, canvas.width * 0.09);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    ctx.fillText("⌾", canvas.width - canvas.width * 0.09 / 2, canvas.height / 2);
    // ctx.beginPath();
    // ctx.rect(canvas.width - canvas.width * 0.09, canvas.height - canvas.width * 0.09, canvas.width * 0.09, canvas.width * 0.09);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    ctx.font = canvas.width * 0.05 + "px sans-serif";
    ctx.fillText("▶||", canvas.width - canvas.width * 0.09 / 2, canvas.height - canvas.width * 0.09 / 2);
    
    var radius = canvas.height / 2;
    ctx.translate(canvas.width / 1.6, canvas.height / 2);
    ctx.miterLimit = 4;
    ctx.font = "35px";
    ctx.lineWidth = 0.5;

    // clock background
    const clkbkggrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    if (left < total / 8 || left <= 1) {
      clkbkggrad.addColorStop(0.00, "rgba(255, 165, 0, " + trans + ")");
    } else if (left < total / 4 || left <= 3) {
      clkbkggrad.addColorStop(0.00, "rgba(255, 255, 0, " + trans + ")");
    } else {
      clkbkggrad.addColorStop(0.00, "rgba(255, 255, 255, " + trans + ")");
    }
    clkbkggrad.addColorStop(0.90, "rgba(0, 0, 0, " + trans + ")");
    clkbkggrad.addColorStop(0.95, "rgba(0, 0, 0, " + trans + ")");
    clkbkggrad.addColorStop(1.00, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = clkbkggrad;
    ctx.fill();
    ctx.stroke();
    
    // clock-face numbers 
    ctx.fillStyle = "rgba(255, 255, 255, " + trans + ")";
    ctx.font = radius * 0.1 + "px sans-serif";
    for(let num = 1; num < 61; num++){
      let ang = num * 2 * Math.PI / 60;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.90);
      ctx.rotate(-ang);
      if (num % 5) {
        ctx.save();
          ctx.strokeStyle = "rgba(255, 255, 255, " + trans + ")";
          ctx.lineWidth = radius * 0.025;
          ctx.beginPath();
          ctx.rotate(ang + Math.PI / 2);
          ctx.moveTo(0, 0);
          ctx.lineTo(0, radius * 0.01);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        ctx.restore();
      } else {
        ctx.fillText(num.toString(), 0, 0);
      }
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.90);
      ctx.rotate(-ang);
    }

    // staring-time arc
    const clkstgrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    clkstgrad.addColorStop(0.00, "rgba(100, 100, 100, " + trans + ")");
    clkstgrad.addColorStop(0.90, "rgba(0, 0, 0, 0");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, total / 60. * 2. * Math.PI - 0.5 * Math.PI, - 0.5 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = clkstgrad;
    ctx.fill();
    ctx.stroke();

    // current-time arc
    const clkctgrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    clkctgrad.addColorStop(0.00, "rgba(255, 255, 255, " + trans + ")");
    clkctgrad.addColorStop(0.50, "rgba(255, 0, 0, " + trans + ")");
    clkctgrad.addColorStop(0.75, "rgba(255, 0, 0, " + trans + ")");
    clkctgrad.addColorStop(0.90, "rgba(0, 0, 0, 0");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    if (left > 0) {
      ctx.arc(0, 0, radius, left / 60. * 2. * Math.PI - 0.5 * Math.PI, - 0.5 * Math.PI, true);
    } else {
      ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
    }
    ctx.closePath();
    ctx.fillStyle = clkctgrad;
    ctx.fill();
    ctx.stroke();
    
    if (Math.abs(left) <= total) {
      // digital background
      const clkdigigrad = ctx.createRadialGradient(- radius * 1.5, 0, 0, - radius * 1.5, 0, radius / 2.5);
      clkdigigrad.addColorStop(0.00, "rgba(0, 0, 0, " + trans + ")");
      clkdigigrad.addColorStop(0.88, "rgba(0, 0, 0, " + trans + ")");
      clkdigigrad.addColorStop(1.00, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(- radius * 1.5, 0, radius / 2.5, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = clkdigigrad;
      ctx.fill();
      ctx.stroke();

      // digital timer
      ctx.translate(- radius * 1.5, - radius * 0.225);
      ctx.font = radius * 0.08 + "px sans-serif";
      if (left > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, " + trans + ")";
        ctx.fillText("time left", 0, 0);
      } else {
        ctx.fillStyle = "rgba(255, 0, 0, " + trans + ")";
        ctx.fillText("time over", 0, 0);
      }
      ctx.font = radius * 0.25 + "px sans-serif";
      ctx.translate(0, radius * 0.15);
      var mins = Math.abs(Math.trunc(left));
      var secs = Math.trunc((Math.abs(left) - mins) * 60).toString().padStart(2, '0');
      ctx.fillText(mins + ":" + secs, 0, 0);

      // time span
      ctx.fillStyle = "rgba(255, 255, 255, " + trans + ")";
      ctx.font = radius * 0.04 + "px sans-serif";
      ctx.translate(0, radius * 0.15);
      ctx.fillText("allocated timeslot", 0, 0);
      ctx.font = radius * 0.08 + "px sans-serif";
      ctx.translate(0, radius * 0.07);
      // ctx.fillText(tStart.toLocaleTimeString() + " – " + tEnd.toLocaleTimeString(), 0, 0);
      ctx.fillText(tStart.toLocaleTimeString().substr(0, 5) + " – " + tEnd.toLocaleTimeString().substr(0, 5), 0, 0);

      // current time
      ctx.fillStyle = "rgba(255, 255, 255, " + trans + ")";
      ctx.font = radius * 0.04 + "px sans-serif";
      ctx.translate(0, radius * 0.08);
      ctx.fillText("current time", 0, 0);
      ctx.font = radius * 0.08 + "px sans-serif";
      ctx.translate(0, radius * 0.07);
      // ctx.fillText(tNow.toLocaleTimeString(), 0, 0);
      ctx.fillText(tNow.toLocaleTimeString().substr(0, 5), 0, 0);
    }
    
    ctx.restore();
  }
  
  window.addEventListener('resize', function(event) {
    let WoverH = 16/9;
    let border = 0;
    let maxW = Math.round(Math.min(window.visualViewport.width, window.visualViewport.height * WoverH) - border);
    let maxH = Math.round(Math.min(window.visualViewport.height, window.visualViewport.width / WoverH) - border);
    var frame = document.getElementById("frame");
    frame.style.width = maxW + "px";
    frame.style.height = maxH + "px";
    frame.style.marginTop = -(maxH / 2) + "px";
    frame.style.marginLeft = -(maxW / 2) + "px";
    frame.width = maxW;
    frame.height = maxH;
    var canvas = document.getElementById("canvas");
    canvas.style.width = maxW + "px";
    canvas.style.height = maxH + "px";
    canvas.width = maxW;
    canvas.height = maxH;
    drawClock();
  }, true);
  window.dispatchEvent(new Event('resize'));
  
  canvas.addEventListener('mousedown', function(evt) {
    var coordX  = evt.offsetX;
    var coordY  = evt.offsetY;
    var isCircle = Math.sqrt(Math.pow(coordX - canvas.width / 1.6, 2) + Math.pow(coordY - canvas.height / 2, 2)) < canvas.height / 2;
    
    if (coordX > 0 && coordY > 0 && coordX < canvas.width * 0.09 && coordY < canvas.width * 0.09) {
      // plus
      if (isPaused) {
        duration += 1.;
        left += 1.;
      }
      // if (!isPaused) setTimeout(function(){isPaused = false;}, 1000);
      // isPaused = true;
    } else if (coordX > 0 && coordY > canvas.height - canvas.width * 0.09 && coordX < canvas.width * 0.09 && coordY < canvas.height) {
      // minus
      if (isPaused) {
        duration -= 1.;
        left -= 1.;
      }
      // if (!isPaused) setTimeout(function(){isPaused = false;}, 1000);
      // isPaused = true;
    } else if (coordX > canvas.width - canvas.width * 0.09 && coordY > 0 && coordX < canvas.width && coordY < canvas.width * 0.09) {
      // reset
      if (isPaused) left = duration;
    } else if (coordX > canvas.width - canvas.width * 0.09 && coordY > canvas.height / 2 - canvas.width * 0.09 / 2 && coordX < canvas.width && coordY < canvas.height / 2 + canvas.width * 0.09 / 2) {
      // alwaysOn
      isAlwaysOn = !isAlwaysOn;
    } else if (coordX > canvas.width - canvas.width * 0.09 && coordY > canvas.height - canvas.width * 0.09 && coordX < canvas.width && coordY < canvas.height) {
      // start/pause
      isPaused = !isPaused;
    } else if (isCircle) {
      // set time on clock
      var atan2 = Math.atan2(coordX - canvas.width / 1.6, canvas.height / 2 - coordY);
      atan2 = (atan2 > 0 ? atan2 : (2 * Math.PI + atan2));
      var min = atan2 / (2 * Math.PI) * 60;
      if (isPaused) duration = left = Math.round(min);
    }
    
    if (fade < 1) {
      fade = 1;
      setTimeout(function(){fade = -1}, 1000);
    }

    if (!isPaused) setTimeout(function(){fade = -1}, 1000);
    
    drawClock();
  }, false);
  
  setInterval(drawClock, 125);
};

