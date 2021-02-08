const Gem = function (letter, id) {
  ////////////////////////////////////////////////
  // GEM PROPERTIES

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
