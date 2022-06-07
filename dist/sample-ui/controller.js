/**
 * Created by selcukg on 6/15/17.
 */

(function(anvp) {

var parentElement, mediator, captionProps, fullscreenSupport,
    referenceCache = {};

var totalDuration, currentTime;

var recomVideoList = [], recomVideoImgURLs = {}, recomImgCacheCount = 0,
    recomCountDownSeconds = 10, recomRowCount = 2, recomColCount = 3,
    recomFrameCount = recomRowCount * recomColCount, recomTimers = {};

var log = function() {
  console.log.apply(
      console,
      ['[Controller]\t'].concat(Array.prototype.slice.call(arguments)));
};

function ControlBar() {
  anvp.ControlInterface.call(this);
  this.timers_ = {};
  this.notImplementedWarning_ = true;
  this.bitrateListElements_ = {};
  this.setResponsive_ = function() {
    getElementFromClassPath('control').setAttribute('data-state', 'responsive');
    getElementFromClassPath('control:bitrate:bitrate-checkbox').checked = false;
  }
}

ControlBar.prototype = Object.create(anvp.ControlInterface.prototype);
ControlBar.prototype.init = function(node, w, h) {
  getElementFromClassPath('control:play-pause').onclick = function() {
    mediator.publish('playPauseClicked');
  };
  getElementFromClassPath('control:fullscreen').onclick = function() {
    mediator.publish('fullscreenClicked');
  };
  getElementFromClassPath('control:timeline').onclick = function(e) {
    var result = getSeekIndex(e, this);
    mediator.publish('seekRequest', result.seekIndex, undefined, 'Control');
  };
  getElementFromClassPath('control:timeline').onmouseenter = function(e) {
    var result = getSeekIndex(e, this);
    mediator.publish('previewRequest', result.seekIndex, result.location);
  };
  getElementFromClassPath('control:timeline').onmousemove = function(e) {
    var result = getSeekIndex(e, this);
    mediator.publish('previewRequest', result.seekIndex, result.location);
  };
  getElementFromClassPath('control:timeline').onmouseleave = function(e) {
    mediator.publish('cancelPreviewRequest');
  };
};
ControlBar.prototype.updateDuration = function(index) {
  currentTime = index;
  getElementFromClassPath('control:timeline:progress').style.width =
      (currentTime * 100 / totalDuration) + '%';
  getElementFromClassPath('control:current-time').innerText =
      sec2TimeString(Math.round(currentTime));
  if (currentTime) {
    show(getElementFromClassPath('control:time'));
  }
};
ControlBar.prototype.setDuration = function(duration) {
  currentTime = 0;
  totalDuration = duration;
  hide(getElementFromClassPath('control:time'));
  getElementFromClassPath('control:total-duration').innerText =
      sec2TimeString(Math.round(totalDuration));
};
ControlBar.prototype.setVisibilityMode = function(mode) {
  getElementFromClassPath('control').setAttribute('data-state', mode);
};
ControlBar.prototype.showTemporarily = function() {
  getElementFromClassPath('control').setAttribute('data-state', 'visible');
  if (this.timers_.setResponsive) {
    clearTimeout(this.timers_.setResponsive);
    delete this.timers_.setResponsive;
  }
  this.timers_.setResponsive = setTimeout(this.setResponsive_, 3000);
};
ControlBar.prototype.setPaused = function(flag) {
  getElementFromClassPath('control:play-pause')
      .setAttribute('data-state', flag ? 'paused' : 'playing');
  if (flag) {  // overriding default hidden mode of control bar for paused state
               // (async)
    setTimeout(this.setVisibilityMode.bind(this, 'visible'), 100);
    if (this.timers_.setResponsive) {
      clearTimeout(this.timers_.setResponsive);
      delete this.timers_.setResponsive;
    }
  }
};
ControlBar.prototype.setFullscreen = function(flag) {
  getElementFromClassPath('control:fullscreen')
      .setAttribute('data-state', flag ? 'on' : 'off');
};
ControlBar.prototype.setLive = function(flag) {
  var fn = flag ? hide : show;
  fn(getElementFromClassPath('control:timeline'));
  getElementFromClassPath('control:time')
      .setAttribute('data-state', flag ? 'live' : 'vod');
};
ControlBar.prototype.destroy = function() {
  clearTimers(this.timers);
};

function onBitrateSelected() {
  var renditionList = getElementFromClassPath('control:bitrate:rendition-list');
  renditionList.setAttribute('data-auto-bitrate', this.value == 'auto');
  mediator.publish('bitrateSelected', this.value);
}


function invertObjectKeysAndValues(obj, adaptor) {
  var inverted = {};
  var keys = Object.keys(obj);
  keys.forEach(function(key) {
    var value = obj[key];
    if (typeof adaptor == 'function') {
      var adapted = adaptor(key, value);
      key = adapted.key;
      value = adapted.value;
    }
    // Inserts inverted k-v pair into inverted object
    if (!(value in inverted)) {
      inverted[value] = key;
    } else {
      // Turn the value in the inverted object into an array if a value
      // already exists but it's not an array yet
      if (inverted[value].constructor !== Array) {
        inverted[value] = [inverted[value]];
      }
      inverted[value] = inverted[value].concat(key);
    }
  });
  return inverted;
}


ControlBar.prototype.setAvailableBitrates = function(
    bitrateList, selectedBitrate, customLabelsFromEventHook,
    bitrateToResolutionMapping) {
  var renditionList = getElementFromClassPath('control:bitrate:rendition-list');
  var renditionButton;
  var resolutionToBitrateMapping = {};
  var renditionInput;
  var renditionLabel;
  renditionList.innerHTML = '';
  renditionList.setAttribute('data-auto-bitrate', selectedBitrate == 'auto');
  // There are 3 options for populating the bitrate menu
  // 1. default: using bitratelist and representing in bitrates in kbps
  // 2. using the bitrateToResolutionMapping mapping and presenting with picture
  // height
  // 3. using the custom mapping set with beforeBitrateUpdated hook
  if (customLabelsFromEventHook &&
      Object.keys(customLabelsFromEventHook)
          .length) {  // option#3 using the custom mapping set with event hook
    resolutionToBitrateMapping =
        invertObjectKeysAndValues(customLabelsFromEventHook);
  } else if (
      bitrateToResolutionMapping &&
      Object.keys(bitrateToResolutionMapping).length) {  // option #2
    resolutionToBitrateMapping = invertObjectKeysAndValues(
        bitrateToResolutionMapping, function(key, value) {
          var pictureSizeParts = value.split('x');
          if (pictureSizeParts.length != 2) {
            return {
              key: key,
              value: value,
            };
          }
          var pictureHeight = pictureSizeParts[1] + 'p';
          return {
            key: key, value: pictureHeight,
          }
        });
  }
  if (!Object.keys(resolutionToBitrateMapping)
           .length) {  // option#1 using bitrateList
    resolutionToBitrateMapping =
        invertObjectKeysAndValues(bitrateList, function(index, value) {
          return {
            key: value,
            value: value + 'kbps',
          };
        });
  }

  resolutionToBitrateMapping.auto = 'auto';
  for (var label in resolutionToBitrateMapping) {
    if (!resolutionToBitrateMapping.hasOwnProperty(label)) {
      continue;
    }
    renditionButton =
        generateChild(renditionList, 'li', null, 'rendition-button');
    renditionInput =
        generateChild(renditionButton, 'input', null, 'rendition-button-radio');
    renditionInput.id = label;
    renditionInput.name = 'resolution';
    renditionInput.onchange = onBitrateSelected;
    if (resolutionToBitrateMapping[label].constructor === Array) {
      renditionInput.value =
          resolutionToBitrateMapping[label].reduce(function(a, b) {
            return Math.max(parseInt(a), parseInt(b));
          });
      var context = this;
      resolutionToBitrateMapping[label].forEach(function(presentationLabel) {
        context.bitrateListElements_[presentationLabel] = renditionButton;
      });
    } else {
      renditionInput.value = resolutionToBitrateMapping[label];
      this.bitrateListElements_[resolutionToBitrateMapping[label]] =
          renditionButton;
    }
    renditionInput.type = 'radio';
    renditionLabel =
        generateChild(renditionButton, 'label', null, 'rendition-button-label');
    renditionLabel.className = label;
    renditionLabel.htmlFor = label;
    renditionLabel.innerText = label;
  }
};

ControlBar.prototype.onBitrateChanged = function(bitrate) {
  var renditionButton = this.bitrateListElements_[bitrate];
  if (renditionButton) {
    var input = renditionButton.querySelector('input');
    input.checked = true;
    var label = renditionButton.querySelector('label');
    label.setAttribute('data-switch-pending', false);
  }
};

ControlBar.prototype.onBitrateChangeInProgress = function(bitrate) {
  var renditionButton = this.bitrateListElements_[bitrate];
  if (renditionButton) {
    var label = renditionButton.querySelector('label');
    label.setAttribute('data-switch-pending', true);
  }
};

function Splash() {
  anvp.SplashInterface.call(this);
  this.notImplementedWarning_ = true;
}

Splash.prototype = Object.create(anvp.SplashInterface.prototype);
Splash.prototype.init = function() {
  getElementFromClassPath('splash:play').onclick = function() {
    mediator.publish('playRequest', true);
  };
};
Splash.prototype.show = function(splashMode, playerMode, img, remaining) {
  var splash = getElementFromClassPath('splash');
  splash.setAttribute('data-mode', splashMode);
  show(splash);
  mediator.publish('splashModeUpdated', splashMode);
  if (img) {
    cacheImages([img], function() {
      getElementFromClassPath('splash').style.background =
          'url(' + img + ') center center / 100% no-repeat';
    });
  } else {
    getElementFromClassPath('splash').style.background = 'none';
  }
};
Splash.prototype.setInfo = function(title, description) {
  getElementFromClassPath('splash:title').innerText = title;
  getElementFromClassPath('splash:description').innerText = description || '';
};
Splash.prototype.resetInfo = function() {};
Splash.prototype.hide = function() {
  hide(getElementFromClassPath('splash'));
};
Splash.prototype.buffering = function(on) {
  getElementFromClassPath('custom-ui')
      .setAttribute('data-buffering', on ? 'on' : 'off');
};

function Recommendation() {
  anvp.RecommendationInterface.call(this);
  this.notImplementedWarning_ = true;
}

Recommendation.prototype =
    Object.create(anvp.RecommendationInterface.prototype);
Recommendation.prototype.init = function() {
  // populate HTML for recommendation frames
  generateGrid();
  // attach onclick event handlers
  for (var frameId = 0; frameId < recomFrameCount; frameId++) {
    var frame = getElementFromClassPath('recommendation:frame' + frameId);
    frame.onclick = onFrameClick(frameId);
  }
  getElementFromClassPath('recommendation:cancel').onclick = function() {
    clearTimers(recomTimers);
    hide(getElementFromClassPath('recommendation:up-next'));
    show(getElementFromClassPath('recommendation:grid'));
  };
  getElementFromClassPath('recommendation:play').onclick = function() {
    clearTimers(recomTimers);
    selectNextVideo(0);
  };
  getElementFromClassPath('recommendation:replay').onclick = function() {
    clearTimers(recomTimers);
    mediator.publish('playRequest', true);
    hideRecommendations();
  };
};
Recommendation.prototype.setRecommendations = function(vList, countDownTime) {
  recomVideoList = vList || [];
  recomVideoImgURLs = {};
  recomImgCacheCount = 0;
  recomCountDownSeconds =
      (typeof countDownTime != 'undefined' ? countDownTime :
                                             recomCountDownSeconds);
  if (!recomVideoList.length) {
    return false;
  }
  var urlList = [];

  // set the frame video metadata and hide unused frames
  for (var idx = 0; idx < recomFrameCount; idx++) {
    var framePath = 'recommendation:frame' + idx;
    var frame = getElementFromClassPath(framePath);
    if (idx < recomVideoList.length) {
      var video = recomVideoList[idx];
      setInnerHTML(getElementFromClassPath(framePath + ':name'), video.title);
      setInnerHTML(
          getElementFromClassPath(framePath + ':duration'),
          sec2TimeString(video.duration));
      // keep list of frame indexes for each url in case multiple frames use
      // the same image url
      var idxList = recomVideoImgURLs[video.image];
      if (idxList) {
        idxList.push(idx);
      } else {
        recomVideoImgURLs[video.image] = [idx];
        urlList.push(video.image);
        recomImgCacheCount++;
      }
      show(frame);
    } else {
      hide(frame);
    }
  }
  mediator.publish('loadingRecommendations');
  // load all of the thumbnails images for the recommendations
  cacheImages(urlList, function(img) {
    recomImgCacheCount--;
    if (!img.src) return;
    var idxList = recomVideoImgURLs[img.src];
    for (var i = 0; i < idxList.length; i++) {
      var thumbnailPath = 'recommendation:frame' + idxList[i] + ':thumbnail';
      getElementFromClassPath(thumbnailPath).src = img.src;
      if (idxList[i] === 0) {
        getElementFromClassPath('recommendation:up-next')
            .style.backgroundImage = 'url(' + img.src + ')';
      }
    }
    // check if all thumbnail images have been loaded
    if (recomImgCacheCount === 0) {
      mediator.publish('recommendationsReady');
    }
  });
  return true;
};
Recommendation.prototype.show = function(title) {
  if (!recomVideoList.length) return;
  var video = recomVideoList[0];
  getElementFromClassPath('recommendation:title').innerText =
      'Up Next: ' + (video.title || '');
  show(getElementFromClassPath('recommendation:up-next'));
  hide(getElementFromClassPath('recommendation:grid'));
  show(getElementFromClassPath('recommendation'));
  countDown(recomCountDownSeconds);
};
Recommendation.prototype.hide = hideRecommendations;
Recommendation.prototype.rescale = function(width) {};
// private helper methods for Recommendation interface.
function countDown(seconds) {
  if (seconds) {
    var countDownText = getElementFromClassPath('recommendation:count-down');
    countDownText.innerText = 'Playing in ' + seconds + ' seconds';
    recomTimers.countDown = setTimeout(function() {
      countDown(--seconds);
    }, 1000);
  } else {
    clearTimers(recomTimers);
    hide(getElementFromClassPath('recommendation'));
    selectNextVideo(0);
  }
}
function generateGrid() {
  var rows = getElementFromClassPath('recommendation:rows');
  for (var rowNum = 0; rowNum < recomRowCount; rowNum++) {
    var row = generateChild(rows, 'div', null, 'row');
    for (var colNum = 0; colNum < recomColCount; colNum++) {
      var frameId = rowNum * recomColCount + colNum;
      var frame =
          generateChild(row, 'div', null, 'item clickable frame' + frameId);
      frame.setAttribute('data-display', 'inline-block');
      generateChild(frame, 'div', null, 'name');
      generateChild(frame, 'div', null, 'duration');
      generateChild(frame, 'img', null, 'thumbnail');
    }
  }
}
function hideRecommendations() {
  clearTimers(recomTimers);
  hide(getElementFromClassPath('recommendation'));
}
function onFrameClick(id) {
  return function() {
    selectNextVideo(id);
  };
}
function selectNextVideo(idx) {
  var nextVideo = recomVideoList[idx];
  mediator.publish('recommendationSelected', nextVideo);
  hideRecommendations();
}

function Preview() {
  anvp.PreviewInterface.call(this);
  this.notImplementedWarning_ = true;
}

Preview.prototype = Object.create(anvp.PreviewInterface.prototype);

Preview.prototype.init = function() {
  this.enabled_ = false;
  this.allImagesLoaded_ = false;
  this.elements_ = {
    container: getElementFromClassPath('preview'),
    image: getElementFromClassPath('preview:image'),
  };
};
Preview.prototype.reset = function() {
  this.enabled_ = false;
  this.allImagesLoaded_ = false;
  this.elements_.container.visibility = 'hidden';
};
Preview.prototype.loadPreviewMatrices = function(previewInfo) {
  this.enabled_ = true;
  this.config_ = buildConfig(previewInfo);
  function onLoaded() {
    this.allImagesLoaded_ = true;
  }
  loadImages(previewInfo.pvw_matrices, onLoaded.bind(this));
};
function buildConfig(previewInfo) {
  var total = previewInfo.previews.n;
  var duration = parseFloat(previewInfo.duration) / total;
  var matrixUrls = previewInfo.pvw_matrices;
  var primaryMatrixCount = Math.ceil(total / 25);
  var secondaryMatrixCount = Math.ceil(total / 100);
  var totalMatrixCount = primaryMatrixCount + secondaryMatrixCount;
  return {
    preview: {total: total, duration: duration},
    primary: {
      urls: matrixUrls && matrixUrls.length ?
          matrixUrls.slice(0, primaryMatrixCount) :
          undefined,
      width: previewInfo.previews.twp,
      height: previewInfo.previews.thp,
      rows: 5,
      columns: 5,
      frames: 25,
    },
    secondary: {
      urls: matrixUrls && matrixUrls.length ?
          matrixUrls.slice(primaryMatrixCount, totalMatrixCount) :
          undefined,
      width: previewInfo.previews.tws,
      height: previewInfo.previews.ths,
      rows: 10,
      columns: 10,
      frames: 100,
    },
  };
}
function loadImages(images, onCompleted) {
  var loaded = 0;
  var total = images.length;
  function onLoaded() {
    if (++loaded === total) {
      onCompleted();
    }
  }
  for (var i = 0; i < total; i++) {
    var img = new Image();
    img.src = images[i].url;
    img.addEventListener('load', onLoaded);
  }
}
Preview.prototype.show = function(timeIndex, referenceInfo) {
  if (!this.enabled_) return;
  var config = this.config_;
  var image = this.elements_.image;
  var container = this.elements_.container;
  var preview = this.getFrameInfo(timeIndex, false);
  image.style.backgroundImage = 'url(' + preview.url + ')';
  image.style.backgroundPosition = preview.left + 'px ' + preview.top + 'px';
  image.style.width = config.primary.width + 'px';
  image.style.height = config.primary.height + 'px';
  container.style.left = Math.min(
      Math.max(referenceInfo.x - config.primary.width / 2, referenceInfo.left),
      referenceInfo.right - config.primary.width);
  container.style.bottom = config.primary.height + 12 + 'px';
  container.style.visibility = 'visible';
};
Preview.prototype.hide = function() {
  this.elements_.container.style.visibility = 'hidden';
};
Preview.prototype.loadedAll = function() {
  return this.allImagesLoaded_;
};
Preview.prototype.getFrameInfo = function(timeIndex, isSecondary) {
  var dimensions = isSecondary ? this.config_.secondary : this.config_.primary;
  var index = Math.floor(timeIndex / this.config_.preview.duration);
  var frame = Math.floor(index / dimensions.frames);
  var url = dimensions.urls ? dimensions.urls[frame].url : '';
  var indexInFrame = index % dimensions.frames;
  var x = indexInFrame % dimensions.rows;
  var y = Math.floor(indexInFrame / dimensions.rows);
  var top = -y * dimensions.height;
  var left = -x * dimensions.width;
  return {url: url, top: top, left: left};
};
Preview.prototype.getWidthAndHeight = function(isSecondary) {
  var dimensions = isSecondary ? this.config_.secondary : this.config_.primary;
  return {width: dimensions.width, height: dimensions.height};
};

function CustomUI() {
  anvp.AnvatoCustomUIInterface.call(this);

  function init_() {
    parentElement = anvp.AnvatoCustomUIInterface.container;
    mediator = anvp.AnvatoCustomUIInterface.mediator;
    captionProps = anvp.AnvatoCustomUIInterface.staticData.captionProps;
    fullscreenSupport =
        anvp.AnvatoCustomUIInterface.staticData.fullscreenSupport;
  }

  this.readyCallback = function() {
    init_();
    parentElement.style.display = 'block';
  };
  this.control = ControlBar;
  this.splash = Splash;
  this.recommendation = Recommendation;
  this.preview = Preview;
}

new CustomUI();


// some useful utilities
function getElementFromClassPath(path) {
  var parts;
  var part;
  var references;
  var reference = null;
  if (path in referenceCache) {
    return referenceCache[path];
  } else {
    parts = typeof path === 'string' && path.split(':') || [];
    for (var i = 0, len = parts.length; i < len; i++) {
      part = parts[i];
      reference = reference || document;
      references = reference.querySelector('.' + part);
      if (references.length) {
        reference = references[0];
      } else if (references) {
        reference = references;
      } else {
        return null;
      }
    }
    references[path] = reference;
    return reference;
  }
}

function sec2TimeString(sec) {
  if (isNaN(sec)) return '';
  var hour = '';
  var min = parseInt((sec / 60), 10);
  sec = parseInt((sec % 60), 10);
  if (min >= 60) {
    hour = parseInt((min / 60), 10);
    min = parseInt((min % 60), 10);
    if (hour < 10) {
      hour = '0' + hour;
    }
    hour += ':';
  }
  if (sec < 10) {
    sec = '0' + sec;
  }
  if (min < 10) {
    min = '0' + min;
  }
  return hour + min + ':' + sec;
}

function cacheImages(imageArray, onLoadFn, onErrorFn) {
  var i = 0, len = imageArray.length, images = [];
  for (; i < len; i++) {
    images[i] = new Image();
    addEventListener(images[i], 'load', function() {
      onLoadFn(this);
    }, false);
    if (onErrorFn) {
      addEventListener(images[i], 'error', function() {
        onErrorFn(this);
      }, false);
    }
    if (imageArray[i]) {
      images[i].src = imageArray[i];
    } else {
      onLoadFn(images[i]);
    }
  }
}

function addEventListener(node, eventName, eventListener, useCapture) {
  // W3C model
  if (node.addEventListener) {
    useCapture = typeof useCapture !== 'undefined' ? useCapture : false;
    node.addEventListener(eventName, eventListener, useCapture);
  }
  // Microsoft model
  else {
    node.attachEvent('on' + eventName, eventListener);
  }
}

function getSeekIndex(e, owner) {
  var x, trueOffset, seekIndex, location = {}, ownerWidth;
  if (e.type == 'touchmove' || e.type == 'touchstart' || e.type == 'touchend') {
    var touchObj = e.changedTouches[0];
    x = touchObj.clientX;
  } else {
    x = e.clientX;
  }
  trueOffset = getCumulativeOffset(owner);
  ownerWidth = owner.clientWidth;
  x -= trueOffset.x;
  x = x < 0 ? 0 : x;
  x = x > ownerWidth ? ownerWidth : x;
  seekIndex = (totalDuration * x) / ownerWidth;
  // Needed for preview request
  location.left = owner.clientLeft;
  location.right = location.left + owner.clientWidth;
  location.top = owner.clientTop;
  location.x = x + location.left;

  return {seekIndex: seekIndex, location: location};
}


function getCumulativeOffset(obj) {
  var left, top, boundingClientRect;
  left = top = 0;
  if (window.self !== window.top && obj.offsetWidth < obj.clientWidth &&
      obj.getBoundingClientRect().width < 100) {
    boundingClientRect = obj.getBoundingClientRect();
    top = boundingClientRect.top * 100;
    left = boundingClientRect.left * 100;
  } else {
    if (obj.offsetParent) {
      do {
        left += obj.offsetLeft;
        top += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
  }
  return {x: left, y: top};
}

function hide(element) {
  if (element.style.display != 'none') {
    element.setAttribute('data-display', element.style.display);
  }
  element.style.display = 'none';
}

function show(element) {
  element.style.display = element.getAttribute('data-display') || 'block';
}

function setInnerHTML(node, content) {
  if (content) {
    node.innerText = content;
    show(node);
  } else {
    hide(node);
  }
}

function generateChild(parent, type, id, className, content) {
  var child, classList, i;
  child = document.createElement(type);
  if (id) child.id = parent.id + '-' + id;
  if (className) child.className = className;
  if (content) child.innerText = content;
  parent.appendChild(child);
  return child;
}

function clearTimers(timers) {
  for (var t in timers) {
    if (timers.hasOwnProperty(t)) {
      clearTimeout(timers[t]);
      delete timers[t];
    }
  }
}

})(window.anvp);
