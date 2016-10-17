const docs = document.getElementsByTagName('input');
for (let i = 0; i < docs.length; i++) {
  const label = docs[i].previousElementSibling.previousElementSibling;
  const hiniText = docs[i].previousElementSibling;
  const hr = docs[i].nextElementSibling.lastElementChild;
  docs[i].onfocus = function () {
    if(this.value === ""){
      hiniText.style.opacity="1";
      label.style.transform="scale(0.75) translate(0px, -28px)";
      label.style.color="rgb(0, 188, 212)";
      hr.style.transform="scaleX(1)";
    }
  }
  docs[i].onblur = function () {
    if(this.value === ""){
      label.style.transform="scale(1) translate(0px, 0px)";
      label.style.color="rgba(0, 0, 0, 0.298039)";
      hiniText.style.opacity="0";
      hr.style.transform="scaleX(0)";
    }
  }
  docs[i].oninput = function () {
    if(this.value !== ""){
      hiniText.style.opacity="0";
    }else {
      hiniText.style.opacity="1";
    }
  }
}
function eventOrdinate(ev, type) {
  const event = {};
  switch(type){
    case 'click': 
    event.eventX = ev.clientX;
    event.eventY = ev.clientY;
    break;
    case 'touch':
    let touch = ev.changedTouches[0];
    event.eventX = Number(touch.pageX);
    event.eventY = Number(touch.pageY);
    break;
  }
  return event;
}
function clickDOM(ev, doc, type) {
  const tMax = doc.offsetWidth > doc.offsetHeight
  ?doc.offsetWidth
  :doc.offsetHeight;
  const event = eventOrdinate(ev, type);
  const mLeft = event.eventX - doc.offsetLeft;
  const mTop = event.eventY - doc.offsetTop;
  const mMax = doc.offsetWidth > doc.offsetHeight ? mLeft : mTop;
  const rWidth = mLeft > doc.offsetWidth/2 
  ? mLeft 
  : doc.offsetWidth-mLeft;
  const rHeight = mTop > doc.offsetHeight/2 
  ? mTop 
  : doc.offsetHeight-mTop;
  const radius = Math.sqrt( Math.pow( rWidth, 2 ) + Math.pow( rHeight, 2 ) );
  const rLeft = mLeft - radius;
  const rTop = mTop - radius;
  const diameter = radius * 2;
  return {
    radius: {
      top: rTop,
      left: rLeft
    },
    diameter: diameter
  }
}
function rippleDOM(rip, rippleStyle, style ,time) {
  rippleStyle.opacity = style.opacity;
  rippleStyle.transform = style.transform;
  rippleStyle.position = "absolute"; 
  rippleStyle.top = rip.radius.top + "px"; 
  rippleStyle.left = rip.radius.left + "px"; 
  rippleStyle.height = rip.diameter + "px"; 
  rippleStyle.width = rip.diameter + "px"; 
  rippleStyle.borderRadius = "50%"; 
  rippleStyle.backgroundColor = "#ffffff"; 
  rippleStyle.transition = "opacity "+ time.opacity +"s cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform "+ time.transform +"s cubic-bezier(0.23, 1, 0.32, 1) 0ms";
  return rippleStyle;
}
const clickBtns = document.getElementsByClassName('click');
for (let i = 0; i < clickBtns.length; i++) {
  let btn = clickBtns[i];
  const span = btn.children[0].children[0];
  btn.onclick = function (ev) {
    const ripple = document.createElement('div');
    let rippleStyle = ripple.style;
    let rip = clickDOM(ev, this, 'click');
    rippleStyle = rippleDOM(
      rip,
      rippleStyle, 
      style = {opacity: 0.25, transform: "scale(0)"},
      time = {opacity: 2, transform: 1}
      );
    span.appendChild(ripple);
    function touch() {
      rippleStyle = rippleDOM(
        rip,
        rippleStyle, 
        {opacity: 0, transform: "scale(1)"},
        {opacity: 2, transform: 1}
        );
    }
    function remove () {
      if(ripple){
        span.removeChild(ripple);
        delete ripple;
      }
    }
    setTimeout(touch, 10);
    setTimeout(remove, 2000);
  }
}
function browserRedirect() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    return "phone";
  } else {
    return "pc";
  }
}

const touchBtns = document.getElementsByClassName('touch');
const webType = browserRedirect();
const clikeType = {};
clikeType.start = (webType === "phone")? 'touchstart': 'mousedown';
clikeType.end = (webType === "phone")? 'touchend': 'mouseup';
for (let i = 0; i < touchBtns.length; i++) {
  let btn = touchBtns[i];
  const span = btn.children[0].children[0];
  let rip = "";
  let ripple = "";
  btn.addEventListener(clikeType.start, function (ev) {
    ripple = document.createElement('div');
    let rippleStyle = ripple.style;
    rip = (webType === "phone")
    ?clickDOM(ev, this, 'touch')
    :clickDOM(ev, this, 'click');
    rippleStyle = rippleDOM(
      rip,
      rippleStyle, 
      style = {opacity: 0.25, transform: "scale(0)"},
      time = {opacity: 10, transform: 5}
      );
    span.appendChild(ripple);
    function touch() {
      rippleStyle = rippleDOM(
        rip,
        rippleStyle, 
        style = {opacity: 0.25, transform: "scale(1)"},
        time = {opacity: 10, transform: 5}
        ); 
    }
    function remove () {
      if(this.ripple){
        span.removeChild(span.lastElementChild);
        delete this.ripple;
      }
    }
          // touch();
          setTimeout(touch, 0);
          // setTimeout(remove, 10000);
        },false);
  btn.addEventListener(clikeType.end, function (ev) {
    let endRipple = span.firstElementChild;
    let rippleStyle = ripple.style;

    function move() {
      rippleStyle = rippleDOM(
        rip,
        rippleStyle, 
        style = {opacity: 0, transform: "scale(1.49)"},
        time = {opacity: 2, transform: 2}
        );
    }
    function remove () {
      if( endRipple.style.opacity === 0 )
        span.removeChild(endRipple);
    }
    setTimeout(move, 0);
    setTimeout(remove, 2000);
  },false);

}