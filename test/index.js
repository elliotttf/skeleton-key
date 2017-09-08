'use strict';

const SkeletonKey = require('../');

module.exports = {
  setUp(cb) {
    this.key = new SkeletonKey();
    cb();
  },
  invalidAlgo(test) {
    test.expect(1);
    test.throws(() => new SkeletonKey('junk'), 'Invalid algorithm did not throw.');
    test.done();
  },
  resetKey(test) {
    test.expect(1);
    this.key.setNotch('test', 'test');
    this.key.resetKey();
    test.equal('undefined', typeof this.key.getNotch('test'), 'Key not reset.');
    test.done();
  },
  setNotch: {
    simple(test) {
      test.expect(1);
      this.key.setNotch('test', 'test');
      test.equal('test', this.key.getNotch('test'), 'Notch not set.');
      test.done();
    },
    sorted(test) {
      test.expect(1);
      this.key.setNotch('test', [3, 2, 1], true);
      test.deepEqual([1, 2, 3], this.key.getNotch('test'), 'Notch not sorted.');
      test.done();
    },
    withComparator(test) {
      test.expect(1);
      this.key.setNotch('test', [1, 2, 3], true, (a, b) => (a > b ? -1 : 1));
      test.deepEqual([3, 2, 1], this.key.getNotch('test'), 'Notch not sorted.');
      test.done();
    },
  },
  getNotch(test) {
    test.expect(1);
    this.key.setNotch('test', 'test');
    test.equal('test', this.key.getNotch('test'), 'Notch not returned.');
    test.done();
  },
  removeNotch(test) {
    test.expect(1);
    this.key.setNotch('test', 'test');
    this.key.removeNotch('test');
    test.equal('undefined', typeof this.key.getNotch('test'), 'Notch not removed.');
    test.done();
  },
  cut: {
    md5: {
      setUp(cb) {
        this.key = new SkeletonKey('MD5');
        cb();
      },
      simple(test) {
        test.expect(1);
        this.key.setNotch('test', 'test');
        test.equal('1b8d136b7e8c2abd66fb08f6b115b62e', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
      withObjects(test) {
        test.expect(2);
        this.key.setNotch('test', { a: 1, b: 2 });
        test.equal('a423fe10cbb06863a07d44ac5d2168df', this.key.cut(), 'Unexpected hash.');
        this.key.setNotch('test', { b: 2, a: 1 });
        test.equal('a423fe10cbb06863a07d44ac5d2168df', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
      withSortedArrays(test) {
        test.expect(2);
        this.key.setNotch('test', [1, 2, 3]);
        test.equal('21c354dd04e7aac0afc8e3e3693bba80', this.key.cut(), 'Unexpected hash.');
        this.key.setNotch('test', [3, 2, 1], true);
        test.equal('21c354dd04e7aac0afc8e3e3693bba80', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
    },
    sha1: {
      simple(test) {
        test.expect(1);
        this.key.setNotch('test', 'test');
        test.equal('7d3f2d06db1886a07d65c4f4301bf2e677a1d79d', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
      withObjects(test) {
        test.expect(2);
        this.key.setNotch('test', { a: 1, b: 2 });
        test.equal('90a2ea7a92789cb4100fb704513a3748918495f7', this.key.cut(), 'Unexpected hash.');
        this.key.setNotch('test', { b: 2, a: 1 });
        test.equal('90a2ea7a92789cb4100fb704513a3748918495f7', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
      withSortedArrays(test) {
        test.expect(2);
        this.key.setNotch('test', [1, 2, 3]);
        test.equal('4ad0e47555126079c97876aebd385b43b7059610', this.key.cut(), 'Unexpected hash.');
        this.key.setNotch('test', [3, 2, 1], true);
        test.equal('4ad0e47555126079c97876aebd385b43b7059610', this.key.cut(), 'Unexpected hash.');
        test.done();
      },
    },
  },
};

