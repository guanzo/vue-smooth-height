const SmoothHeight = {
    methods:{
        /**
         * 
         * @param {Object | Array} options 
         */
        $registerElement(options){
            let addOption = _addOption.bind(this)
            if(Array.isArray(options))
                options.forEach(addOption)
            else
                addOption(options)
        },
        $unregisterElement(options){
            let unregister = _unregister.bind(this)
            if(Array.isArray(options))
                options.forEach(unregister)
            else
                unregister(options)
        }
    },
    created(){
        this._registered = []
    },
    beforeUpdate(){
        if(!this._registered || !this._registered.length)
            return;
        this._registered.forEach(option=>{

            let { el, property } = option;
            let element = select(this.$el, el)
            option.element = element
            if(!element){
                return;
            }
            let computedProperty = window.getComputedStyle(element)[property]
            option.beforeProperty = computedProperty
        })
    },
    updated(){
        if(!this._registered || !this._registered.length)
            return;
        this._registered.forEach(option=>{
            
            let { element: el, property, beforeProperty, hideOverflow } = option;
            this.$nextTick(()=>{
                let computedStyle = window.getComputedStyle(el)
                let afterProperty = computedStyle[property]
                if(beforeProperty == afterProperty)
                    return;
                
                if(hideOverflow){
                    el.style.overflowX = 'hidden'
                    el.style.overflowY = 'hidden'
                }
                if(computedStyle.transitionDuration === '0s'){
                    el.style.transition = '1s'
                }
                let {overflowY,overflowX} = computedStyle
                option.overflowX = overflowX
                option.overflowY = overflowY

                el.style[property] = beforeProperty
                el.offsetHeight//force reflow
                el.style[property] = afterProperty
                el.addEventListener('transitionend',listener.bind(option), { passive: true })
            })
        })
    }
}

function _addOption(option){

    let defaultOptions = {
        hideOverflow: false,
        property: 'height'
    }

    option = Object.assign(defaultOptions,option)
    if(!option.el){
        console.warn('Missing required property: "el"')
        return;
    }
    this._registered.push(option)
}

function _unregister(option){
    let root = this.$el;
    let index = this._registered.findIndex(d=>{
        return select(root,d.el).isEqualNode(select(root,option.el))
    })
    if(index == -1){
        console.warn("Unregister failed, invalid options object")
        return;
    }
    this._registered.splice(index,1)
}

function select(rootEl, el){
    if(typeof el === 'string'){
        return rootEl.matches(el)
                ? rootEl
                : rootEl.querySelector(el)
    }
    else
        return el
}

function listener(event){
    let el = event.currentTarget
    if(el !== event.target){
        return;
    }
    let { property, hideOverflow, overflowX, overflowY } = this;
    el.style[property] = null;
    if(hideOverflow){
        el.style.overflowX = overflowX
        el.style.overflowY = overflowY
    }
    el.removeEventListener('transitionend',listener)
}

export default SmoothHeight


module.exports = SmoothHeight;