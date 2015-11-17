'use strict';

var checkMethods = {
    containsKeys: function (keys) {
        if (!(isArray(this) || isObject(this))) {
            return undefined;
        }
        var objKeys = getKeysWithoutType(this);
        return isInList(keys, objKeys);
    },
    hasKeys: function (keys) {
        if (!(isArray(this) || isObject(this))) {
            return undefined;
        }
        var objKeys = getKeysWithoutType(this);
        if (objKeys.length == keys.length) {
            return isInList(keys, objKeys);
        }
        return false;
    },
    containsValues: function (values) {
        if (!(isArray(this) || isObject(this))) {
            return undefined;
        }
        var objValues = getValuesWithoutType(this);
        return isInList(values, objValues);
    },
    hasValues: function (values) {
        if (!(isArray(this) || isObject(this))) {
            return undefined;
        }
        var objValues = getValuesWithoutType(this);
        if (objValues.length == values.length) {
            return isInList(values, objValues);
        }
        return false;
    },
    hasValueType: function (key, type) {
        if (!(isArray(this) || isObject(this))) {
            return undefined;
        }
        var keys = getKeysWithoutType(this);
        var values = getValuesWithoutType(this);
        var index = keys.indexOf(key);
        return typeof values[index] === typeof type();
    },
    hasLength: function (length) {
        if (!(isArray(this) || isString(this))) {
            return undefined;
        }
        return length == this.length;
    },
    hasParamsCount: function (count) {
        if (!isFunction(this)) {
            return undefined;
        }
        return count == this.length;
    },
    hasWordsCount: function (count) {
        if (!isString(this)) {
            return undefined;
        }
        return count == this.split(' ').length;
    }
};

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            var result = {};
            for (var method in checkMethods) {
                if (isFunction(checkMethods[method])) {
                    result[method] = checkMethods[method].bind(this);
                }
            }
            result.not = {};
            var methodsCheck = getNotMethods(checkMethods);
            for (var method in methodsCheck.not) {
                result.not[method] = methodsCheck.not[method].bind(this);
            }
            return result;
        }
    });
};

module.exports.wrap = function (obj) {
    if (!isNull.bind(obj)()) {
        return exports.init.bind(obj)();
    }
    return {
        isNull: isNull
    };
};

function isNull() {
    return this == null;
}

function getNotMethods(methods) {
    methods.not = {};
    for (var method in checkMethods) {
        if (checkMethods.hasOwnProperty(method)) {
            methods.not[method] = function () {
                return !checkMethods[method].bind(this)();
            }.bind(this);
        }
    }
    return methods;
}

function isInList(list1, list2) {
    for (var item in list1) {
        if (list2.indexOf(list1[item]) == -1) {
            return false;
        }
    }
    return true;
}

function getKeysWithoutType(obj) {
    var objKeys = Object.keys(obj);
    if (isArray(obj)) {
        objKeys = [];
        for (var item in obj) {
            objKeys.push(item);
        }
    }
    return objKeys;
}

function getValuesWithoutType(obj) {
    var values = [];
    if (isArray(obj)) {
        values = obj;
    } else {
        values = getObjectValues(obj);
    }
    return values;
}

function getObjectValues(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
}

function isFunction(obj) {
    return Object.getPrototypeOf(obj) == Function.prototype;
}

function isArray(obj) {
    return Object.getPrototypeOf(obj) == Array.prototype;
}

function isObject(obj) {
    return Object.getPrototypeOf(obj) == Object.prototype;
}

function isString(obj) {
    return Object.getPrototypeOf(obj) == String.prototype;
}
