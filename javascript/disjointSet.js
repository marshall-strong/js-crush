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

class DisjointSet {
  constructor() {}
}
