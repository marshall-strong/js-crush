const Gem = function (letter, id) {
  // immutable data descriptors
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
  // mutable data descriptors
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
