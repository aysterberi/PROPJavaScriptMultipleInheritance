function createClass(className, superClassList) {
    this.className = className;
    this.superClassList = superClassList;

}

createClass.new = function () {
    var instanceObject = {
        call: function (funcName, parameters) {
            if (funcName in this)
                return this[funcName].apply(null, parameters);
            else if (this.prototypeList != null)
                for (var i = 0; i < this.prototypeList.length; i++) {
                    if ("call" in this.prototypeList[i]) {
                        var found = this.prototypeList[i].call(funcName, parameters);
                        if (found != null)
                            return found;
                    }
                }
            return null;
        }
    }
};


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