const rootSelector = '[data-js-tabs]'

class Tabs {
    selectors = {
        root: rootSelector,
        button: '[data-js-tabs-button]',
        content: '[data-js-tabs-content]'
    }

    stateClasses = {
        isActive: 'is-active'
    }

    stateAttributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex'
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
        this.state = {
            activeTabIndex: [...this.buttonElements]
            .findIndex((buttonElem) => buttonElem.classList.contains(this.stateClasses.isActive))
        }
        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
    }

    bindEvents() {
        this.buttonElements.forEach((buttonElem, index) => {
            buttonElem.addEventListener('click', () => this.onButtonClick(index))
        })
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }

    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
        this.updateUI()
    }

    updateUI() {
        const {activeTabIndex} = this.state
        this.buttonElements.forEach((buttonElem, index) => {
            const isActive = index === activeTabIndex
            buttonElem.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElem.setAttribute(this.stateAttributes.ariaSelected, isActive)
            buttonElem.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
        })
        
        this.contentElements.forEach((contentElem, index) => {
            const isActive = index === activeTabIndex
            contentElem.classList.toggle(this.stateClasses.isActive, isActive)
        })

    }

    onKeyDown = (event) => {
        const { key, metaKey } = event

        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }[key]

        const isMacHomeKey = metaKey && key === 'ArrowLeft'
        
        if (isMacHomeKey) {
            this.firstTab()
            this.updateUI()
            return
        }

        const isMacEndKey = metaKey && key === 'ArrowRight'
        
        if (isMacEndKey) {
            this.lastTab()
            this.updateUI()
            return
        }

        if (action){
            action()
            this.updateUI()
        }
    }

    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1

        this.activateTab(newTabIndex)
    }

    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1

        this.activateTab(newTabIndex)
    }

    firstTab = () => {
        this.activateTab(0)
    }

    lastTab = () => {
        this.activateTab(this.limitTabsIndex)
    }

    activateTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }
}   

class TabsCollection {

    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Tabs(element)
        })
    }
}

export  default TabsCollection