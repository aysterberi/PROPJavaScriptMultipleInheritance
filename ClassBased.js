function createClass (className, superClassList) {

}
createClass.new = function () {

};

/* Test from Beatrice, should output: "func0: hello" */
const class0 = createClass("Class0", null);
class0.func = function(arg) { return "func0: " + arg; };
const class1 = createClass("Class1", [class0]);
const class2 = createClass("Class2", []);
class2.func = function(arg) { return "func2: " + arg; };
const class3 = createClass("Class3", [class1, class2]);
const obj3 = class3.new();
const result = obj3.call("func", ["hello"]);