var myObject = {};

//myObject.prototypeList = null;


myObject.create = function (prototypeList) {
    var obj = Object.create(this);
    obj.ancestors = [];
    if (prototypeList == null) {
        Object.defineProperty(obj, "ancestors", {
            value: undefined,
            writable: false
        });
    } else {

        //continue to build object and lock the property
        Object.defineProperty(obj, "ancestors", {
            value: prototypeList,
            writable: false
        });
    }
    obj.call = function (functionName, parameters) {
        if (obj.hasOwnProperty(functionName))
            return this[functionName].apply(null, parameters);

        function dothetrickypart(theobj) {
            var result;
            var count=0;
            if (theobj.hasOwnProperty(functionName)) {
                result = theobj[functionName];
            }
            if (theobj.ancestors != undefined || theobj.ancestors != null) {
                //iterate through ancestors to see if we can spot
                //our function
                while ((result == undefined) && (count < theobj.ancestors.length)) {
                    result = dothetrickypart(theobj.ancestors[count++]);
                }
            }
            return result;
        }
        var objFunction = dothetrickypart(this);
        if (objFunction != undefined) {
            return objFunction.apply(null, parameters);
        }
        return undefined;
    };
    return obj;
};

/* Test from Beatrice, should output: "func0: hello" */
var obj0 = myObject.create(null);
obj0.func = function (arg) {
    return "func0: " + arg;
};
console.log(obj0.func());
var obj1 = myObject.create([obj0]);
var obj2 = myObject.create([]);
obj2.func = function (arg) {
    return "func2: " + arg;
};
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
    assertEquals(undefined, testObj.ancestors);
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
    var JustBothersome = myObject.create(null);
    var Aeroplane = myObject.create([Movable]);
    var LandVehicle = myObject.create([Movable]);
    var AeroCar = myObject.create([JustBothersome, LandVehicle, Aeroplane]); //"extends LandVehicle…"
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

//document.writeln(result);

