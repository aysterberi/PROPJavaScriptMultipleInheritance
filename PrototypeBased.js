var myObject = {};

myObject.prototypeList = null;

myObject.call = function (functionName, parameters) {
    // TODO: Remove all these comments before submitting
    // for (var name in this)
    //     if (name == functionName)
    //         return this[name].apply(null, parameters);

    /* Kan inte bedöma om den övre och den undre fungerar på samma sätt */
    /* Det borde vara samma eftersom den övre loopar igenom och kollar
     * efter funktionsnamnet, medan den undre frågar klassen om den har det
     * funktionsnamnet bara? */

    if (this.hasOwnProperty(functionName))
        return this[functionName].apply(null, parameters);

    for (var i = 0; i < this.ancestors.length; i++)
        return this.ancestors[i].length != 0 ? this.ancestors[i].call(functionName, parameters) : null;
};

myObject.create = function (prototypeList) {
    var obj = Object.create(this);
    obj.ancestors = [];
    if (prototypeList == null)
        return obj;
    for (var j = 0; j < prototypeList.length; j++)
        obj.ancestors[j] = prototypeList[j]
    return obj;
};

/* Test from Beatrice, should output: "func0: hello" */
var obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
console.log(obj0.func());
var obj1 = myObject.create([obj0]);
var obj2 = myObject.create([]);
obj2.func = function(arg) { return "func2: " + arg; };
console.log(obj2.func());
var obj3 = myObject.create([obj1, obj2]);
var result = obj3.call("func", ["hello"]);
console.log(result);

// TESTS

console.log("Running tests…");
CyclicInheritanceShouldBePrevented = function () {
    //cyclic inheritance test
    console.log("\tCyclicInheritanceShouldBePrevented");
    var testObj = myObject.create(null);
    testObj.ancestors = [testObj, obj0, obj2];
    assertEquals(undefined, testObj);
};

UndefinedFunctionShouldBeUndefined = function () {
    //undefined test
    console.log("\tUndefinedFunctionShouldBeUndefined");
    var testObj = myObject.create(null);
    assertEquals(undefined, testObj.call("NonexistentFunc", []));
};

DiamondProblemShouldBePrevented = function () {
    console.log("\tDiamondProblemShouldBePrevented");
    var count = 0;
    var Movable = myObject.create(null);
    var Aeroplane = myObject.create([Movable]);
    var LandVehicle = myObject.create([Movable]);
    var AeroCar = myObject.create([LandVehicle, Aeroplane]); //"extends LandVehicle…"
    //this function should only be called once
    Movable.accelerate = function (speed) {
        count++;
    };
    AeroCar.call('accelerate', [90.0]);
    assertEquals(1, count);

};

runAllTests = function () {
    DiamondProblemShouldBePrevented();
    CyclicInheritanceShouldBePrevented();
    UndefinedFunctionShouldBeUndefined();
};

runAllTests();

//helper utils
function assertEquals(expected, actual) {
    if (expected == actual) {
        console.log("\t\tOK.");
        return true;
    }
    console.log("\t\tAssertionError:\tExpected '" + expected + "' but got '" + actual + "'.");
    return false;
}

document.writeln(result);

