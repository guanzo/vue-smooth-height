
# Vue Smooth Height
A Vue mixin that answers the question, "How do I transition height auto?"

Use this mixin on container elements that have a dynamic number of children. When the container's children rerender, the container's height will transition, instead of instantly resizing.

Note that this library has no overlap with Vue's built in transition components.

## Demo
https://jsfiddle.net/axfwg1L0/6/

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
import smoothHeight from 'vue-smooth-height';

<template>

<div>
    <div class="container" ref="container">
        <!-- children created with v-for -->
    </div>
</div>

</template>

<script>
export default {
    mixins:[smoothHeight],
    mounted(){
        //use nextTick if necessary
        this.$registerElement({
            el: this.$refs.container,
        })
    },
}
</script>
```

Browser:

Same as above, use the global `SmoothHeight`

## CSS
This mixin relies on css transitions, meaning you can define whatever css transitions you want for the element. If the mixin does not detect any transitions, it will apply `transition: 1s` to the element.

## API
### $registerElement(options)
#### options: Object | Array

Can be a single options object,
or an array of options objects.

Enables smooth height transition on an element.


**Option**|**Types**|**Default**|**Description**
-----|-----|-----|-----
el|Element,String|null|Required. A reference to the element, or a selector string. Use a selector string if the container element is not rendered initially. If selector string is a class, the first query match will be registered
hideOverflow|Boolean|false|If the element has a scrollbar, ugly reflow flickers can occur when children create/destroy a new row (think flexbox). Set true to disable overflow during the transition.


### $unregisterElement(options)
#### options: Object | Array

Can be a single options object,
or an array of options objects.

Disables smooth height behavior on an element. Registered elements that have the same `el` as the passed in options will be unregistered. 

Example:


```javascript

mounted(){
    this.$registerElement({
        el: this.$refs.container,
    })
    this.$unregisterElement({
        el: '.container',
    })
},

```