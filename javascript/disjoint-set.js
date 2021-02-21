// https://en.wikipedia.org/wiki/Disjoint-set_data_structure

// A Disjoint-Set is a data structure that stores a collection of disjoint
// (non-overlapping) sets.

// It supports three operations:
// -- making a new set containing a new element
// -- merging two sets (by replacing them with their union)
// -- finding the representative member of the set containing a given element (efficiently determines whether two elements are in the same set or not)

// A disjoint-set forest is an implementation of the disjoint-set data structure.
// Each node in a disjoint-set forest consists of a pointer and some auxillary information, either a size or a rank (but not both).
// The pointers are used to make parent pointer trees, where each node that is not the root of a tree points to its parent.
// To distinguish root nodes from others, their parent pointers have invalid values, such as a circular reference to the node, or a sentinel value.
// Each tree represents a set stored in the forest, with the members of the set as the nodes in the tree.
// Root nodes provide set representatives: two nodes are in the same set if and only if the roots of the trees containing the nodes are equal.

// Nodes in the forest can be stored in any way convenient to the application, but a common technique is to store them in an array.
// In an array, parents can be indicated by their array index.
// Every array entry requires a minimum of O(lg n) bits of storage for the parent pointer.
// A comparable or lesser amount of storage is required for the rest of the entry, so the number of bits required to store the forest is  O(n lg n).
// If an implementation uses fixed size nodes (thereby limiting the maximum size of the forest that can be stored), then the necessary storage is linear O(n).

// https://github.com/manubb/union-find

// returns an object with two properties: `rank` and `parent`
// add other properties during implementation
// is `node` the root of a tree? `node.parent === node`
const makeSet = () => {
  const node = { rank: 0 };
  node.parent = node;
  return node;
};

// returns the root of the tree containing `node`
// are `node1` and `node2` in the same tree? `find(node1) === find(node2)`
const find = (node) => {
  if (node.parent !== node) {
    node.parent = find(node.parent);
  }
  return node.parent;
};

// merges the sets containing `node1` and `node2`
// returns undefined
const union = (node1, node2) => {
  const root1 = find(node1);
  const root2 = find(node2);
  if (root1 !== root2) {
    if (root1.rank < root2.rank) {
      root1.parent = root2;
    } else {
      root2.parent = root1;
      if (root1.rank === root2.rank) root1.rank++;
    }
  }
};

// exports.makeSet = makeSet;
// exports.find = find;
// exports.union = union;
