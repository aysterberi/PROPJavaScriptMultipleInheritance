/*
 Jag skrev om funktionen helt
 Den verkar funka men jag är inte säker
 på om jag missat något?

 Det är grovt samma kod förutom att jag inverterade så att istället
 för att vi letar efter "call" i superClassList så antar vi att vi får
 något tillbaka från apply och fortsätter söka så länge resultatet är null. Blir
 ingen infinite loop eftersom vi kör det i for-loopen.

 Jag splittrade upp även upp objektinstantiering från klass-skapandet
 och bytte till let där det gick. Vi kan alltid flytta det tillbaka men
 det ser mycket tydligare ut.

 Man kan nu göra som i java och skapa ett klassobjekt; Smidiga är att man kan
 ändra hur mycket man vill i klassen men man kan inte lägga till nya funktioner
 eller publika fält i instansobjektet! T.ex. nedan

 Car = createClass(Car, [Vehicle, TransportProvider]);  //"extends Vehicle…"
 Vehicle.accelerate = function () {
 //wrroom wroom
 };
 myCar = Car.new();
 myCar.call('accelerate', [90.0]);
 -> detta funkar

 men inte detta:
 myCar.fancy = function () {
 return "I am a very fancy car";
 };

 myCar.fancy är undefined oavsett.

 */
function createClass(className, superClassList) {
    //create the class object
    let aClass = Object.create(this);
    aClass.className = className;
    aClass.superClassList = superClassList;

    aClass.new = function () {
        //create everything;
        let obj = Object.create(this);
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
            let objFunction = null; // the function we will return;
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
                for (let i = 0; i < this.objClassList.length; i++) {
                    let ancestor = this.objClassList[i].new(); //instantiate the class to access its methods
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
        for (let j = 0; j < list.length; j++) {
            let tmp = list[j];
            if (name == tmp) {
                return true;
            }
            else if (tmp.superClassList != undefined) {
                for (let i = 0; i < tmp.superClassList.length; i++) {
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
    Movable.accelerate = function (speed) {
        //lambda
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