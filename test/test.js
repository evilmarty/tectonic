module("initialization");
test("#initialize should instantiate and assign in the element's data", 3, function() {
  var elem = $("<div></div>");
  equal(null, elem.data('tectonic'));

  elem.tectonic();
  var tectonic = elem.data('tectonic');
  notEqual(null, tectonic);
  equal(elem[0], tectonic.element[0]);
});
test("#initialize with selectedIndex should select the element at the specified position", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic({selectedIndex: 1});
  equal(1, elem.tectonic('selectedIndex'));
});
test("#initialize with selector should collect child elements that match the selection", 1, function() {
  var child1 = $('<span id="child1" class="foobar"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic({selector: ".foobar"});
  deepEqual(elem.tectonic('all'), [child1]);
});
test("calling a method while not initialized should throw an error", 1, function() {
  raises(function() {
    $("<div></div>").tectonic('option');
  }, Error);
});
test("calling a method that begins with an underscore should throw an error", 1, function() {
  var elem = $("<div></div>").tectonic();
  raises(function() {
    elem.tectonic('_getOption');
  }, Error);
});

module("options");
test("get #option that has not been set should return self", 1, function() {
  var elem = $("<div></div>").tectonic();
  equal(elem, elem.tectonic("option", "foo"));
});
test("get #option that has been set should return the set value", 1, function() {
  var elem = $("<div></div>").tectonic({foo: "bar"});
  equal("bar", elem.tectonic("option", "foo"));
});
test("set #option should set the given option", 2, function() {
  var elem = $("<div></div>").tectonic();
  equal(elem, elem.tectonic("option", "foo"));

  elem.tectonic("option", "foo", "bar");
  equal("bar", elem.tectonic("option", "foo"));
});
test("set #option should set options for the given plain object", 4, function() {
  var elem = $("<div></div>").tectonic();
  equal(elem, elem.tectonic("option", "foo"));
  equal(elem, elem.tectonic("option", "abc"));

  elem.tectonic("option", {foo: "bar", abc: 123});
  equal("bar", elem.tectonic("option", "foo"));
  equal(123, elem.tectonic("option", "abc"));
});

module("retreival");
test("#length with no children should return zero", 1, function() {
  var elem = $("<div></div>").tectonic();
  equal(0, elem.tectonic("length"));
});
test("#length with children should return number of children", 1, function() {
  var elem = $('<div><span id="child1"></span><span id="child2"></span></div>').tectonic();
  equal(2, elem.tectonic("length"));
});
test("#all with no children should return empty array", 1, function() {
  var elem = $("<div></div>").tectonic();
  deepEqual(elem.tectonic("all"), []);
});
test("#all with children should return an array of all children", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.tectonic("all"), [child1, child2]);
});
test("#get should return null when child does not exist", 1, function() {
  var elem = $("<div></div>").tectonic();
  equal(null, elem.tectonic("get", 1));
});
test("#get should return the child at the specified index", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(child1, elem.tectonic("get", 0));
  equal(child2, elem.tectonic("get", 1));
  equal(child3, elem.tectonic("get", 2));
});
test("#get should return the child at the specified index starting from the end when given index is negative", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(child3, elem.tectonic("get", -1));
  equal(child2, elem.tectonic("get", -2));
  equal(child1, elem.tectonic("get", -3));
});
test("#index should return the position of the specified element", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(0, elem.tectonic('index', child1));
  equal(1, elem.tectonic('index', child2));
  equal(2, elem.tectonic('index', child3));
});
test("#index should return the position of the first element encapsulated in a jQuery object", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(0, elem.tectonic('index', $(child1, child2)));
});

module("insertion");
test("#append should add an element to the end", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2]);
  elem.tectonic('append', child3);
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
});
test("#prepend should add an element to the start", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2]);
  elem.tectonic('prepend', child3);
  deepEqual(elem.children().toArray(), [child3, child1, child2]);
});
test("#insert should add an element at the specified position", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2]);
  elem.tectonic('insert', 1, child3);
  deepEqual(elem.children().toArray(), [child1, child3, child2]);
});
test("#insert should add elements at the specified position", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      child4 = $('<span id="child4"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2]);
  elem.tectonic('insert', 1, [child3, child4]);
  deepEqual(elem.children().toArray(), [child1, child3, child4, child2]);
});
test("#insert should add an element encapsulated in a jQuery object at the specified position", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2]);
  elem.tectonic('insert', 1, $(child3));
  deepEqual(elem.children().toArray(), [child1, child3, child2]);
});
test("#insert should move an element to the specified position when it already exists in the collection", function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('insert', 2, child1);
  deepEqual(elem.children().toArray(), [child2, child1, child3]);
});

