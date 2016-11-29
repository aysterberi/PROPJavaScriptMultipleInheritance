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

 Car = createClass(Car, ['Vehicle', 'TransportProvider']);  //"extends Vehicle…"
 Vehicle.accelerate = function () {
 //lambda
 };
 myCar = Car.new();
 myCar.call('accelerate', 90.0);

 Anropsstacken blir
 myCar.call(...) -> myCar.Car.call(...)
 ->  myCar.Car.Vehicle.call(...) -> myCar.Car.Vehicle.call.apply(null, 90.0);
 > "wroom wroom"

 men
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
        let objParent = aClass;
        let objClassList = objParent.superClassList;
        //function declarations
        obj.getClassList = function () {
            return objClassList;
        };

        //check if cyclic inheritance
        //return undefined if so
        if (inList(objParent, objParent.superClassList)) {
            return undefined;
        }
        // .call will return undefined if it cannot
        // find the function called.
        obj.call = function (funcName, parameters) {
            let objFunction = null; // the function we will return;
            //set it to zero
            if (objParent.hasOwnProperty(funcName)) {
                //look-up if we have a function defined
                // in our parent Class
                objFunction = objParent[funcName].apply(null, parameters);
                //prepare the function and exit to return;
            }
            // look-up if we have the function defined
            // in one of our ancestors
            else if (objClassList != null) {
                //iterate through non-empty class list
                let i = 0;
                for (i; i < objClassList.length; i++) {
                    let ancestor = objClassList[i].new(); //instantiate the class to access its methods
                    objFunction = ancestor.call(funcName, parameters); //try to call the function
                    if (objFunction != null) {
                        //stop searching as we found the function
                        //resolve multiple functions in init order
                        // ancestors[A,B,C] will be resolved A->B->C
                        break;
                    }
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
//document.writeln(result);
console.log(result);


//cyclic inheritance test
var testClass = createClass("Class3", [null]);
testClass.superClassList = [testClass, class1, class2];
testObj = testClass.new();
console.log(testObj);
result = testObj.call("func", ["hello darkness my old friend"]);
console.log(result);
