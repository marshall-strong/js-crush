const Gem = function (color, id) {
  // data descriptors -- immutable
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
  // data descriptors -- mutable
  Object.defineProperty(this, "row", {
    enumberable: false,
    configurable: true,
    writable: true,
    value: null,
  });
  Object.defineProperty(this, "col", {
    enumberable: false,
    configurable: true,
    writable: true,
    value: null,
  });

  this.toString = function () {
    return this.color[-1];
  };
};

Gem.colors = ["gemA", "gemB", "gemC", "gemD", "gemE", "gemF"];
