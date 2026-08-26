class Header {
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    }

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor(){
        this.rootElem = document.querySelector(this.selectors.root);
        this.overlayElem = this.rootElem.querySelector(this.selectors.overlay);
        this.burgerButtonElem = this.rootElem.querySelector(this.selectors.burgerButton);
        this.bindEvents();
    }

    bindEvents(){
        this.burgerButtonElem.addEventListener('click', this.onBurgerButtonClick);
    }

    onBurgerButtonClick = () => {
        document.documentElement.classList.toggle(this.stateClasses.isLock);
        this.burgerButtonElem.classList.toggle(this.stateClasses.isActive);
        this.overlayElem.classList.toggle(this.stateClasses.isActive);
    }
}

export default Header