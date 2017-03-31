'use strict';
const { sha1, MD5 } = require('object-hash');

/**
 * @class
 */
class SkeletonKey {
  /**
   * @constructor
   *
   * @param {string} algo
   *   The hashing algorithm to use, MD5 or sha1. Defaults to sha1.
   */
  constructor(algo = 'sha1') {
    if (algo !== 'sha1' && algo !== 'MD5') {
      throw new Error('Hash algorithm must be sha1 or MD5');
    }

    this.key = new Map();
    this.algo = algo;
  }

  /**
   * Removes all notches from the key.
   *
   * @return {undefined}
   */
  resetKey() {
    this.key.clear();
  }

  /**
   * Adds a notch to the key or replaces an existing notch.
   *
   * @param {string} id
   *   The notch ID to set or replace.
   * @param {*} notch
   *   The notch to add to the key.s
   * @param {boolean} sort
   *   A flag on whether or not the notch value should be sorted
   *   before saving it to the key. This can be used to guarantee
   *   consistency between keys when the order is not important but
   *   the values are.
   * @param {function} comparator
   *   An optional comparison function to use when sorting arrays.
   *
   * @return {undefined}
   */
  setNotch(id, notch, sort = false, comparator) {
    if (sort && Array.isArray(notch)) {
      this.key.set(id, notch.sort(comparator));
    }
    else {
      this.key.set(id, notch);
    }
  }

  /**
   * Gets the value of a given notch in the key.
   *
   * @param {string} id
   *   The notch ID to get.
   *
   * @return {*}
   *   The notch value.
   */
  getNotch(id) {
    return this.key.get(id);
  }

  /**
   * Removes a notch from the key.
   *
   * @param {string} id
   *   The notch ID to remove from the key.
   *
   * @return {undefined}
   */
  removeNotch(id) {
    this.key.delete(id);
  }

  /**
   * Cuts the key, generating a MD5 hash of the map.
   *
   * @return {string}
   *   The hashed representation of the key.
   */
  cut() {
    if (this.algo === 'MD5') {
      return MD5(this.key); // eslint-disable-line new-cap
    }
    return sha1(this.key); // eslint-disable-line new-cap
  }
}

module.exports = SkeletonKey;

