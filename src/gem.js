const Gem = function (letter, id) {
  // data descriptors -- immutable
  Object.defineProperty(this, "letter", {
    enumberable: false,
    configurable: false,
    writable: false,
    value: letter,
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
};

Gem.letters = ["gemA", "gemB", "gemC", "gemD", "gemE", "gemF"];
