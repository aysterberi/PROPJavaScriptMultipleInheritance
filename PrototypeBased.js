const myObject = {
    prototypeList: null,
    create: function (prototypeList) {
        let obj = Object.create(myObject);
        obj.prototypeList = prototypeList;
        return obj;
    },
    call: function (functionName, parameters) {
        if (functionName in this)
            return this[functionName].apply(null, parameters);
        else if (this.prototypeList != null)
            for (let i = 0; i < this.prototypeList.length; i++) {
                if ("call" in this.prototypeList[i]) {
                    let found = this.prototypeList[i].call(functionName, parameters);
                    if (found != null)
                        return found;
                }
            }
        return null;
    }
};

/* Test from Beatrice, should output: "func0: hello" */
const obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
const obj1 = myObject.create([obj0]);
const obj2 = myObject.create([]);
obj2.func = function(arg) { return "func2: " + arg; };
const obj3 = myObject.create([obj1, obj2]);
const result = obj3.call("func", ["hello"]);
console.log(result);

