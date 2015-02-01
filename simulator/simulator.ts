class Connection {
    value:boolean;
    next:Component;
}

class Component {
    inputs:Array<Connection>;
    outputs:Array<Connection>;
    evaluate:() => void;
    name:string;
    isConnected:boolean = false;

    constructor(inputSize:number, outputSize:number) {
        this.inputs = new Array<Connection>();
        for(var i = 0; i < inputSize; ++i) {
            this.inputs.push(undefined);
        }
        this.outputs = new Array<Connection>();
        for(var i = 0; i < outputSize; ++i) {
            this.outputs.push(undefined);
        }
    }

    //TODO: Implement fuctions to clear connections
    setInput(index:number, conn:Connection) {
        //TODO: Assert that index has to be smaller than inputSize
        //TODO: Throw exception if connection is already made
        this.inputs[index] = conn;
        conn.next = this;
    }

    setOutput(index:number, conn:Connection) {
        //TODO: Assert that index has to be smaller than outputSize
        //TODO: Throw exception if connection is already made
        this.outputs[index] = conn;
    }

    update() {
        var canUpdate:boolean = true;
        for(var i = 0; i < this.inputs.length; ++i) {
            if(this.inputs[i] == undefined || this.inputs[i].value == undefined) {
                canUpdate = false;
                break;
            }
        }

        if(canUpdate) {
            this.evaluate();
            for(var i = 0; i < this.outputs.length; ++i) {
                if(this.outputs[i] != undefined && this.outputs[i].next != undefined) {
                   this.outputs[i].next.update();
                }
            }
        }
    }

}

class True extends Component {
    constructor(id:string) {
        super(0,1);
        this.name="True_"+id;
        this.evaluate = function() {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = true;
            }
        }
    }
}

class False extends Component {
    constructor(id:string = "") {
        super(0,1);
        this.name="False_"+id;
        this.evaluate = function() {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = false;
            }
        }
    }
}

class Not extends Component {
    constructor(id:string = "") {
        super(1,1);
        this.name = "Not_"+id;
        this.evaluate = function() {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = !this.inputs[0].value;
            }
        }
    }
}

class Or extends Component {
    constructor(id:string = "") {
        super(2,1);
        this.name = "Or_"+id;
        this.evaluate = function() {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = this.inputs[0].value || this.inputs[1].value;
            }
        }
    }
}

class And extends Component {
    constructor(id:string = "") {
        super(2,1);
        this.name = "And_"+id;
        this.evaluate = function() {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = this.inputs[0].value && this.inputs[1].value;
            }
        }
    }
}

class Printer extends Component {
    constructor(id:string = "") {
        super(1,0);
        this.name = "Printer_" + id;
        this.evaluate = function() {
            console.log(this.inputs[0].value);
        }
    }
}

var connections = new Array<Connection>();

function connect(from:Component, fromIdx:number, to:Component, toIdx:number) {
    connections.push(new Connection);
    from.setOutput(fromIdx,connections[connections.length-1]);
    to.setInput(toIdx,connections[connections.length-1]);
    to.isConnected = true;
    from.isConnected = true;
    //connections.push(conn);
}

var trueValue1 = new True("1");
var trueValue2 = new True("2");
var trueValue3 = new True("3");
var falseValue1 = new False("1");
var falseValue2 = new False("2");
var falseValue3 = new False("3");

var and = new And("1");
var or = new Or("1");
var not = new Not("1");
var printer = new Printer("1");

connect(falseValue1,0,not,0);
connect(not,0,and,0);
connect(trueValue2,0,and,1);
connect(and,0,or,0);
connect(falseValue2,0,or,1);
connect(or,0,printer,0);

falseValue1.update();
falseValue2.update();
falseValue3.update();
trueValue1.update();
trueValue2.update();
trueValue3.update();