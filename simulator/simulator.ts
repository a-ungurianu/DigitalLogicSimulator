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

        setInput(index:number, conn:Connection):void {
            if(!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.inputs[index] != undefined) {
                throw "Input slot " + index + " already occupied";
            }
            this.inputs[index] = conn;
            conn.next = this;
        }

        setOutput(index:number, conn:Connection):void {
            if(!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.outputs[index] != undefined) {
                throw "Output slot " + index + " already occupied";
            }
            this.outputs[index] = conn;
        }

        removeInput(index:number):void {
            if(!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            this.inputs[index] = undefined;
        }

        removeOutput(index:number):void {
            if(!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            this.outputs[index] = undefined;
        }

        update():void {
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

    // var connections = new Array<Connection>();
    var activeComponents = {};

    export function getComponent(name:string):Component {
        if(activeComponents[name] == undefined) {
            throw "Component doesn't exist!";
        }
        return activeComponents[name];
    }

    export function addComponent(name:string, component:Component):void {
        if(activeComponents[name] != undefined) {
            throw "Name already taken!";
        }
        activeComponents[name] = component;
    }

    // TODO: Add a removeComponent function

    export function connect(from:Component, fromIdx:number, to:Component, toIdx:number):void {
        var conn = new Connection;
        console.log(from);
        console.log(to);
        from.setOutput(fromIdx,conn);
        to.setInput(toIdx,conn);
        //connections.push(conn);
        from.update();
        //console.log("Connection " + connections.length + " from " + from.name +" to " + to.name + " made!");
    }

    export function disconnect(from:Component, fromIdx:number, to:Component, toIdx:number):void {
        from.removeOutput(fromIdx);
        to.removeInput(toIdx);
    }
}


