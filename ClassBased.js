function createClass(className, superClassList) {
    //create the class object
    var aClass = Object.create(this);
    aClass.className = className;
    aClass.superClassList = superClassList;

    aClass.new = function () {
        //create everything;
        var obj = Object.create(this);
        obj.objParent = aClass;
        obj.objClassList = obj.objParent.superClassList;
        //function declarations
        obj.getClassList = function () {
            return obj.objClassList;
        };

        //check if cyclic inheritance
        //return undefined if so
        if (inList(obj.objParent, obj.objParent.superClassList)) {
            return undefined;
        }
        // .call will return undefined if it cannot
        // find the function called.
        obj.call = function (funcName, parameters) {
            var objFunction = null; // the function we will return;
            //set it to zero
            if (this.objParent.hasOwnProperty(funcName)) {
                //look-up if we have a function defined
                // in our parent Class
                objFunction = this.objParent[funcName].apply(null, parameters);
                //prepare the function and exit to return;
            }
            // look-up if we have the function defined
            // in one of our ancestors
            else if (this.objClassList != null) {
                //iterate through non-empty class list
                for (var i = 0; i < this.objClassList.length; i++) {
                    var ancestor = this.objClassList[i].new(); //instantiate the class to access its methods
                    return ancestor.call(funcName, parameters); //try to call the function through recursion
                }
            }
            return objFunction;
        };
        obj.getClass = function () {
            return objParent;
        };

        Object.preventExtensions(obj); //prevent instantiation modification
        Object.seal(obj);
        //return our instantiated class object
        return obj;
    };

    return aClass;
}

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
    //cyclic inheritance test
    console.log("\tCyclicInheritanceShouldBePrevented");
    var testClass = createClass("Class3", [null]);
    testClass.superClassList = [testClass, class1, class2];
    testObj = testClass.new();
    assertEquals(undefined, testObj);
};

UndefinedFunctionShouldBeUndefined = function () {
    //undefined test
    console.log("\tUndefinedFunctionShouldBeUndefined");
    var testClass = createClass("UndefinedClass", []);
    testObj = testClass.new();
    assertEquals(undefined, testObj.call("NonexistentFunc", []));
};
DiamondProblemShouldBePrevented = function () {
    console.log("\tDiamondProblemShouldBePrevented");
    var count = 0;
    var Movable = createClass("Movable", null);
    var Aeroplane = createClass("Aeroplane", [Movable]);
    var LandVehicle = createClass("LandVehicle", [Movable]);
    var AeroCar = createClass("AeroCar", [LandVehicle, Aeroplane]);  //"extends LandVehicle…"
    //this function should only be called once
    Movable.accelerate = function (speed) {
        count++;
    };
    var myCar = AeroCar.new();
    myCar.call('accelerate', [90.0]);
    assertEquals(1, count);

}

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