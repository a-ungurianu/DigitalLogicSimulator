var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Simulator;
(function (Simulator) {
    var Connection = (function () {
        function Connection() {
        }
        return Connection;
    })();
    Simulator.Connection = Connection;
    var Component = (function () {
        function Component(inputSize, outputSize) {
            this.inputs = new Array();
            for (var i = 0; i < inputSize; ++i) {
                this.inputs.push(undefined);
            }
            this.outputs = new Array();
            for (var i = 0; i < outputSize; ++i) {
                this.outputs.push(undefined);
            }
        }
        //TODO: Implement fuctions to clear connections
        Component.prototype.setInput = function (index, conn) {
            //TODO: Assert that index has to be smaller than inputSize
            if (this.inputs[index] != undefined) {
                throw "Input slot " + index + " already occupied";
            }
            this.inputs[index] = conn;
            conn.next = this;
        };
        Component.prototype.setOutput = function (index, conn) {
            //TODO: Assert that index has to be smaller than outputSize
            if (this.outputs[index] != undefined) {
                throw "Output slot " + index + " already occupied";
            }
            this.outputs[index] = conn;
        };
        Component.prototype.update = function () {
            var canUpdate = true;
            for (var i = 0; i < this.inputs.length; ++i) {
                if (this.inputs[i] == undefined || this.inputs[i].value == undefined) {
                    canUpdate = false;
                    break;
                }
            }
            if (canUpdate) {
                this.evaluate();
                for (var i = 0; i < this.outputs.length; ++i) {
                    if (this.outputs[i] != undefined && this.outputs[i].next != undefined) {
                        this.outputs[i].next.update();
                    }
                }
            }
        };
        return Component;
    })();
    Simulator.Component = Component;
    var True = (function (_super) {
        __extends(True, _super);
        function True(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 0, 1);
            this.name = "True_" + id;
            this.evaluate = function () {
                if (this.outputs[0] != undefined) {
                    this.outputs[0].value = true;
                }
            };
        }
        return True;
    })(Component);
    Simulator.True = True;
    var False = (function (_super) {
        __extends(False, _super);
        function False(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 0, 1);
            this.name = "False_" + id;
            this.evaluate = function () {
                if (this.outputs[0] != undefined) {
                    this.outputs[0].value = false;
                }
            };
        }
        return False;
    })(Component);
    Simulator.False = False;
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 1, 1);
            this.name = "Not_" + id;
            this.evaluate = function () {
                if (this.outputs[0] != undefined) {
                    this.outputs[0].value = !this.inputs[0].value;
                }
            };
        }
        return Not;
    })(Component);
    Simulator.Not = Not;
    var Or = (function (_super) {
        __extends(Or, _super);
        function Or(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 2, 1);
            this.name = "Or_" + id;
            this.evaluate = function () {
                if (this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value || this.inputs[1].value;
                }
            };
        }
        return Or;
    })(Component);
    Simulator.Or = Or;
    var And = (function (_super) {
        __extends(And, _super);
        function And(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 2, 1);
            this.name = "And_" + id;
            this.evaluate = function () {
                if (this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value && this.inputs[1].value;
                }
            };
        }
        return And;
    })(Component);
    Simulator.And = And;
    var Printer = (function (_super) {
        __extends(Printer, _super);
        function Printer(id) {
            if (id === void 0) { id = ""; }
            _super.call(this, 1, 0);
            this.name = "Printer_" + id;
            this.evaluate = function () {
                console.log(this.inputs[0].value);
            };
        }
        return Printer;
    })(Component);
    Simulator.Printer = Printer;
    var connections = new Array();
    function connect(from, fromIdx, to, toIdx) {
        //connections.push(new Connection);
        var conn = new Connection;
        from.setOutput(fromIdx, conn);
        to.setInput(toIdx, conn);
        connections.push(conn);
    }
    Simulator.connect = connect;
})(Simulator || (Simulator = {}));
var trueValue = new Simulator.True();
