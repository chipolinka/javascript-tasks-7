'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            var methodsCheck = getCheckMethods.bind(this)();
            for (var method in methodsCheck) {
                methodsCheck[method] = methodsCheck[method].bind(this);
            }
            methodsCheck = getNotMethods.bind(this)(methodsCheck);
            for (var method in methodsCheck.not) {
                methodsCheck.not[method] = methodsCheck.not[method].bind(this);
            }
            return methodsCheck;
        }
    });
    return this;
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

function getCheckMethods() {
    var methods = {
        containsKeys: function (keys) {
            if (!isCorrectPrototype(this, [Array.prototype, Object.prototype])) {
                return undefined;
            }
            var objKeys = getKeysWithoutType(this);
            return isInList(keys, objKeys);
        },

        hasKeys: function (keys) {
            if (!isCorrectPrototype(this, [Array.prototype, Object.prototype])) {
                return undefined;
            }
            var objKeys = getKeysWithoutType(this);
            if (objKeys.length == keys.length) {
                return isInList(keys, objKeys);
            }
            return false;
        },

        containsValues: function (values) {
            if (!isCorrectPrototype(this, [Array.prototype, Object.prototype])) {
                return undefined;
            }
            var objValues = getValuesWithoutType(this);
            return isInList(values, objValues);
        },

        hasValues: function (values) {
            if (!isCorrectPrototype(this, [Array.prototype, Object.prototype])) {
                return undefined;
            }
            var objValues = getValuesWithoutType(this);
            if (objValues.length == values.length) {
                return isInList(values, objValues);
            }
            return false;
        },

        hasValueType: function (key, type) {
            if (!isCorrectPrototype(this, [Array.prototype, Object.prototype])) {
                return undefined;
            }
            var keys = getKeysWithoutType(this);
            var values = getValuesWithoutType(this);
            var index = keys.indexOf(key);
            return typeof values[index] === typeof type();
        },

        hasLength: function (length) {
            if (!isCorrectPrototype(this, [Array.prototype, String.prototype])) {
                return undefined;
            }
            return length == this.length;
        },

        hasParamsCount: function (count) {
            if (!isCorrectPrototype(this, [Function.prototype])) {
                return undefined;
            }
            return count == this.length;
        },

        hasWordsCount: function (count) {
            if (!isCorrectPrototype(this, [String.prototype])) {
                return undefined;
            }
            return count == this.split(' ').length;
        }
    };
    return methods;
}

function getNotMethods(methods) {
    methods.not = {
        containsKeys: function (keys) {
            return !getCheckMethods().containsKeys.bind(this)(keys);
        },
        hasKeys: function (keys) {
            return !getCheckMethods().hasKeys.bind(this)(keys);
        },
        containsValues: function (values) {
            return !getCheckMethods().containsValues.bind(this)(values);
        },
        hasValues: function (values) {
            return !getCheckMethods().hasValues.bind(this)(values);
        },
        hasValueType: function (key, type) {
            return !getCheckMethods().hasValueType.bind(this)(key, type);
        },
        hasLength: function (length) {
            return !getCheckMethods().hasLength.bind(this)(length);
        },
        hasParamsCount: function (count) {
            return !getCheckMethods().hasParamsCount.bind(this)(count);
        },
        hasWordsCount: function (count) {
            return !getCheckMethods().hasWordsCount.bind(this)(count);
        }
    };
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
    if (Object.getPrototypeOf(obj) == Array.prototype) {
        objKeys = [];
        for (var item in obj) {
            objKeys.push(item);
        }
    }
    return objKeys;
}

function getValuesWithoutType(obj) {
    var values = [];
    if (Object.getPrototypeOf(obj) == Array.prototype) {
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

function isCorrectPrototype(obj, corrects) {
    if (corrects.indexOf(Object.getPrototypeOf(obj)) == -1) {
        return false;
    }
    return true;
}
