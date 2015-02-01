module Simulator {
    export class Connection {
        value:boolean;
        next:Component;
    }

    export class Component {
        inputs:Array<Connection>;
        outputs:Array<Connection>;
        evaluate:() => void;
        name:string;

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
            if(!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.inputs[index] != undefined) {
                throw "Input slot " + index + " already occupied";
            }
            this.inputs[index] = conn;
            conn.next = this;
        }

        setOutput(index:number, conn:Connection) {
            if(!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.outputs[index] != undefined) {
                throw "Output slot " + index + " already occupied";
            }
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
                console.log(this.name + " updated");
                this.evaluate();
                for(var i = 0; i < this.outputs.length; ++i) {
                    if(this.outputs[i] != undefined && this.outputs[i].next != undefined) {
                       this.outputs[i].next.update();
                    }
                }
            }
        }

    }

    export class Printer extends Component {
        constructor(id:string = "") {
            super(1,0);
            this.name = "Printer_" + id;
            this.evaluate = function() {
                console.log(this.inputs[0].value);
            }
        }
    }

    var connections = new Array<Connection>();

    export function connect(from:Component, fromIdx:number, to:Component, toIdx:number) {
        var conn = new Connection;
        from.setOutput(fromIdx,conn);
        to.setInput(toIdx,conn);
        connections.push(conn);
        from.update();
        console.log("Connection " + connections.length + " from " + from.name +" to " + to.name + " made!");
    }
}

module Simulator.LogicalComponents {
    export class True extends Component {
        constructor(id:string = "") {
            super(0,1);
            this.name="True_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = true;
                }
            }
        }
    }

    export class False extends Component {
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

    export class Not extends Component {
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

    export class Or extends Component {
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

    export class And extends Component {
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
}

