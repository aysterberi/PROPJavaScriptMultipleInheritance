function createClass(className, superClassList) {
    this.className = className;
    this.superClassList = superClassList;
    this.new = function () {
        return Object.create(this);
    };
    this.call = function (funcName, parameters) {
        if (this.hasOwnProperty(funcName))
            return this[funcName].apply(null, parameters);
        else if (this.superClassList != null) {
            for (var i = 0; i < this.superClassList.length; i++) {
                if ("call" in this.superClassList[i]) {
                    var found = this.superClassList[i].call(funcName, parameters);
                    if (found != null)
                        return found;
                }
            }
            return null;
        }
    };
    return this.new();
}

/* Test from Beatrice, should output: "func0: hello" */
var class0 = createClass("Class0", null);
class0.func = function (arg) {
    return "func0: " + arg;
};
var class1 = createClass("Class1", [class0]);
var class2 = createClass("Class2", []);
class2.func = function (arg) {
    return "func2: " + arg;
};
var class3 = createClass("Class3", [class1, class2]);
var obj3 = class3.new();
var result = obj3.call("func", ["hello"]);
document.writeln(result);