function createClass(className, superClassList) {
    //create the class object
    var aClass = Object.create(this);
    aClass.className = className;
    aClass.superClassList = superClassList;

    aClass.new = function () {
        // create everything;
        var obj = Object.create(this);
        obj.objParent = aClass;
        obj.objClassList = obj.objParent.superClassList;
        // function declarations
        obj.getClassList = function () {
            return obj.objClassList;
        };

        // check if cyclic inheritance
        // return undefined if so
        if (inList(obj.objParent, obj.objParent.superClassList)) {
            return undefined;
        }
        // .call will return undefined if it cannot
        // find the function called.
        obj.call = function (functionName, parameters) {

            // if our current class has this function
            // call that.
            if (this.objParent.hasOwnProperty(functionName)) {
                //look-up if we have a function defined
                // in our parent Class
                return this.objParent[functionName].apply(null, parameters);
                // prepare the function and exit to return;
            }

            // else, prepare to traverse through the class list

            // we define helper class inside .call to access parent function vars
            function traverseClass(aClass) {
                // look-up if we have the function defined
                // in one of our ancestors
                var objFunction = undefined; // the function we will return;
                var j = 0;
                if (aClass == undefined) {
                    return undefined;
                }
                if (aClass.hasOwnProperty(functionName)) {
                    objFunction = aClass[functionName];
                }
                if (aClass.superClassList != undefined || aClass.superClassList != null) {
                    // iterate through non-empty class list
                    while ((objFunction == undefined) && (j <= aClass.superClassList.length)) {
                        objFunction = traverseClass(aClass.superClassList[j++]);
                    }
                }
                return objFunction;
            }

            var traverseResults = traverseClass(this.objParent);
            if (traverseResults != undefined) {
                return traverseResults.apply(null, parameters);
            }
            return undefined;
        };
        obj.getClass = function () {
            return obj.objParent;
        };
        Object.preventExtensions(obj); // prevent instantiation modification
        Object.seal(obj);
        // return our instantiated class object
        return obj;
    };


    // helper utility
    function inList(name, list) {
        if (list != undefined) {
            for (var j = 0; j < list.length; j++) {
                var tmp = list[j];
                if (name == tmp) {
                    return true;
                }
                else if (tmp.superClassList != undefined) {
                    for (var i = 0; i < tmp.superClassList.length; i++) {
                        inList(name, tmp.superClassList);
                    }
                }
            }
            return false;
        }
        return false;
    }
    return aClass;
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

console.log(result);


// TESTS

console.log("Running tests…");
CyclicInheritanceShouldBePrevented = function () {
    // cyclic inheritance test
    console.log("\tCyclicInheritanceShouldBePrevented");
    var testClass = createClass("Class3", [null]);
    testClass.superClassList = [testClass, class1, class2];
    testObj = testClass.new();
    assertEquals(undefined, testObj);
};

UndefinedFunctionShouldBeUndefined = function () {
    // undefined test
    console.log("\tUndefinedFunctionShouldBeUndefined");
    var testClass = createClass("UndefinedClass", []);
    testObj = testClass.new();
    assertEquals(undefined, testObj.call("NonexistentFunc", []));
};
DiamondProblemShouldBePrevented = function () {
    console.log("\tDiamondProblemShouldBePrevented");
    var count = 0;
    var Movable = createClass("Movable", null);
    var Comfortable = createClass("Comfortable", null);
    var Aeroplane = createClass("Aeroplane", [Movable]);
    var LandVehicle = createClass("LandVehicle", [Movable]);
    var AeroCar = createClass("AeroCar", [Comfortable, LandVehicle, Aeroplane]);  // "extends LandVehicle…"
    // this function should only be called once
    Movable.accelerate = function (speed) {
        count++;
    };
    var myCar = AeroCar.new();
    myCar.call('accelerate', [90.0]);
    assertEquals(1, count);

};

runAllTests = function () {
    DiamondProblemShouldBePrevented();
    CyclicInheritanceShouldBePrevented();
    UndefinedFunctionShouldBeUndefined();
};

runAllTests();

// helper utils
function assertEquals(expected, actual) {
    if (expected == actual) {
        console.log("\t\tOK.");
        return true;
    }
    console.log("\t\tAssertionError:\tExpected '" + expected + "' but got '" + actual + "'.");
    return false;
}