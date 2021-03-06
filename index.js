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
function getSeat(e){ 
  var offsetTop=e.offsetTop; 
  if(e.offsetParent!=null) offsetTop+=getSeat(e.offsetParent).offsetTop; 
  var offsetLeft=e.offsetLeft; 
  if(e.offsetParent!=null) offsetLeft+=getSeat(e.offsetParent).offsetLeft; 
  return {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft,
  };
} 
function clickDOM(ev, doc, type) {
  const docSeat = getSeat(doc);
  const tMax = doc.offsetWidth > doc.offsetHeight
  ?doc.offsetWidth
  :doc.offsetHeight;
  const event = eventOrdinate(ev, type);
  const mLeft = event.eventX - docSeat.offsetLeft;
  const mTop = event.eventY - docSeat.offsetTop;
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
function rippleDOM(rip, ripplestyle, style ,time) {
  let rippleStyle = ripplestyle;
  rippleStyle.opacity = style.opacity;
  rippleStyle.transform = style.transform;
  rippleStyle.position = "absolute"; 
  if(rip){
    rippleStyle.top = rip.radius.top + "px"; 
    rippleStyle.left = rip.radius.left + "px";
    rippleStyle.height = rip.diameter + "px"; 
    rippleStyle.width = rip.diameter + "px"; 
  }
  rippleStyle.borderRadius = "50%"; 
  rippleStyle.backgroundColor = "#ffffff"; 
  rippleStyle.transition = "opacity "+ time.opacity +"s cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform "+ time.transform +"s cubic-bezier(0.23, 1, 0.32, 1) 0ms";
  return rippleStyle;
}
function btnOnclick(ev) {
  console.log(this.window);
  const span = this.children[0].children[0];
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
  setTimeout(touch, 0);
  setTimeout(remove, 2000);
}
const clickBtns = document.getElementsByClassName('click');
for (let i = 0; i < clickBtns.length; i++) {
  let btn = clickBtns[i];
  btn.addEventListener('click',btnOnclick);
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
  btn.addEventListener(clikeType.start, function (ev) {
    if (rip !=="") return ;
    let ripple = document.createElement('div');
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
    setTimeout(touch, 0);
  },false);
  btn.addEventListener(clikeType.end, function (ev) {
    let endRipple = span.lastElementChild;
    let rippleStyle = endRipple.style;
    function move() {
      rippleStyle = rippleDOM(
        rip,
        rippleStyle, 
        style = {opacity: 0, transform: "scale(1.49)"},
        time = {opacity: 2, transform: 2}
      );
      rip = "";
    }
    function remove () {
      span.removeChild(endRipple);
    }
    move();
    setTimeout(move, 0);
    setTimeout(remove, 2000);
  },false);
}
const tag = document.getElementById('tag');
function comment(top, left, dom) {
  if( dom.lastElementChild.className == false){
    const commentBefore = document.createElement('div');
    commentDOM = document.createElement('div');
    const commentAfter = document.createElement('div');
    commentBefore.className = "commentBefore";
    commentDOM.className = "comment";
    commentDOM.style.top = top + 'px';
    commentAfter.className = "commentAfter";
    commentAfter.style.left = left + 'px';
    commentDOM.appendChild(commentBefore);
    commentDOM.appendChild(commentAfter);
    dom.appendChild(commentDOM);
  } else {
    commentDOM = dom.lastElementChild;
    commentDOM.className = "comment";
  }
  return dom;
}
function tagClick(event) {
  const median = this.offsetWidth / 2 -10;
  const top = this.offsetHeight + 15;
  const dom = comment(top, median, this);
  this.className = "btn-focus";
  this.removeEventListener ('click', tagClick);
  this.removeEventListener ('click', btnOnclick);
  this.addEventListener('blur',tagOnblur, false);
}
function tagOnblur() {
  this.className = "btn";
  this.lastElementChild.className = "comment-leave";
  this.addEventListener('click', btnOnclick);
  this.addEventListener('click', tagClick);
}
tag.addEventListener('click', tagClick, false);
