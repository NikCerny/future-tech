const rootSelector = "[data-js-expandable-content]";

class ExpandableContent {
  selectors = {
    root: rootSelector,
    button: "[data-js-expandable-content-button]",
  };

  stateClasses = {
    isExpanded: "is-expanded",
  };

  animationParams = {
    duration: 500,
    easing: "ease",
  };

  constructor(rootElem) {
    this.rootElem = rootElem;
    this.buttonElem = this.rootElem.querySelector(this.selectors.button);

    this.bindEvents();
  }

  bindEvents() {
    this.buttonElem.addEventListener("click", this.onButtonClick);
  }

  onButtonClick = () => {
    this.expand();
  };

  expand = (onComplete) => {
    if (this.rootElem.classList.contains(this.stateClasses.isExpanded)) {
      onComplete?.();
      return;
    }

    const startHeight = this.rootElem.offsetHeight;
    const endHeight = this.rootElem.scrollHeight;

    this.rootElem.classList.add(this.stateClasses.isExpanded);

    const animation = this.rootElem.animate(
      [{ maxHeight: `${startHeight}px` }, { maxHeight: `${endHeight}px` }],
      this.animationParams,
    );

    animation.onfinish = () => {
      onComplete?.();
    };
  };

  expandImmediately = (onComplete) => {
    if (this.rootElem.classList.contains(this.stateClasses.isExpanded)) {
      onComplete?.();
      return;
    }

    this.rootElem.classList.add(this.stateClasses.isExpanded);

    onComplete?.();
  };
}

class ExpandableContentCollection {
  constructor() {
    this.expandableContents = new Map();

    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((elem) => {
      this.expandableContents.set(elem, new ExpandableContent(elem));
    });
  }

  getByTarget(targetElem) {
    const rootElem = targetElem.closest(rootSelector);

    return rootElem ? this.expandableContents.get(rootElem) : null;
  }
}
export default ExpandableContentCollection;
