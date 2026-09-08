const rootSelector = "[data-js-video-player]";

class VideoPlayer {
  selectors = {
    root: rootSelector,
    video: "[data-js-video-player-video]",
    panel: "[data-js-video-player-panel]",
    playButton: "[data-js-video-player-play-button]",
  };

  stateClasses = {
    isActive: "is-active",
    isPlaying: "is-playing",
  };

  constructor(rootElem) {
    this.rootElem = rootElem;
    this.videoElem = this.rootElem.querySelector(this.selectors.video);
    this.panelElem = this.rootElem.querySelector(this.selectors.panel);
    this.playButtonElem = this.rootElem.querySelector(
      this.selectors.playButton,
    );
    this.bindEvents();
  }

  bindEvents() {
    this.playButtonElem.addEventListener("click", this.onPlayButtonClick);
    this.videoElem.addEventListener("pause", this.onVideoPause);
    this.videoElem.addEventListener("ended", this.onVideoEnded);
  }

  onPlayButtonClick = () => {
    this.videoElem.play();
    this.videoElem.controls = true;
    this.panelElem.classList.remove(this.stateClasses.isActive);
    this.rootElem.classList.add(this.stateClasses.isPlaying);
  };

  onVideoPause = () => {
    if (this.videoElem.seeking) {
      return;
    }
    this.videoElem.controls = false;
    this.panelElem.classList.add(this.stateClasses.isActive);
    this.rootElem.classList.remove(this.stateClasses.isPlaying);
  };

  onVideoEnded = () => {
    this.videoElem.controls = false;
    this.panelElem.classList.add(this.stateClasses.isActive);
    this.rootElem.classList.remove(this.stateClasses.isPlaying);
    this.videoElem.load();
  };
}

class VideoPlayerCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((elem) => {
      new VideoPlayer(elem);
    });
  }
}

export default VideoPlayerCollection;
