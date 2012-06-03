/*!
** tectonic.js 0.1
** http://evilmarty.github.com/tectonic/
**
** Copyright (c) 2012 by Marty Zalega
** 
** Permission is hereby granted, free of charge, to any person obtaining a 
** copy of this software and associated documentation files (the "Software"), 
** to deal in the Software without restriction, including without limitation 
** the rights to use, copy, modify, merge, publish, distribute, sublicense, 
** and/or sell copies of the Software, and to permit persons to whom the 
** Software is furnished to do so, subject to the following conditions:
** 
** The above copyright notice and this permission notice shall be included in
** all copies or substantial portions of the Software.
** 
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
** FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
** DEALINGS IN THE SOFTWARE.
*/
(function ($) {
  var undefined;

  if (!Object.create) {
    Object.create = function (o) {
      if (arguments.length > 1) {
          throw new Error('Object.create implementation only accepts the first parameter.');
      }
      function F() {}
      F.prototype = o;
      return new F();
    };
  }
  
  var selectClass = 'tectonic-active';
  var Layout = {
    setup: function(ui) {
      ui.element.addClass('tectonic');
      ui.item.addClass(selectClass);
    },
    teardown: function(ui) {
      ui.element.removeClass('tectonic');
    },
    insert: function(ui, callback) {
      var sibling;
      if (sibling = ui.items.get(ui.index)) {
        $(sibling).before(ui.item);
      } else {
        ui.element.append(ui.item);
      }
      return true;
    },
    remove: function(ui, callback) {
      ui.item.remove();
      return true;
    },
    select: function(ui, callback) {
      ui.items.filter('.' + selectClass).removeClass(selectClass);
      ui.items.eq(ui.index).addClass(selectClass);
      return true;
    },
    move: function(ui, callback) {
      var sibling;
      if (sibling = ui.items.get(ui.index)) {
        $(sibling).before(ui.item);
      } else {
        ui.element.append(ui.item);
      }
      return true;
    }
  };
  
  var layouts = {};
  function getLayout(name) {
    if ($.isPlainObject(name)) {
      return $.extend(Object.create(Layout), name);
    } else if (layouts[name]) {
      return getLayout(layouts[name]);
    } else {
      return Object.create(Layout);
    }
  }
  
  var Tectonic = function(elem, options) {
    this.element = $(elem);
    this.options = options || {};
    
    this.items = this.element.children(this.options.selector).toArray();  
    this.selected = this.get(this.options.selectedIndex);
      
    this._setLayout(this.options.layout);
  };
  
  $.extend(Tectonic.prototype, {
    destroy: function() {
      this._shutdownLayout();

      this.element.removeData('tectonic');

      var self = this;
      $.each(self, function(key, _) {
        self[key] = null;
      });
    },
    option: function(name, value) {
      if ($.isPlainObject(name)) {
        var key;
        for (key in name) {
          this._setOption(key, name[key]);
        }
        return;
      }
      if (value === undefined) {
        return this._getOption(name);
      } else {
        this._setOption(name, value);
      }
    },
    length: function() {
      return this.items.length;
    },
    all: function() {
      return $.makeArray(this.items);
    },
    get: function(index) {
      return this.items[this._normalizeIndex(index)] || null;
    },
    index: function(content) {
      return $.inArray($(content)[0], this.items);
    },
    append: function(content) {
      this.insert(this.items.length, content);
    },
    prepend: function(content) {
      this.insert(0, content);
    },
    insert: function(index, content) {
      var self = this, insertions = $(content).toArray(), i = 0;
      
      index = Math.min(this._normalizeIndex(index), this.items.length);

      function doInsert() {
        var elem = insertions.pop(), k = i + index, move;
        if (!elem) { return; }

        move = self.index(elem) !== -1;
        self._layout(move ? 'move' : 'insert', elem, k, function() {
          self[move ? '_moved' : '_added'](elem, k);
          doInsert();
        });
        i++;
      }

      doInsert();
    },
    empty: function() {
      return this.remove(this.items);
    },
    remove: function(content) {
      if (typeof content === 'number') {
        var index = this._normalizeIndex(content);
        return this.remove(this.items[index]);
      }

      var removals = $(content).toArray(), self = this;

      function doRemove() {
        var elem = removals.shift(),
            index = self.index(elem);

        if (index === -1) { return; }

        self._layout('remove', elem, index, function() {
          self._removed(elem, index);
          doRemove();
        });
      }
      
      doRemove();
    },
    selectedIndex: function(index) {
      if (index === undefined) {
        return this.selected ? this.index(this.selected) : -1;
      }

      var content = this.items[index],
          self = this;

      if (this.selected === content) { return; }

      this._layout('select', content, index, function() {
        self._selected(content, index);
      });
    },
    value: function(item) {
      if (item === undefined) {
        return this.selected || null;
      }

      this.selectedIndex(this.index(item));
    },
    _trigger: function(eventType, extraParameters) {
      if ($.isFunction(this.options[eventType])) {
        extraParameters = $.makeArray(extraParameters);
        extraParameters.unshift($.Event(eventType));
        this.options[eventType].apply(this.element[0], extraParameters);
      }
      return this.element.trigger('tectonic' + eventType, extraParameters);
    },
    _getOption: function(name) {
      if (name === 'selectedIndex') {
        return this.selectedIndex();
      } else {
        return this.options[name];
      }
    },
    _setOption: function(name, value) {
      if (name === 'selectedIndex') {
        return this.selectedIndex(value);
      } else if (name === 'layout') {
        this._setLayout(value);
      }
      this.options[name] = value;
    },
    _normalizeIndex: function(index) {
      while (index < 0) index = this.items.length + index;
      return index;
    },
    _setLayout: function(layout) {
      this._shutdownLayout();
      this.layout = getLayout(layout);
      this._layout('setup', this.selected, this.selectedIndex());
    },
    _shutdownLayout: function() {
      if (this.layout) {
        this._layout('teardown');
        delete this.layout;
        this.layout = null;
      }
    },
    _layout: function(action, content, index, callback) {
      var opts = {element: this.element, item: $(content), index: index, items: $(this.items)},
          layout = this.layout,
          returnValue;
      
      returnValue = this.layout[action](opts, function() {
        if (returnValue === undefined) {
          callback && callback()
        }
      });

      if (returnValue === true) {
        callback && callback();
      }
    },
    _added: function(content, index) {
      this.items.splice(index, 0, content);
      this._trigger('add', {item: content, index: index});
    },
    _removed: function(content, index) {
      var rest = this.items.slice(index + 1);
      this.items.length = index;
      this.items.push.apply(this.items, rest);
      
      if (this.selected == content) {
        this.selected = null;
      }
      
      this._trigger('remove', {item: content, index: index});
    },
    _selected: function(content, index) {
      this.selected = content;
      this._trigger('select', {item: content, index: index});
    },
    _moved: function(content, index) {
      var oldIndex = this.index(content),
          rest = this.items.slice(oldIndex + 1);
      this.items.length = oldIndex;
      this.items.push.apply(this.items, rest);
      this.items.splice(index, 0, content);

      this._trigger('move', {item: content, index: index});
    }
  });
  
  var name = 'tectonic';
  $.fn[name] = function(options) {
    var isMethodCall = typeof options === 'string',
        args = Array.prototype.slice.call(arguments, 1),
        returnValue = this;

    if (isMethodCall) {
      this.each(function() {
        var instance = $.data(this, name);
        if (!instance) {
          return $.error("cannot call methods on " + name + " prior to initialization; " +
                         "attempted to call method '" + options + "'");
        }
        if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
          return $.error("no such method '" + options + "' for " + name + " instance");
        }
        var methodValue = instance[options].apply(instance, args);
        if (methodValue !== instance && methodValue !== undefined) {
          returnValue = methodValue && methodValue.jquery ?
                        returnValue.pushStack(methodValue.get()) :
                        methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $.data(this, name);
        if (instance) {
          if (options !== undefined) instance.option(options);
        } else {
          instance = new Tectonic(this, options);
          $.data(this, name, instance);
        }
      });
    }
    
    return returnValue;
  };

  $[name] = layouts;
})(jQuery);