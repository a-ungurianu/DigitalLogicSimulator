/// <reference path="../libs/jquery.d.ts" />

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
        contDiv:JQuery;

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