module("removal");
test("#empty should remove all elements", 4, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('empty');
  deepEqual(elem.children().toArray(), []);
  deepEqual(elem.tectonic('all'), []);
  equal(0, elem.tectonic('length'));
});
test("#remove should remove the element at the specified position from the collection", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('remove', 1);
  deepEqual(elem.children().toArray(), [child1, child3]);
  elem.tectonic('remove', 0);
  deepEqual(elem.children().toArray(), [child3]);
});
test("#remove should remove the element at the specified position from the end of the collection when position is negative", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('remove', -2);
  deepEqual(elem.children().toArray(), [child1, child3]);
  elem.tectonic('remove', -1);
  deepEqual(elem.children().toArray(), [child1]);
});
test("#remove should remove the specified element from the collection", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('remove', child2);
  deepEqual(elem.children().toArray(), [child1, child3]);
  elem.tectonic('remove', child1);
  deepEqual(elem.children().toArray(), [child3]);
});
test("#remove should remove the specified element encapsulated in a jQuery object from the collection", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('remove', $(child2));
  deepEqual(elem.children().toArray(), [child1, child3]);
  elem.tectonic('remove', $(child1));
  deepEqual(elem.children().toArray(), [child3]);
});
test("#remove should remove an array of elements from the collection", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  deepEqual(elem.children().toArray(), [child1, child2, child3]);
  elem.tectonic('remove', [child1, child2]);
  deepEqual(elem.children().toArray(), [child3]);
});

module("selection");
test("#selectedIndex should return -1 when no element is selected", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('selectedIndex'));
});
test("#selectedIndex should return the position of the element that is selected", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 1});
  equal(1, elem.tectonic('selectedIndex'));
});
test("#selectedIndex should return -1 when the selected element doesn't exist", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 4});
  equal(-1, elem.tectonic('selectedIndex'));
});
test("#selectedIndex should return -1 when the selected element has been removed", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 1});
  equal(1, elem.tectonic('selectedIndex'));
  elem.tectonic('remove', child2);
  equal(-1, elem.tectonic('selectedIndex'));
});
test("set #selectedIndex to the position of an element", 4, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('selectedIndex'));
  elem.tectonic('selectedIndex', 1);
  equal(1, elem.tectonic('selectedIndex'));
  elem.tectonic('selectedIndex', 2);
  equal(2, elem.tectonic('selectedIndex'));
  elem.tectonic('selectedIndex', 0);
  equal(0, elem.tectonic('selectedIndex'));
});
test("set #selectedIndex to the position of an element that doesn't exist", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('selectedIndex'));
  elem.tectonic('selectedIndex', 4);
  equal(-1, elem.tectonic('selectedIndex'));
});
test("set #selectedIndex to null should set the selected index to -1", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('selectedIndex'));
  elem.tectonic('selectedIndex', -1);
  equal(-1, elem.tectonic('selectedIndex'));
});
test("#value should return null when no element is selected", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('selectedIndex'));
  equal(null, elem.tectonic('value'));
});
test("#value should return the element that is selected", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 1});
  equal(1, elem.tectonic('selectedIndex'));
  equal(child2, elem.tectonic('value'));
});
test("set #value to an element that exist", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(null, elem.tectonic('value'));
  elem.tectonic('value', child2);
  equal(child2, elem.tectonic('value'));
  equal(1, elem.tectonic('selectedIndex'));
});
test("set #value to an element encapsulated in a jQuery object that exist", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(null, elem.tectonic('value'));
  elem.tectonic('value', $(child2));
  equal(child2, elem.tectonic('value'));
  equal(1, elem.tectonic('selectedIndex'));
});
test("set #value to an element that doesn't exist", 3, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      other = $('<span id="other"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(null, elem.tectonic('value'));
  elem.tectonic('value', other);
  equal(null, elem.tectonic('value'));
  equal(-1, elem.tectonic('selectedIndex'));
});
test("#option selectedIndex should return -1 when no element is selected", 2, function() {
  var elem = $("<div></div>").tectonic();

  equal(-1, elem.tectonic('selectedIndex'));
  equal(-1, elem.tectonic('option', 'selectedIndex'));
});
test("#option selectedIndex should return the selected element's index", 4, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  equal(-1, elem.tectonic('option', 'selectedIndex'));
  elem.tectonic('option', 'selectedIndex', 1);
  equal(1, elem.tectonic('option', 'selectedIndex'));
  elem.tectonic('option', 'selectedIndex', 2);
  equal(2, elem.tectonic('option', 'selectedIndex'));
  elem.tectonic('option', 'selectedIndex', 0);
  equal(0, elem.tectonic('option', 'selectedIndex'));
});

