const Gem = function(color, id) {
  // immutable properties
  Object.defineProperty(this, 'color', {value: color, writable: false});
  Object.defineProperty(this, 'id', {value: id, writable: false});

  // mutable properties
  this.row = null;
  this.col = null;

  this.toString = function() {
    const name = this.color;
    return name;
  }
};

Gem.colors = [
  'red',
  'yellow',
  'green',
  'orange',
  'blue',
  'purple'
];
