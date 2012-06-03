# Tectonic

## Overview

Creating layout plugins using jQuery I found that a lot of logic was duplicated or very similar. Say we have a "tabs" plugin and an "accordian" layout for example. Both might add and remove elements, but also they could __select__ a primary element. Although the presentation would be different, the element handling wasn't. Introducing Tectonic, a library to handle all that logic and let the layout just do it's presentation.

## Example

We have this HTML:

```html
<html>
  <head>
    <title>Here be wizards and dragons</title>
  <body>
    <div id="dragon">
      <div class="shout">Fus Ro Dah</div>
      <div class="shout">Wuld Nah Kest</div>
      <div class="shout">Kaan Drem Ov</div>
      <div>Rawr</div>
    </div>
  </body>
</html>
```

This is how to get started with Tectonic.

```javascript
$('#dragon').tectonic({
  layout: 'accordian',
  selector: '.shout',
  selectedIndex: 1
});
```

## Getting started

You will need [jQuery 1.7](http://www.jquery.com) for Tectonic to work. It is possible earlier versions of jQuery will work with Tectonic but as of writing have been untested and thus unsupported.

Download Tectonic and include it into your page and initialise on the desired element.

## Commands

To call a command or method you must pass it as the first argument to the reference followed by subsiquent arguments which will be passed to the command, if required. As so:

```javascript
$('#example').tectonic('command', ...);
```

### .tectonic(_options_)

Calling the reference for the first time on an element will initialize Tectonic for that element. ie. `$('#example').tectonic()`.

* ___options___ - A hash of options to override the defaults.

### .tectonic('option', __name__, _value_)

Set or get a option.

* __name__ - The name of the option.
* ___value___ - Set the value of the option, if present.

### .tectonic('destroy')

Destroys the Tectonic instance and resets the element back to it's original state.

### .tectonic('length')

Returns the number of elements.

### .tectonic('all')

Return an array of all the elements.

### .tectonic('get', __index__)

Return the element at the specified zero-based position. If a negative position is given then the position is relative to the end of the collection. ie. -2 is the 2nd last element, -3 is the 3rd last, etc.

### .tectonic('index', __element__)

Return the zero-based position of the element. If the element cannot be found -1 is returned instead.

* __element__ - A HTML element or jQuery object

### .tectonic('append', __content__)

Inserts the content at the end of the container.

* __content__ - A HTML element, an array of HTML elements or a jQuery object.

### .tectonic('prepend', __content__)

Inserts the content at the beginning of the container.

* __content__ - A HTML element, an array of HTML elements or a jQuery object.

### .tectonic('insert', __index__, __content__)

Inserts the content at the specified zero-based position.

* __index__ - Behaves the same as the __get__ command
* __content__ - A HTML element, an array of HTML elements or a jQuery object.

### .tectonic('empty')

Clears all the elements inside the container.

### .tectonic('remove', __content__)

Removes the content from the container. If given an integer, the element at that position is removed.

* __content__ - A HTML element, an array of HTML elements, jQuery object or an integer. The integer behaves the as used in the __get__ command.

### .tectonic('selectedIndex', ___index___)

Get or sets the zero-based position of the selected element. If no element is selected then -1 is returned.

### .tectonic('value', ___element___)

Get or set the selected element.

* ___element___ - A HTML element or jQuery object

## Options

These options can be fetched or set using the __option__ command. They can also be passed when initialising.

### selector

A jQuery selector to set the elements in the container. This is only used during initialisation. Default is `*`.

### selectedIndex

An alias to the __selectedIndex__ command.

### layout

The name of the layout or object containing to override the layout methods.

## Events

A callback can be passed as options or can be bound to the element similar to other events. Bound events are prefixed with "tectonic" to avoid collisions with other existing events. ie. _tectonicselect_.

Additional to the _Event_ object passed to the event callback, an additional object is given containing the affected element and it's index.

* __item__ - The element affected, if present.
* __index__ - The index of the element, or -1 if not available.

### add

Triggered when an element is added to the collection.

### remove

Triggered when an element is removed from the collection.

### move

Triggered when an element's position has been moved.

### select

Triggered when an element has been selected.

## Layouts

When a plain object containing layout methods is passed, it is instantiated in a separate instance outside of Tectonic's own instance. The instance is safe to add variables specific to container element. By default, the layout does not have a reference to tectonic. This was a design decision to limit calling back and forth to be strictly one way, as it should only be responsible for presentation. That said, if you should need to communicate to the Tectonic instance you can use the public methods, or retreive the instance as so:

```javascript
$('#example').data('tectonic')
```

Each method is given two arguments. The first is an object with references to the container element, the collection of items and the item the operation affects and it's index if available. All the objects are wrapped in a jQuery object for convenience. The second argument is a callback function to be called if the operation is delayed or intensive. If the callback is not called then `true` must be returned if the operation was successful. Not returning true or calling the callback cancels the operation and no events are triggered or items updated. An exception for `setup` and `teardown` is to be made as the operation is always considered successful.

__Note__ that calling the callback has no effect on `setup` and `teardown`.

* __ui__
** __element__ - The container element
** __items__ - The collection of items
** __item__ - The affected item from the collection. If not available an empty jQuery object is given instead.
** __index__ - The position of the affected item. If item is not available then -1 is given. Tectonic handles the management of positions so it is guarenteed by this stage that the index is normalised and valid.

### setup

Called when the layout is initialised either when Tectonic is initialised or when the layout is changed.

### teardown

Called when the layout is changed or Tectonic is removed.

### insert

The given `index` is the position the `item` is meant to be inserted.

### remove

`item` is to be removed.

### move

`index` is the new position for `item`.

### select

`item` is the selected element. When `item` is an empty jQuery object that signifies no element is to be selected.

## Registering a layout

To make it easier to reuse a layout multiple times you can easily register the layout with a unique name. This name can then be given to Tectonic to instruct to use that layout.

```javascript
$.tectonic['example'] = {...}
```

## Credits

A lot of inspiration was drawn from [jQuery UI](http://jquery-ui.com) as well as some portions of code. It's a great library and the team behind it have done a fantastic job! Given that, I chose Tectonic to not be dependant on other libraries other than jQuery itself. Tectonic does not interfere with jQuery in any way.

Big thanks to [jQuery](http://jquery.com) for being the greatest library for the modern web developer, and to [Github](http://github.com) for hosting this and all my other projects.

## Bug reports

Please report any bugs using [Github Issues](http://github.com/evilmarty/tectonic/issues).

## TODO

Add default layouts