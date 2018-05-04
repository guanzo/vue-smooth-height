import parseCssTransition from 'parse-css-transition'

// Vue lifecycle hook
function created() {
    this._smoothElements = []
}

// Vue specific object
const methods = {
    $registerElement(options) {
        console.warn('vue-smooth-height: $registerElement is deprecated. Use $smoothElement instead')
        this.$smoothElement(options)
    },
    $removeElementElement(options) {
        console.warn('vue-smooth-height: $removeElementElement is deprecated. Use $unsmoothElement instead')
        this.$unsmoothElement(options)
    },
    $registerSmoothElement(options) {
        console.warn('vue-smooth-height: $registerSmoothElement is deprecated. Use $smoothElement instead')
        this.$smoothElement(options)
    },
    $removeElementSmoothElement(options) {
        console.warn('vue-smooth-height: $removeElementSmoothElement is deprecated. Use $unsmoothElement instead')
        this.$unsmoothElement(options)
    },
    $smoothElement(options) {
        let _addElement = addElement.bind(this)
        if (Array.isArray(options)) 
            options.forEach(_addElement)
        else 
            _addElement(options)
    },
    $unsmoothElement(options) {
        let _removeElement = removeElement.bind(this)
        if (Array.isArray(options))
            options.forEach(_removeElement)
        else 
            _removeElement(options)
    },
    
}

// 'this' is vue component
function addElement(option) {
    if (!option.el) {
        console.error('vue-smooth-height: Missing required property: "el"')
        return
    }
    let defaultOptions = {
        el: null,
        hideOverflow: false,
        debug: false,
        hasExistingHeightTransition: false,
        transitionState: STATES.START,
        log(text) {
            if (option.debug)
                console.log(`VSM_DEBUG: ${text}`)
        }
    }
    option = Object.assign(defaultOptions, option)
    option.endListener = endListener.bind(option)
    option.stopTransition = stopTransition.bind(option)
    this._smoothElements.push(option)
}

// 'this' is vue component
function removeElement(option) {
    let root = this.$el
    let index = this._smoothElements.findIndex(d => {
        return select(root, d.el).isEqualNode(select(root, option.el))
    })
    if (index == -1) {
        console.error("vue-smooth-height: Remove smooth element failed due to invalid el option")
        return
    }
    this._smoothElements.splice(index, 1)
}

function select(rootEl, el) {
    if (typeof el === 'string')
        return rootEl.matches(el) ? rootEl : rootEl.querySelector(el)
    else 
        return el
}

const STATES = {
    IN_PROGRESS: 1,
    ENDED: 2,
    INTERRUPTED: 3
}

// Vue lifecycle hook
function beforeUpdate() {
    if (!this._smoothElements || !this._smoothElements.length) 
        return

    this._smoothElements.forEach(option => {
        let { el, debug } = option
        // Find element during update time, instead of registration time
        let $el = select(this.$el, el)
        if (!$el) {
            return
        }
        option.$el = $el
        let height = window.getComputedStyle($el)['height']
        option.beforeHeight = height
        if (option.transitionState === STATES.IN_PROGRESS) {
            option.stopTransition()
            option.log('Transition was interrupted.')
        }
        option.transitionState = STATES.IN_PROGRESS
    })
}

// Vue lifecycle hook
function updated() {
    if (!this._smoothElements || !this._smoothElements.length) 
        return

    this._smoothElements.forEach(option => {
        if (!option.$el) {
            return
        }
        this.$nextTick(() => doSmoothReflow(option))
    })
}

function doSmoothReflow(option) {
    let { $el, beforeHeight, hideOverflow, debug } = option

    let computedStyle = window.getComputedStyle($el)
    let afterHeight = computedStyle['height']
    if (beforeHeight == afterHeight) {
        option.transitionState = STATES.ENDED
        option.log(`Element height did not change between render.`)
        return
    }
    option.log(`Previous height: ${beforeHeight} Current height: ${afterHeight}`)

    let transition = computedStyle.transition
    option.parsedTransition = parseCssTransition(transition)
    if (hasHeightTransition(option.parsedTransition)) {
        option.hasExistingHeightTransition = true
    } else {
        option.hasExistingHeightTransition = false
        addHeightTransition($el, option.parsedTransition)
    }

    if (hideOverflow) {
        //save overflow properties before overwriting
        let overflowY = computedStyle.overflowY,
            overflowX = computedStyle.overflowX

        option.overflowX = overflowX
        option.overflowY = overflowY

        $el.style.overflowX = 'hidden'
        $el.style.overflowY = 'hidden'
    }

    $el.style['height'] = beforeHeight
    $el.offsetHeight // Force reflow
    $el.style['height'] = afterHeight
    $el.addEventListener('transitionend', option.endListener, { passive: true })
}

function hasHeightTransition(parsedTransition) {
    return parsedTransition.find(t => {
        return ['all','height'].includes(t.name) && t.duration > 0
    })
}

// Delay and Duration are in milliseconds
// Add height transition to existing transitions.
function addHeightTransition($el, parsedTransition) {
    let transitions = parsedTransition.map(t => {
        return `${t.name} ${t.duration}ms ${t.timingFunction} ${t.delay}ms`
    })
    $el.style.transition = transitions.join(',') + ',height 1s'
}

// 'this' is the option object
function endListener(e) {
    if (e.currentTarget !== e.target || e.propertyName !== 'height')
        return
    this.stopTransition()
}

// Gets called manually if transition is interrupted
// 'this' is the options object
function stopTransition() {
    let { 
        $el, hideOverflow, overflowX, overflowY, 
        hasExistingHeightTransition,
    } = this

    $el.style['height'] = null // Change height back to auto
    if (hideOverflow) {
        // Restore original overflow properties
        $el.style.overflowX = overflowX
        $el.style.overflowY = overflowY
    }
    // Clean up inline transition
    if (!hasExistingHeightTransition) {
        $el.style.transition = null
    }
    $el.removeEventListener('transitionend', this.endListener)
    this.transitionState = STATES.ENDED
}

export default {
    methods,
    created,
    beforeUpdate,
    updated,
}
