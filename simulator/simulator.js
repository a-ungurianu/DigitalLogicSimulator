/// <reference path="../libs/jquery.d.ts" />
var Simulator;
(function (Simulator) {
    var Connection = (function () {
        function Connection() {
            this.value = false;
        }
        return Connection;
    })();
    Simulator.Connection = Connection;
    var Component = (function () {
        function Component(inputSize, outputSize) {
            this.inputs = new Array();
            this.inputValue = new Array();
            for (var i = 0; i < inputSize; ++i) {
                this.inputs.push(undefined);
                this.inputValue.push(false);
            }
            this.outputs = new Array();
            this.outputValue = new Array();
            for (var i = 0; i < outputSize; ++i) {
                this.outputs.push(Array());
                this.outputValue.push(false);
            }
        }
        Component.prototype.setInput = function (index, conn) {
            if (!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if (this.inputs[index] != undefined) {
                throw "Input slot is already occupied!";
            }
            this.inputs[index] = conn;
            conn.next = this;
        };
        Component.prototype.setOutput = function (index, conn) {
            if (!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            this.outputs[index].push(conn);
        };
        Component.prototype.removeInput = function (index) {
            if (!(0 <= index && index < this.inputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            if (this.inputs[index] == undefined) {
                throw "Trying to delete an empty slot!";
            }
            this.inputs[index] = undefined;
        };
        Component.prototype.removeOutput = function (index, conn) {
            if (!(0 <= index && index < this.outputs.length)) {
                throw "Index greater than the number of slots available!";
            }
            var toRemove = this.outputs[index].indexOf(conn);
            if (toRemove == -1) {
                throw "The output connection that is being removed doesn't exist!";
            }
            else {
                this.outputs[index].splice(toRemove, 1);
            }
        };
        Component.prototype.update = function () {
            var canUpdate = true;
            for (var i = 0; i < this.inputs.length; ++i) {
                if (this.inputs[i] == undefined || this.inputs[i].value == undefined) {
                    canUpdate = false;
                }
                else {
                    this.inputValue[i] = this.inputs[i].value;
                }
            }
            if (canUpdate) {
                console.log(this.name + " updated");
                this.evaluate();
                for (var i = 0; i < this.outputs.length; ++i) {
                    for (var j = 0; j < this.outputs[i].length; ++j) {
                        this.outputs[i][j].value = this.outputValue[i];
                        this.outputs[i][j].next.update();
                    }
                }
            }
        };
        return Component;
    })();
    Simulator.Component = Component;
    // var connections = new Array<Connection>();
    var activeComponents = {};
    function getComponent(name) {
        if (activeComponents[name] == undefined) {
            throw "Component doesn't exist!";
        }
        return activeComponents[name];
    }
    Simulator.getComponent = getComponent;
    function addComponent(name, component) {
        if (activeComponents[name] != undefined) {
            throw "Name already taken!";
        }
        activeComponents[name] = component;
    }
    Simulator.addComponent = addComponent;
    // TODO: Add a removeComponent function
    function connect(from, fromIdx, to, toIdx) {
        var conn = new Connection;
        console.log(from);
        console.log(to);
        from.setOutput(fromIdx, conn);
        to.setInput(toIdx, conn);
        //connections.push(conn);
        from.update();
        //console.log("Connection " + connections.length + " from " + from.name +" to " + to.name + " made!");
    }
    Simulator.connect = connect;
    function disconnect(from, fromIdx, to, toIdx) {
        from.removeOutput(fromIdx, to.inputs[toIdx]);
        to.removeInput(toIdx);
    }
    Simulator.disconnect = disconnect;
})(Simulator || (Simulator = {}));
