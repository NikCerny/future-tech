import { Select } from "./Select.js";
import phoneCountries from "./phoneCountries.js";

const rootSelector = '[data-js-select="phone"]';

class PhoneSelect extends Select {
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
}

class PhoneSelectCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new PhoneSelect(element, phoneCountries);
    });
  }
}

export default PhoneSelectCollection;