module("events");
['select', 'add', 'remove', 'move'].forEach(function(eventType) {
  asyncTest("#" + eventType + " callback is triggered", 1, function() {
    var options = {}, elem;

    options[eventType] = function() {
      ok(true);
      start();
    };
    elem = $("<div></div>").tectonic(options);
    elem.data('tectonic')._trigger(eventType);
  });
  asyncTest("#tectonic" + eventType + " event is triggered", 1, function() {
    var elem = $("<div></div>").tectonic();
    elem.bind("tectonic" + eventType, function() {
      ok(true);
      start();
    });
    elem.data('tectonic')._trigger(eventType);
  });
});
asyncTest("#select event is triggered when an element is selected", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicselect', function() {
    ok(true);
    start();
  });
  elem.tectonic('value', child1);
});
asyncTest("#select event passes the selected element", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicselect', function(e, ui) {
    equal(child1, ui.item);
    start();
  });
  elem.tectonic('value', child1);
});
asyncTest("#select event passes null when no element is selected", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 0});
  elem.bind('tectonicselect', function(e, ui) {
    equal(null, ui.item);
    start();
  });
  elem.tectonic('value', null);
});
asyncTest("#select event passes the selected element's index", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicselect', function(e, ui) {
    equal(0, ui.index);
    start();
  });
  elem.tectonic('value', child1);
});
asyncTest("#select event passes an index of -1 when no element is selected", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic({selectedIndex: 0});
  elem.bind('tectonicselect', function(e, ui) {
    equal(-1, ui.index);
    start();
  });
  elem.tectonic('value', null);
});
asyncTest("#move is triggered when a element is moved", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicmove', function() {
    ok(true);
    start();
  });
  elem.tectonic('insert', 2, child1);
});
asyncTest("#move passes the element that was moved", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicmove', function(e, ui) {
    equal(child1, ui.item);
    start();
  });
  elem.tectonic('insert', 2, child1);
});
asyncTest("#move passes the element's index that was moved", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      child2 = $('<span id="child2"></span>').get(0),
      child3 = $('<span id="child3"></span>').get(0),
      elem = $("<div></div>").append(child1, child2, child3).tectonic();
  elem.bind('tectonicmove', function(e, ui) {
    equal(2, ui.index);
    start();
  });
  elem.tectonic('insert', 2, child1);
});
asyncTest("#add is triggered when a element is added", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").tectonic();
  elem.bind('tectonicadd', function() {
    ok(true);
    start();
  });
  elem.tectonic('append', child1);
});
asyncTest("#add passes the element that was added", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").tectonic();
  elem.bind('tectonicadd', function(e, ui) {
    equal(child1, ui.item);
    start();
  });
  elem.tectonic('append', child1);
});
asyncTest("#add passes the element's index that was added", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").tectonic();
  elem.bind('tectonicadd', function(e, ui) {
    equal(0, ui.index);
    start();
  });
  elem.tectonic('append', child1);
});
asyncTest("#remove is triggered when a element is removed", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").append(child1).tectonic();
  elem.bind('tectonicremove', function() {
    ok(true);
    start();
  });
  elem.tectonic('remove', child1);
});
asyncTest("#remove passes the element that was removed", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").append(child1).tectonic();
  elem.bind('tectonicremove', function(e, ui) {
    equal(child1, ui.item);
    start();
  });
  elem.tectonic('remove', child1);
});
asyncTest("#remove passes the element's index that was removed", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0),
      elem = $("<div></div>").append(child1).tectonic();
  elem.bind('tectonicremove', function(e, ui) {
    equal(0, ui.index);
    start();
  });
  elem.tectonic('remove', child1);
});

