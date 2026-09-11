const rootSelector = "[data-js-anchor-navigation]";

class AnchorNavigation {
  constructor(rootElem, expandableContentCollection) {
    this.rootElem = document.querySelector(rootSelector);
    this.expandableContentCollection = expandableContentCollection;

    this.bindEvents();
    this.handleInitialHash();
  }

  bindEvents() {
    this.rootElem.addEventListener("click", this.onAnchorClick);
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

    const expandableContent =
      this.expandableContentCollection.getByTarget(targetElem);

    if (!expandableContent) {
      return;
    }

    event.preventDefault();

    expandableContent.expandImmediately(() => {
      this.scrollToTarget(targetElem);
      history.pushState(null, "", targetId);
    });
  };

  handleInitialHash() {
    if (!window.location.hash) {
      return;
    }

    requestAnimationFrame(() => {
      const targetElem = document.querySelector(window.location.hash);

      if (!targetElem) {
        return;
      }

      const expandableContent =
        this.expandableContentCollection.getByTarget(targetElem);

      if (!expandableContent) {
        return;
      }

      expandableContent.expandImmediately(() => {
        this.scrollToTarget(targetElem);
      });
    });
  }

  scrollToTarget(targetElem) {
    targetElem.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

class AnchorNavigationCollection {
  constructor(expandableContentCollection) {
    this.expandableContentCollection = expandableContentCollection;

    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((elem) => {
      new AnchorNavigation(elem, this.expandableContentCollection);
    });
  }
}

export default AnchorNavigationCollection;
