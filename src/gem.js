const Gem = function (color, id) {
  // immutable properties
  Object.defineProperty(this, "color", {
    enumberable: false,
    configurable: false,
    writable: false,
    value: color,
  });
  Object.defineProperty(this, "id", {
    enumberable: false,
    configurable: false,
    writable: false,
    value: id,
  });

  // mutable properties
  this.row = null;
  this.col = null;

  this.toString = function () {
    const name = this.color;
    return name;
  };
};

Gem.colors = ["red", "yellow", "green", "orange", "blue", "purple"];
