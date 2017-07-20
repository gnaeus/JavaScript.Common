(function() {
  "use strict";

  function _define(name, method) {
    if (!Array.prototype[name]) {
      Object.defineProperty(Array.prototype, name, {
        enumerable: false,
        configurable: false,
        value: method,
        writeable: false
      });
    } else if (Array.prototype[name].toString() !== method.toString()) {
      throw new TypeError("Array.prototype." + name + " is redefined by another script");
    }
  }

  _define("groupBy", groupBy);
  _define("orderBy", orderBy);
  _define("toDictionary", toDictionary);
  _define("toLookup", toLookup);
  _define("updateFrom", updateFrom);

  function groupBy(keySelector, thisArg) {
    var hashTable = Object.create(null);
    var arrayLength = this.length;
    var groups = [];

    for (var i = 0; i < arrayLength; i++) {
      var element = this[i];
      var key = keySelector.call(thisArg, element, i, this);
      var bucket = hashTable[key] || (hashTable[key] = []);
      bucket.push({
        key: key,
        element: element
      });
    }

    for (var hashKey in hashTable) {
      var bucket = hashTable[hashKey];
      var bucketLength = bucket.length;
      var startLength = groups.length;

      for (var i = 0; i < bucketLength; i++) {
        var entry = bucket[i];
        var key = entry.key;
        var element = entry.element;
        var groupsLength = groups.length;
        var group;

        for (var j = startLength; j < groupsLength; j++) {
          group = groups[j];
          if (group.key === key) {
            group.push(element);
            break;
          }
        }
        if (j === groupsLength) {
          group = [element];
          Object.defineProperty(group, "key", {
            enumerable: false,
            value: key
          });
          groups.push(group);
        }
      }
    }
    return groups;
  }

  function orderBy(callback, sortOrder, thisArg) {
    return this.slice(0).sort(
      sortOrder === "desc"
        ? function(left, right) {
            var l = callback.call(thisArg, left);
            var r = callback.call(thisArg, right);
            return l < r ? 1 : l > r ? -1 : 0;
          }
        : function(left, right) {
            var l = callback.call(thisArg, left);
            var r = callback.call(thisArg, right);
            return l < r ? -1 : l > r ? 1 : 0;
          }
    );
  }

  function toDictionary(keySelector, thisArg) {
    var dict = Object.create(null);
    var length = this.length;

    for (var i = 0; i < length; i++) {
      var element = this[i];
      var key = keySelector.call(thisArg, element, i, this);
      dict[key] = element;
    }
    return dict;
  }

  function toLookup(keySelector, thisArg) {
    var lookup = Object.create(null);
    var length = this.length;

    for (var i = 0; i < length; i++) {
      var element = this[i];
      var key = keySelector.call(thisArg, element, i, this);
      var group = lookup[key] || (lookup[key] = []);
      group.push(element);
    }
    return lookup;
  }

  function updateFrom(models) {
    if (models == null) {
      models = [];
    }

    var entities = this;

    return {
      withKeys: function (modelKeySelector, entityKeySelector) {
        return {
          mapValues: function (mapModelToEntity) {
            var modelsLength = models.length;
            var entitiesLength = entities.length;
            var entityLookup = Object.create(null);
            
            for (var i = 0; i < entitiesLength; i++) {
              var entity = entities[i];
              var key = entityKeySelector(entity, i);
              entityLookup[key] = entity;
            }

            entities.length = 0;

            for (var i = 0; i < modelsLength; i++) {
              var model = models[i];
              var key = modelKeySelector(model, i);
              var entity = entityLookup[key];

              entities.push(mapModelToEntity(model, entity));
            }

            return entities;
          }
        };
      },
    };
  }
})();
