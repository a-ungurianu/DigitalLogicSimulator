/// <reference path="../libs/jquery.d.ts" />

module Simulator {
    export class Connection {
        constructor() {
            this.value = false
        }
        value:boolean;
        next:Component;
    }

    export class Component {
        inputs:Array<Connection>;
        outputs:Array<Array<Connection>>;
        inputValue:Array<boolean>;
        outputValue:Array<boolean>;
        evaluate:() => void;
        name:string;

        constructor(inputSize:number, outputSize:number) {

            this.inputs = new Array<Connection>();
            this.inputValue = new Array<boolean>();
            for(var i = 0; i < inputSize; ++i) {
                this.inputs.push(undefined);
                this.inputValue.push(false);
            }
            this.outputs = new Array<Array<Connection>>();
            this.outputValue = new Array<boolean>();
            for(var i = 0; i < outputSize; ++i) {
                this.outputs.push(Array<Connection>());
                this.outputValue.push(false);
            }
        }

        setInput(index:number, conn:Connection):void {
            if(!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.inputs[index] != undefined) {
                throw "Input slot is already occupied!";
            }
            this.inputs[index] = conn;
            conn.next = this;
        }

        setOutput(index:number, conn:Connection):void {
            if(!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            this.outputs[index].push(conn);
        }

        removeInput(index:number):void {
            if(!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if(this.inputs[index] == undefined) {
                throw "Trying to delete an empty slot!";
            }
            this.inputs[index] = undefined;

        }

        removeOutput(index:number, conn:Connection):void {
            if(!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            var toRemove = this.outputs[index].indexOf(conn);
            if(toRemove == -1) {
                throw "The output connection that is being removed doesn't exist!";
            }
            else {
                this.outputs[index].splice(toRemove,1);
            }
        }

        update():void {
            var canUpdate:boolean = true;
            for(var i = 0; i < this.inputs.length; ++i) {
                if(this.inputs[i] == undefined || this.inputs[i].value == undefined) {
                    canUpdate = false;
                }
                else {
                    this.inputValue[i] = this.inputs[i].value;
                }
            }

            if(canUpdate) {
                console.log(this.name + " updated");
                this.evaluate();
                for(var i = 0; i < this.outputs.length; ++i) {
                    for(var j = 0; j < this.outputs[i].length; ++j) {
                        this.outputs[i][j].value = this.outputValue[i];
                        this.outputs[i][j].next.update();
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
        from.removeOutput(fromIdx,to.inputs[toIdx]);
        to.removeInput(toIdx);
    }
}


