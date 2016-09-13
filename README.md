# Skeleton Key

_A simple object hash generator_

[![Build Status](https://travis-ci.org/elliotttf/skeleton-key.svg?branch=master)](https://travis-ci.org/elliotttf/skeleton-key)

This module will allow you to generate object hashes from a collection of values.
The values can be inserted in any order and as long as they are equal a matching
cache key can be generated.

A common use case is cache key generation, where user input may dictate the
conditions for the cached data. For example, a HTTP request to:

`/users?filter[name]=sally&filter[occupation]=engineer`

will yeild the same result as

`/users?filter[occupation]=engineer&filter[name]=sally`

but simply caching the request URI would result in two separate entries.

## Usage

```javascript
const SkeletonKey = require('skeleton-key');

route.use((req, res, next) => {
  // Generate a cache key composed of the path and the filter.
  const key = new SkeletonKey();
  key.setNotch('path', req.path);
  key.setNotch('filter', req.query.filter);
  req.cacheKey = key.cut();
  next();
});
```

Now variance in the order of the filter query won't affect the cache key.

You can also sort an array of values on add if the values are more important
than the order to ensure consistency between keys, e.g.

```javascript
key.setNotch('fields', ['name', 'occupation', 'birthday'], true);
```

would generate the same notch as

```javascript
key.setNotch('fields', ['occupation', 'name', 'birthday'], true);
```

## API

* `resetKey()` - Removes all notches from the key.
* `setNotch(id, notch[, sort, [comparator]])` - Adds a notch to the key or
  replaces an existing notch.
   * id - The notch ID to set or replace.
   * notch - The notch to add to the key.
   * sort - A flag on whether or not the notch value should be sorted
     before saving it to the key. This can be used to guarantee
     consistency between keys when the order is not important but
     the values are.
   * comparator - An optional comparison function to use when sorting arrays.
* `getNotch` - Gets the value of a given notch in the key.
   * id - The notch ID to get.
* `removeNotch` - Removes a notch from the key.
   * id - The notch ID to remove from the key.
* `cut` - Cuts the key, generating a MD5 hash of the map.

