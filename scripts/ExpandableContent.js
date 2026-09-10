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
}

class ExpandableContentCollection {
  constructor() {
    this.expandableContents = new Map();

    this.init();
    this.bindAnchorEvents();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((elem) => {
      const expandableContent = new ExpandableContent(elem);

      this.expandableContents.set(elem, expandableContent);
    });
  }

  bindAnchorEvents() {
    document.addEventListener("click", this.onAnchorClick);
  }

  onAnchorClick = (event) => {
    const anchor = event.target.closest('a[href^="#"]');

    if (!anchor) {
      return;
    }

    const targetId = anchor.getAttribute("href");
    const targetElem = document.querySelector(targetId);

    if (!targetElem) {
      return;
    }

    const expandableRoot = targetElem.closest(rootSelector);

    if (!expandableRoot) {
      return;
    }

    const expandableContent = this.expandableContents.get(expandableRoot);

    if (!expandableContent) {
      return;
    }

    event.preventDefault();

    expandableContent.expand(() => {
      targetElem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      history.pushState(null, "", targetId);
    });
  };
}

export default ExpandableContentCollection;
