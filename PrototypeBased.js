var myObject = { prototypeList: null };

myObject.call = function (functionName, parameters) {
    if (this.hasOwnProperty(functionName))
        return this[functionName].apply(null, parameters);
    else if (this.prototypeList != null)
        for (var i = 0; i < this.prototypeList.length; i++) {
            if ("call" in this.prototypeList[i]) {
                var found = this.prototypeList[i].call(functionName, parameters);
                if (found != null)
                    return found;
            }
        }
    return null;
};

myObject.create = function (prototypeList) {
    var obj = Object.create(myObject);
    obj.prototypeList = prototypeList;
    return obj;
};

/* Test from Beatrice, should output: "func0: hello" */
var obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
var obj1 = myObject.create([obj0]);
var obj2 = myObject.create([]);
obj2.func = function(arg) { return "func2: " + arg; };
var obj3 = myObject.create([obj1, obj2]);
var result = obj3.call("func", ["hello"]);
//document.writeln(result);

