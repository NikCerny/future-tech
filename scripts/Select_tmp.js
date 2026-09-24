const rootSelector = "[data-js-select-tmp]";

class SelectTmp {
  selectors = {
    root: rootSelector,
    button: "[data-js-select-button]",
    dropdown: "[data-js-select-dropdown]",
    option: "[data-js-select-option]",
  };

  stateClasses = {
    isExpanded: "is-expanded",
    isSelected: "is-selected",
    isCurrentBeforeClick: "is-current",
    isOnTheLeftSide: "is-left-sided",
    isOnTheRightSide: "is-right-sided",
  };

  initialStates = {
    isExpanded: false,
    currentOptionIndex: null,
  };

  stateAttributes = {
    ariaExpanded: "aria-expanded",
    ariaSelected: "aria-selected",
    ariaActiveDescendant: "aria-activedescendant",
  };

  constructor(rootElem) {
    this.rootElem = rootElem;
    this.buttonElem = this.rootElem.querySelector(this.selectors.button);
    this.dropdownElem = this.rootElem.querySelector(this.selectors.dropdown);
    this.optionElems = this.dropdownElem.querySelectorAll(
      this.selectors.option,
    );

    this.selectedOptionElem = this.dropdownElem.querySelector(
      `.${this.stateClasses.isSelected}`,
    );

    const currentOptionElem = this.dropdownElem.querySelector(
      `.${this.stateClasses.isCurrentBeforeClick}`,
    );

    this.currentOptionIndex = [...this.optionElems].indexOf(currentOptionElem);

    this.bindEvents();
    this.updateButtonUI();
    this.fixDropdownPosition();
  }

  bindEvents() {
    this.buttonElem.addEventListener("click", this.onButtonClick);

    this.optionElems.forEach((optionElem, index) => {
      optionElem.addEventListener("click", () => {
        this.onOptionClick(optionElem, index);
      });
    });

    this.rootElem.addEventListener("keydown", this.onKeyDown);
  }

  onButtonClick = () => {
    this.dropdownElem.classList.toggle(this.stateClasses.isExpanded);
    this.buttonElem.setAttribute(
      this.stateAttributes.ariaExpanded,
      this.dropdownElem.classList.contains("is-expanded"),
    );
  };

  onOptionClick = (newOptionElem, newOptionIndex) => {
    this.selectedOptionElem.classList.remove(this.stateClasses.isSelected);

    this.optionElems[this.currentOptionIndex].classList.remove(
      this.stateClasses.isCurrentBeforeClick,
    );

    this.selectedOptionElem.setAttribute(
      this.stateAttributes.ariaSelected,
      false,
    );

    this.selectedOptionElem = newOptionElem;
    this.currentOptionIndex = newOptionIndex;

    this.selectedOptionElem.classList.add(
      this.stateClasses.isSelected,
      this.stateClasses.isCurrentBeforeClick,
    );

    this.selectedOptionElem.setAttribute(
      this.stateAttributes.ariaSelected,
      true,
    );

    this.updateActiveDescendant();
    this.updateButtonUI();
    this.onButtonClick();
  };

  updateButtonUI() {
    const newSelectedOptionValue = this.selectedOptionElem.textContent.trim();
    this.buttonElem.textContent = newSelectedOptionValue;
  }

  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth;
    const halfViewportX = viewportWidth / 2;
    const { width, x } = this.buttonElem.getBoundingClientRect();
    const buttonCenterX = x + width / 2;
    const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX;

    this.dropdownElem.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isButtonOnTheLeftViewportSide,
    );

    this.dropdownElem.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isButtonOnTheLeftViewportSide,
    );
  }

  onKeyDown = (event) => {
    const { code } = event;

    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onEnterKeyDown,
      Enter: this.onEnterKeyDown,
    }[code];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.onButtonClick();
      this.updateActiveDescendant();
      return;
    }
    this.moveCurrentOption(-1);
  };

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.onButtonClick();
      this.updateActiveDescendant();
      return;
    }
    this.moveCurrentOption(1);
  };

  moveCurrentOption = (direction) => {
    this.optionElems[this.currentOptionIndex].classList.remove(
      this.stateClasses.isCurrentBeforeClick,
    );

    this.currentOptionIndex =
      (this.currentOptionIndex + direction + this.optionElems.length) %
      this.optionElems.length;

    const currentOption = this.optionElems[this.currentOptionIndex];

    currentOption.classList.add(this.stateClasses.isCurrentBeforeClick);

    this.buttonElem.setAttribute(
      this.stateAttributes.ariaActiveDescendant,
      currentOption.id,
    );
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.onButtonClick();
      return;
    }

    const currentOption = this.optionElems[this.currentOptionIndex];
    this.onOptionClick(currentOption, this.currentOptionIndex);
  };

  updateActiveDescendant() {
    this.buttonElem.setAttribute(
      this.stateAttributes.ariaActiveDescendant,
      this.optionElems[this.currentOptionIndex].id,
    );
  }
}

class SelectCollectionTmp {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new SelectTmp(element);
    });
  }
}

export default SelectCollectionTmp;
