module.exports = Animation;

var options = {
  /**
   * 10 pixels per second
   */
  speed: 10,

  /**
   * 60 frames per second
   */
  fps: 60,

  duration: 0
}

var set = {}

var animations = [];

function Animation(options) {
  this.el;
  this.fps;
  this.duration;
  this.transforms;
  animations.push(this);

  for (var key in options) {
    this[key] = options[key];
  }

  var animation = this;
  var detail = getDetail(this.el, this.transforms);
  var startTime = new Date;

  function step() {
    // console.log('step')
    var property;
    var change;
    var passedTime = new Date - startTime;
    var ratio = passedTime / animation.duration;

    if (ratio > 1) {
      ratio = 1;
    }

    for (property in animation.transforms) {
      change = detail[property].change * ratio;
      animation.el.style[property] = change + detail[property].from + detail[property].unit;
    }

    if (ratio >= 1) {
      animation.stop();
    }
  }

  this.id = setInterval(step, 1000 / animation.fps);
}

function getStyle(el, name) {
  return el.style[name] || document.defaultView.getComputedStyle(el, null)[name];
}

function getNumber(str) {
  return str.replace(/[^-\d\.]/g, '');
}

function getDetail(el, transforms) {
  var detail = {};
  var property;

  for (property in transforms) {
    var value = transforms[property].toString();
    var unit = value.match(/[a-zA-Z%]+$/);

    detail[property] = {
      from: parseFloat(getNumber(getStyle(el, property))),
      to: parseFloat(getNumber(value)),
      unit: unit === null ? '' : unit.shift()
    }

    detail[property]['change'] = detail[property].to - detail[property].from;
  }

  return detail;
}

Animation.prototype.stop = function () {
  if (this.id) {
    var i;

    clearInterval(this.id);
    this.id = null;
    // this.trigger('stop');

    for (i = 0; i < animations.length; i++) {
      if (animations[i] === this) {
        animations.splice(i, 1);
      }
    }
  }
}

Animation.animate = function (el, transforms, duration) {
  var opts = Object.create(options);

  opts.el = el;
  opts.transforms = transforms;
  opts.duration = duration;

  return new Animation(opts);
}

Animation.stop = function () {
  var animationsOrder = animations.slice();

  if (animationsOrder.length) {
    animationsOrder.forEach(function (animation) {
      animation.stop();
    });
  }
}

Animation.set = function (name, value) {
  if (set[name]) {
    set[name](value);
  } else {
    options[name] = value;
  }
}