module('layout');
asyncTest("#setup is called when initialize", 1, function() {
  $("<div></div>").tectonic({
    layout: {
      setup: function() {
        ok(true);
        start();
      }
    }
  });
});
asyncTest("#setup is passed the widget element wrapped in a jQuery object", 2, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      setup: function(ui) {
        ok('jquery' in ui.element);
        equal(elem[0], ui.element[0]);
        start();
      }
    }
  });
});
asyncTest("#setup is passed an empty jQuery object when there's no selected element", 2, function() {
  $("<div></div>").tectonic({
    layout: {
      setup: function(ui) {
        ok('jquery' in ui.item);
        equal(0, ui.item.length);
        start();
      }
    }
  });
});
asyncTest("#setup is passed an index of -1 when there's no selected element", 1, function() {
  $("<div></div>").tectonic({
    layout: {
      setup: function(ui) {
        equal(-1, ui.index);
        start();
      }
    }
  });
});
asyncTest("#setup is passed the selected element wrapped in a jQuery object", 2, function() {
  var child1 = $('<span id="child1"></span>').get(0);
  $("<div></div>").append(child1).tectonic({
    selectedIndex: 0,
    layout: {
      setup: function(ui) {
        ok('jquery' in ui.item);
        equal(child1, ui.item[0]);
        start();
      }
    }
  });
});
asyncTest("#setup is passed the selected element's index", 1, function() {
  var child1 = $('<span id="child1"></span>').get(0);
  $("<div></div>").append(child1).tectonic({
    selectedIndex: 0,
    layout: {
      setup: function(ui) {
        equal(0, ui.index);
        start();
      }
    }
  });
});
asyncTest("#setup is called when layout is changed", 1, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      setup: function() {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('option', 'layout', {});
});
asyncTest("#teardown is called when layout is changed", 1, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      teardown: function() {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('option', 'layout', {});
});
asyncTest("#teardown is passed the widget element wrapped in a jQuery object", 2, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      teardown: function(ui) {
        ok('jquery' in ui.element);
        equal(elem[0], ui.element[0]);
        start();
      }
    }
  });
  elem.tectonic('option', 'layout', {});
});
asyncTest("#insert is called when inserting a element", 1, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('append', '<span></span>');
});
asyncTest("#insert is passed the widget element as a jQuery object", 2, function() {
  var elem = $("<div></div>");
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        ok('jquery' in ui.element);
        equal(elem[0], ui.element[0]);
        start();
      }
    }
  });
  elem.tectonic('append', '<span></span>');
});
asyncTest("#insert is passed the added element encapsulated in a jQuery object", 2, function() {
  var elem = $("<div></div>"),
      child1 = $('<span></span>').get(0);
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        ok('jquery' in ui.item);
        equal(child1, ui.item[0]);
        start();
      }
    }
  });
  elem.tectonic('append', child1);
});
asyncTest("#insert is passed the position of the added element", 1, function() {
  var elem = $("<div></div>"),
      child1 = $('<span></span>').get(0);
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        equal(0, ui.index);
        start();
      }
    }
  });
  elem.tectonic('append', child1);
});
test("returning true in #insert should include the item in the collection", 2, function() {
  var elem = $("<div></div>"),
      child1 = $('<span></span>').get(0);
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        return true;
      }
    }
  });
  deepEqual(elem.tectonic('all'), []);
  elem.tectonic('append', child1);
  deepEqual(elem.tectonic('all'), [child1]);
});
asyncTest("firing the callback in #insert should include the item in the collection", 2, function() {
  var elem = $("<div></div>"),
      child1 = $('<span></span>').get(0);
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        callback();
      }
    }
  });
  deepEqual(elem.tectonic('all'), []);
  elem.bind('tectonicadd', function() {
    deepEqual(elem.tectonic('all'), [child1]);
    start();
  });
  elem.tectonic('append', child1);
});
test("not returning true or firing the callback in #insert cancels the inclusion of the item in the collection", 2, function() {
  var elem = $("<div></div>"),
      child1 = $('<span></span>').get(0);
  elem.tectonic({
    layout: {
      insert: function(ui, callback) {
        // nope
      }
    }
  });
  deepEqual(elem.tectonic('all'), []);
  elem.tectonic('append', child1);
  deepEqual(elem.tectonic('all'), []);
});
asyncTest("#remove is called when removing an element", 1, function() {
  var child1 = $("<span></span>"),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('remove', child1);
});
asyncTest("#remove is passed the removed element encapsulated in a jQuery object", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        ok('jquery' in ui.item);
        equal(child1, ui.item[0]);
        start();
      }
    }
  });
  elem.tectonic('remove', child1);
});
asyncTest("#remove is passed the position of the removed element", 1, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        equal(0, ui.index);
        start();
      }
    }
  });
  elem.tectonic('remove', child1);
});
test("returning true in #remove should remove the element from the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        return true;
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1]);
  elem.tectonic('remove', child1);
  deepEqual(elem.tectonic('all'), []);
});
asyncTest("firing callback in #remove should remove the element from the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        callback();
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1]);
  elem.bind('tectonicremove', function() {
    deepEqual(elem.tectonic('all'), []);
    start();
  });
  elem.tectonic('remove', child1);
});
test("not returning true or firing callback in #remove should cancel removing the element from the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      remove: function(ui, callback) {
        // nope
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1]);
  elem.tectonic('remove', child1);
  deepEqual(elem.tectonic('all'), [child1]);
});
asyncTest("#move is called when inserting a element", 1, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('insert', 1, child1);
});
asyncTest("#move is passed the widget element as a jQuery object", 2, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        ok('jquery' in ui.element);
        equal(elem[0], ui.element[0]);
        start();
      }
    }
  });
  elem.tectonic('insert', 1, child1);
});
asyncTest("#move is passed the moved element encapsulated in a jQuery object", 2, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        ok('jquery' in ui.item);
        equal(child1, ui.item[0]);
        start();
      }
    }
  });
  elem.tectonic('insert', 1, child1);
});
asyncTest("#move is passed the position of the moved element", 1, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        equal(1, ui.index);
        start();
      }
    }
  });
  elem.tectonic('insert', 1, child1);
});
test("returning true in #move should move the item in the collection", 2, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        return true;
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1, child2]);
  elem.tectonic('insert', 1, child1);
  deepEqual(elem.tectonic('all'), [child2, child1]);
});
asyncTest("firing the callback in #move should move the item in the collection", 2, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        callback();
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1, child2]);
  elem.bind('tectonicmove', function() {
    deepEqual(elem.tectonic('all'), [child2, child1]);
    start();
  });
  elem.tectonic('insert', 1, child1);
});
test("not returning true or firing the callback in #move cancels the inclusion of the item in the collection", 2, function() {
  var child1 = $('<span></span>').get(0),
      child2 = $('<span></span>').get(0),
      elem = $("<div></div>").append(child1, child2);
  elem.tectonic({
    layout: {
      move: function(ui, callback) {
        // nope
      }
    }
  });
  deepEqual(elem.tectonic('all'), [child1, child2]);
  elem.tectonic('insert', 1, child1);
  deepEqual(elem.tectonic('all'), [child1, child2]);
});
asyncTest("#select is called when selecting an element", 1, function() {
  var child1 = $("<span></span>"),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        ok(true);
        start();
      }
    }
  });
  elem.tectonic('value', child1);
});
asyncTest("#select is passed the selected element encapsulated in a jQuery object", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        ok('jquery' in ui.item);
        equal(child1, ui.item[0]);
        start();
      }
    }
  });
  elem.tectonic('value', child1);
});
asyncTest("#select is passed the position of the selected element", 1, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        equal(0, ui.index);
        start();
      }
    }
  });
  elem.tectonic('value', child1);
});
test("returning true in #select should select the element in the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        return true;
      }
    }
  });
  equal(null, elem.tectonic('value'));
  elem.tectonic('value', child1);
  equal(child1, elem.tectonic('value'));
});
asyncTest("firing callback in #select should select the element in the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        callback();
      }
    }
  });
  equal(null, elem.tectonic('value'));
  elem.bind('tectonicselect', function() {
    equal(child1, elem.tectonic('value'));
    start();
  });
  elem.tectonic('value', child1);
});
test("not returning true or firing callback in #select should cancel selecting the element in the collection", 2, function() {
  var child1 = $("<span></span>").get(0),
      elem = $("<div></div>").append(child1);
  elem.tectonic({
    layout: {
      select: function(ui, callback) {
        // nope
      }
    }
  });
  equal(null, elem.tectonic('value'));
  elem.tectonic('value', child1);
  equal(null, elem.tectonic('value'));
});

module("clean up");
test("#destroy should remove data", 2, function() {
  var elem = $("<div></div>").tectonic();
  notEqual(null, elem.data('tectonic'));
  elem.tectonic('destroy');
  equal(null, elem.data('tectonic'));
});