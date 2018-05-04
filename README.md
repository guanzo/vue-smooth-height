
# Vue Smooth Height (VSM)
A Vue mixin that answers the question, "How do I transition height: auto?"

When the component's data is changed (i.e. when the `updated` lifecycle hook is called), its current height will smoothly transition to the new height, instead of instantly resizing. If the transition is interrupted, it will transition from the interrupted height to the new height.

Note that this library has no overlap with Vue's built in transition components.

## Demo
https://jsfiddle.net/axfwg1L0/33/

## Installation

Using npm:
```shell
$ npm install vue-smooth-height
```

In a browser:
```html
<script src="vue-smooth-height.min.js"></script>
```

## Usage


```javascript
<template>
    <div>
        <div class="container" ref="container">
            <!-- children created with v-for -->
        </div>
    </div>
</template>

<script>
import smoothHeight from 'vue-smooth-height';

export default {
    mixins:[smoothHeight],
    mounted(){
        //use nextTick if necessary
        this.$registerSmoothElement({
            el: this.$refs.container,
        })
    },
}
</script>
```

Browser:

The mixin is available via the global variable `SmoothHeight`

## CSS Transitions
VSM will check if the element has a height transition. If it exists, VSM will use that. If it doesn't, it will apply `transition: height 1s` to the element's inline style, and append any existing transition properties it finds.

For example, if the element has this style:

```
.element {
    transition: opacity 1s;
}
```

VSM will set ```style="transition: opacity 1s, height 1s;"``` on the element during the transition. After the transition, it will remove the inline style.

For simplicity, do not set your other transitions on the element as inline styles, as they will be overridden.

## API
### $registerSmoothElement(options)
#### options: Object | Array

Can be a single options object,
or an array of options objects.

Enables smooth height transition on an element.


**Option**|**Types**|**Default**|**Description**
-----|-----|-----|-----
el|Element, String|null|Required. A reference to the element, or a selector string. Use a selector string if the element is not rendered initially. If the selector string is a class, the first query match will be registered.
hideOverflow|Boolean|false|If the element has a scrollbar, ugly reflow flickers can occur when children create/destroy a new row (think flexbox). Set true to disable overflow during the transition.
debug|Boolean|false|Logs messages at certain times within the transition lifecycle.


### $unregisterSmoothElement(options)
#### options: Object | Array

Can be a single options object,
or an array of options objects.

Disables smooth height behavior on an element. Registered elements that have the same `el` as the passed in options will be unregistered. 

Examples:


```javascript

mounted(){
    // Registering with element reference
    this.$registerSmoothElement({
        el: this.$refs.container,
    })
    // Registering with classname
    this.$registerSmoothElement({
        el: '.container',
    })

    // If the element reference is a component, 
    // make sure to pass in its "$el" property.
    this.$registerSmoothElement({
        el: this.$refs.container.$el,
    })

},

```