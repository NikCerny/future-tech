import phoneCountries from "./phoneCountries.js";

const rootSelector = "[data-js-phone-input]";
const selectSelector = "[data-js-select-control]";
const inputSelector = "[data-js-phone-input-control]";

class PhoneInput {
  selectors = {
    select: selectSelector,
    input: inputSelector,
  };

  constructor(rootElement) {
    this.rootElement = rootElement;

    this.selectElement = this.rootElement.querySelector(this.selectors.select);

    this.inputElement = this.rootElement.querySelector(this.selectors.input);

    this.mask = null;

    this.updateMask();
    this.bindEvents();
  }

  get selectedCountry() {
    return phoneCountries.find(
      ({ dialCode }) => dialCode === this.selectElement.value,
    );
  }

  updateMask() {
    const selectedCountry = this.selectedCountry;


    if (!selectedCountry) {
      return;
    }

    if (this.mask) {
      this.mask.value = "";
      this.mask.updateOptions({
        mask: selectedCountry.mask,
      });
    } else {
      this.mask = IMask(this.inputElement, {
        mask: selectedCountry.mask,
      });
    }
    this.inputElement.placeholder = selectedCountry.mask;
  }

  onSelectChange = () => {
    
    this.updateMask();
  };

  bindEvents() {
    this.rootElement.addEventListener("select-change", this.onSelectChange);
  }
}

class PhoneInputCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new PhoneInput(element);
    });
  }
}

export default PhoneInputCollection;
