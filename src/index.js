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
            e.setBeforeHeight($el)
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
function addElement(option = {}) {
    if (!option.hasOwnProperty('el')) {
        option.el = this.$el
    }
    this._smoothElements.push(new SmoothElement(option))
}

// 'this' is vue component
function removeElement(option) {
    let root = this.$el
    let index = this._smoothElements.findIndex(d => {
        return select(root, d.el) === select(root, option.el)
    })
    if (index == -1) {
        console.error("VSM_ERROR: $unsmoothElement failed due to invalid el option")
        return
    }
    let smoothEl = this._smoothElements[index]
    smoothEl.remove()
    this._smoothElements.splice(index, 1)
}

function select(rootEl, el) {
    if (typeof el === 'string')
        return rootEl.matches(el) ? rootEl : rootEl.querySelector(el)
    else
        return el
}

let iota = 0
const STATES = Object.freeze({
    INACTIVE: iota++,
    ACTIVE: iota++
})

class SmoothElement {
    constructor(options) {
        options = {
            // Element or selector string.
            el: null,
            // User can specify a transition if they don't want to use CSS
            transition: 'height .5s',
            childTransitions: true,
            hideOverflow: false,
            debug: false,
            ...options
        }
        Object.assign(this, {
            $el: null,// Resolved Element from el
            hasExistingHeightTransition: false,
            beforeHeight: null,
            afterHeight: null,
            state: STATES.INACTIVE,
            options,
        })
        // transition end callback will call endListener, so it needs the correct context
        this.endListener = this.endListener.bind(this)
    }
    transition(to) {
        this.state = to
    }
    /**
     * Indicates if the smooth transition increased or decreased the elements height
     * A positive result means the height was increased
     */
    get heightDiff() {
        let { beforeHeight, afterHeight } = this
        if (beforeHeight == null || afterHeight == null) {
            return 0
        }
        return afterHeight - beforeHeight
    }
    setBeforeHeight($el) {
        this.afterHeight = null
        let height
        if ($el) {
            height = $el.offsetHeight
        }

        this.beforeHeight = height
        if (this.state === STATES.ACTIVE) {
            this.stopTransition()
            this.log('Transition was interrupted.')
        }
    }
    doSmoothReflow($el) {
        if (!$el) {
            this.log("Could not find registered el.")
            return
        }
        this.$el = $el
        this.transition(STATES.ACTIVE)
        $el.addEventListener('transitionend', this.endListener, { passive: true })

        let { beforeHeight, options } = this

        // If this.afterHeight is set, that means doSmoothReflow() was called after
        // a nested transition finished. This check is made to ensure that
        // a height transition only occurs on a false conditional render,
        // a.k.a. an element is being hidden rather than shown.
        // VSM works normally on a true conditional render.
        let afterHeight = $el.offsetHeight
        if (this.afterHeight != null && this.afterHeight === afterHeight) {
            this.log(`Element height did not change after nested transition. Height = ${afterHeight}`)
            this.transition(STATES.INACTIVE)
            return
        }
        if (beforeHeight === afterHeight) {
            this.log(`Element height did not change. Height = ${afterHeight}`)
            this.transition(STATES.INACTIVE)
            return
        }
        this.afterHeight = afterHeight
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
    endListener(e) {
        // Transition on smooth element finished
        if (e.currentTarget === e.target) {
            if (e.propertyName === 'height') {
                this.stopTransition()
            }
        }
        // Transition on element INSIDE smooth element finished
        // heightDiff <= 0 prevents calling doSmoothReflow during a
        // transition that increases height.
        // solves the case where a nested transition duration is
        // shorter than the height transition duration, causing doSmoothReflow
        // to reflow in the middle of the height transition
        else if (this.heightDiff <= 0 && this.options.childTransitions) {
            this.doSmoothReflow(this.$el)
        }
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

        this.transition(STATES.INACTIVE)
    }
    remove() {
        this.$el.removeEventListener('transitionend', this.endListener)
    }
    log(text) {
        if (this.options.debug)
            console.log(`VSM_DEBUG: ${text}`, this.$el)
    }
}

export default mixin
