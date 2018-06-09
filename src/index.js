import parseCssTransition from 'parse-css-transition'

const mixin = {
    methods: {
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
    },
    created() {
        this._smoothElements = []
    },
    beforeUpdate() {
        if (!this._smoothElements || !this._smoothElements.length) 
            return
        this._smoothElements.forEach(e => {
            // Retrieve registered element on demand
            // El could have been hidden by v-if/v-show
            let $el = select(this.$el, e.options.el)
            e.beforeUpdate($el)
        })
    },
    updated() {
        if (!this._smoothElements || !this._smoothElements.length) 
            return
        this.$nextTick(()=>{
            this._smoothElements.forEach(e => {
                // Retrieve registered element on demand
                // El could have been hidden by v-if/v-show
                let $el = select(this.$el, e.options.el)
                e.doSmoothReflow($el)
            })
        })
    }
}

// 'this' is vue component
function addElement(option) {
    if (!option.el) {
        console.error('vue-smooth-height: Missing required property: "el"')
        return
    }
    this._smoothElements.push(new SmoothElement(option))
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
    INACTIVE: 0,
    ACTIVE: 1
}

class SmoothElement {
    constructor(options) {
        options = {
            el: null, // User given argument. Element or selector string
            transition: 'height .5s', // User can specify a transition if they don't want to use CSS
            hideOverflow: false,
            debug: false,
            ...options
        }
        Object.assign(this, {
            $el: null,// Resolved Element from el
            hasExistingHeightTransition: false,
            state: STATES.INACTIVE,
            options
        })
        // transition end callback will call endListener, so it needs the correct context
        this.endListener = this.endListener.bind(this)
    }
    transition(to) {
        this.state = to
    }
    endListener(e) {
        if (e.currentTarget !== e.target || e.propertyName !== 'height')
            return
        this.stopTransition()
    }
    beforeUpdate($el) {
        if (!$el) {
            this.log("Vue beforeUpdate hook: could not find registered el.")
        }
        let height
        try {
            height = $el.offsetHeight
        } catch (e) {
            height = 0
        }
        this.beforeHeight = height
        if (this.state === STATES.ACTIVE) {
            this.stopTransition()
            this.log('Transition was interrupted.')
        }
    }
    doSmoothReflow($el) {
        if (!$el) {
            this.log("Vue updated hook: could not find registered el.")
            return
        }
        this.$el = $el
        this.transition(STATES.ACTIVE)

        let { beforeHeight, options } = this
        
        let afterHeight = $el.offsetHeight
        if (beforeHeight == afterHeight) {
            this.transition(STATES.INACTIVE)
            this.log(`Element height did not change between render.`)
            return
        }
        this.log(`Previous height: ${beforeHeight} Current height: ${afterHeight}`)
    
        let computedStyle = window.getComputedStyle($el)
        let parsedTransition = parseCssTransition(computedStyle.transition)
        if (this.hasHeightTransition(parsedTransition)) {
            this.hasExistingHeightTransition = true
        } else {
            this.hasExistingHeightTransition = false
            this.addHeightTransition(parsedTransition, options.transition)
        }
    
        if (options.hideOverflow) {
            //save overflow properties before overwriting
            let overflowY = computedStyle.overflowY,
                overflowX = computedStyle.overflowX
    
            this.overflowX = overflowX
            this.overflowY = overflowY
    
            $el.style.overflowX = 'hidden'
            $el.style.overflowY = 'hidden'
        }
        
        $el.style['height'] = beforeHeight + 'px'
        $el.offsetHeight // Force reflow
        $el.style['height'] = afterHeight + 'px'
        
        $el.addEventListener('transitionend', this.endListener, { passive: true })
    }
    hasHeightTransition(parsedTransition) {
        return parsedTransition.find(t => {
            return ['all','height'].includes(t.name) && t.duration > 0
        })
    }
    // Delay and Duration are in milliseconds
    // Add height transition to existing transitions.
    addHeightTransition(parsedTransition, heightTransition) {
        let transitions = parsedTransition.map(t => {
            return `${t.name} ${t.duration}ms ${t.timingFunction} ${t.delay}ms`
        })
        this.$el.style.transition = [...transitions, heightTransition].join(',')
    }
    stopTransition() {
        let { 
            $el, options, overflowX, overflowY,
            hasExistingHeightTransition,
        } = this
    
        $el.style['height'] = null // Change height back to auto
        if (options.hideOverflow) {
            // Restore original overflow properties
            $el.style.overflowX = overflowX
            $el.style.overflowY = overflowY
        }
        // Clean up inline transition
        if (!hasExistingHeightTransition) {
            $el.style.transition = null
        }
        $el.removeEventListener('transitionend', this.endListener)
        this.transition(STATES.INACTIVE)
    }
    log(text) {
        if (this.options.debug)
            console.log(`VSM_DEBUG: ${text}`, this.$el)
    }
}

export default mixin
