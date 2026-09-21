// import MatchMedia from './MatchMedia.js'
import phoneCountries from "./phoneCountries.js";

const rootSelector = "[data-js-select]";

class Select {
  selectors = {
    root: rootSelector,
    control: "[data-js-select-control]",
    button: "[data-js-select-button]",
    dropdown: "[data-js-select-dropdown]",
    option: "[data-js-select-option]",
  };

  stateClasses = {
    isExpanded: "is-expanded",
    isSelected: "is-selected",
    isCurrent: "is-current",
    isOnTheLeftSide: "is-left-sided",
    isOnTheRightSide: "is-right-sided",
  };

  stateAttributes = {
    ariaExpanded: "aria-expanded",
    ariaSelected: "aria-selected",
    ariaActiveDescendant: "aria-activedescendant",
  };

  initialState = {
    isExpanded: false,
    currentOptionIndex: null,
    selectedOptionElement: null,
  };

  constructor(rootElement, options) {
    this.rootElement = rootElement;

    this.originalControlElement = this.rootElement.querySelector(
      this.selectors.control,
    );

    this.buttonElement = this.rootElement.querySelector(this.selectors.button);

    this.dropdownElement = this.rootElement.querySelector(
      this.selectors.dropdown,
    );

    this.createOptions(options);

    this.optionElements = this.dropdownElement.querySelectorAll(
      this.selectors.option,
    );

    this.state = {
      ...this.initialState,
      currentOptionIndex: this.originalControlElement.selectedIndex,
      selectedOptionElement:
        this.optionElements[this.originalControlElement.selectedIndex],
    };

    this.updateUI();
    this.fixDropdownPosition();
    // this.updateTabIndexes()
    this.bindEvents();
  }

  updateUI() {
    const { isExpanded, currentOptionIndex, selectedOptionElement } =
      this.state;

    const newSelectedOptionValue = selectedOptionElement.textContent.trim();

    const updateOriginalControl = () => {
      this.originalControlElement.value = newSelectedOptionValue;
    };

    const updateButton = () => {
      this.buttonElement.textContent = newSelectedOptionValue;
      this.buttonElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded,
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaExpanded,
        isExpanded,
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id,
      );
    };

    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded,
      );
    };

    const updateOptions = () => {
      this.optionElements.forEach((optionElement, index) => {
        const isCurrent = currentOptionIndex === index;
        const isSelected = selectedOptionElement === optionElement;

        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
        optionElement.classList.toggle(
          this.stateClasses.isSelected,
          isSelected,
        );
        optionElement.setAttribute(
          this.stateAttributes.ariaSelected,
          isSelected,
        );
      });
    };

    updateOriginalControl();
    updateButton();
    updateDropdown();
    updateOptions();
  }

  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
    this.updateUI();
  }

  expand() {
    this.state.isExpanded = true;
  }

  collapse() {
    this.state.isExpanded = false;
  }

  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth;
    const halfViewportX = viewportWidth / 2;
    const { width, x } = this.buttonElement.getBoundingClientRect();
    const buttonCenterX = x + width / 2;
    const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX;

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isButtonOnTheLeftViewportSide,
    );

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isButtonOnTheLeftViewportSide,
    );
  }

  //   updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
  //     this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1
  //     this.buttonElement.tabIndex = isMobileDevice ? -1 : 0
  //   }

  get isNeedToExpand() {
    const isButtonFocused = document.activeElement === this.buttonElement;

    return !this.state.isExpanded && isButtonFocused;
  }

  selectCurrentOption() {
    this.state.selectedOptionElement =
      this.optionElements[this.state.currentOptionIndex];
  }

  onButtonClick = () => {
    this.toggleExpandedState();
  };

  onClick = (event) => {
    const { target } = event;

    const isButtonClick = target === this.buttonElement;
    const isOutsideDropdownClick =
      target.closest(this.selectors.dropdown) !== this.dropdownElement;

    if (!isButtonClick && isOutsideDropdownClick) {
      this.collapse();
      return;
    }

    const isOptionClick = target.matches(this.selectors.option);

    if (isOptionClick) {
      this.state.selectedOptionElement = target;
      this.state.currentOptionIndex = [...this.optionElements].findIndex(
        (optionElement) => optionElement === target,
      );
      this.collapse();
      this.updateUI();
      this.notifyChange();
    }
  };

  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      this.updateUI();
      return;
    }

    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
      this.updateUI();
    }
  };

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      this.updateUI();
      return;
    }

    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
      this.updateUI();
    }
  };

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      this.updateUI();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
    this.updateUI();
    this.notifyChange();
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      this.updateUI();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
    this.updateUI();
    this.notifyChange();
  };

  onKeyDown = (event) => {
    const { code } = event;

    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown,
    }[code];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches);
  };

  onOriginalControlChange = () => {
    this.state.selectedOptionElement =
      this.optionElements[this.originalControlElement.selectedIndex];
    this.updateUI();
  };

  bindEvents() {
    // MatchMedia.mobile.addEventListener("change", this.onMobileMatchMediaChange);
    this.buttonElement.addEventListener("click", this.onButtonClick);
    document.addEventListener("click", this.onClick);
    this.rootElement.addEventListener("keydown", this.onKeyDown);
    this.originalControlElement.addEventListener(
      "change",
      this.onOriginalControlChange,
    );
  }

  createOptions(options) {
    options.forEach(({ dialCode }, index) => {
      const originalOption = document.createElement("option");

      originalOption.value = dialCode;
      originalOption.textContent = dialCode;

      this.originalControlElement.append(originalOption);

      const customOption = document.createElement("div");

      customOption.className = "select__option";
      customOption.textContent = dialCode;
      customOption.setAttribute("role", "option");
      customOption.setAttribute("aria-selected", "false");
      customOption.dataset.jsSelectOption = "";
      customOption.id = `${this.originalControlElement.id}-option-${index + 1}`;

      this.dropdownElement.append(customOption);
    });
  }
  notifyChange() {
    this.rootElement.dispatchEvent(
      new CustomEvent("select-change", {
        bubbles: true,
      }),
    );
  }
}

class SelectCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Select(element, phoneCountries);
    });
  }
}

export default SelectCollection;
