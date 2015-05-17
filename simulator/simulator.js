/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/jsplumb.d.ts" />
/// <reference path="libs/jqueryui.d.ts" />
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
/// <reference path="simulator.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Components;
(function (Components) {
    var linkColor = "#aaa";
    var outputEndpoint = {
        endpoint: ["Dot", { radius: 8 }],
        paintStyle: { fillStyle: linkColor },
        isTarget: true,
        isSource: true,
        scope: "logicConnections",
        connectorStyle: { strokeStyle: linkColor, lineWidth: 6 },
        connector: ["Flowchart", {}],
        maxConnections: 10
    };
    var inputEndpoint = {
        endpoint: ["Dot", { radius: 8 }],
        paintStyle: { fillStyle: linkColor },
        isTarget: true,
        scope: "logicConnections",
        connectorStyle: { strokeStyle: linkColor, lineWidth: 6 },
        connector: ["Flowchart", {}],
        maxConnections: 1
    };
    var HTMLComponent = (function (_super) {
        __extends(HTMLComponent, _super);
        function HTMLComponent(nInputs, nOutputs, posx, posy, compName) {
            _super.call(this, nInputs, nOutputs);
            this.contDiv = $("<div id=" + this.name + "></div>").addClass("component").addClass(compName);
            $("#screen").append(this.contDiv);
            spos = $("#screen").offset()
            Simulator.addComponent(this.name, this);
            this.contDiv.offset({ top: spos.top + posy, left: spos.left + posx });
            jsPlumb.draggable(this.contDiv, { containment: $("#screen") });
        }
        return HTMLComponent;
    })(Simulator.Component);
    var Switch = (function (_super) {
        __extends(Switch, _super);
        function Switch(posx, posy) {
            this.name = Switch.componentName + Switch.compCount;
            Switch.compCount += 1;
            this.value = false;
            _super.call(this, 0, 1, posx, posy, Switch.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/switch_off.png\"></>"));
            this.contDiv.click({ parent: this }, function (event) {
                if (event.data.parent.value) {
                    event.data.parent.value = false;
                    event.data.parent.contDiv.children("img").attr("src","simulator/gates/switch_off.png");
                }
                else {
                    event.data.parent.value = true;
                    event.data.parent.contDiv.children("img").attr("src","simulator/gates/switch_on.png");
                }
                event.data.parent.update();
            });
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = this.value;
            };
        }
        Switch.compCount = 0;
        Switch.componentName = "switch";
        return Switch;
    })(HTMLComponent);
    Components.Switch = Switch;
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light(posx, posy) {
            this.name = Light.componentName + Light.compCount;
            Light.compCount += 1;
            _super.call(this, 1, 0, posx, posy, Light.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/light_off.png\"></>"));
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Bottom" }, inputEndpoint).id = this.name + "-i0";
            this.evaluate = function () {
                if (this.inputValue[0]) {
                    this.contDiv.children("img").attr("src","simulator/gates/light_on.png");
                }
                else {
                    this.contDiv.children("img").attr("src","simulator/gates/light_off.png");
                }
            };
        }
        Light.prototype.removeInput = function (index) {
            _super.prototype.removeInput.call(this, index);
            this.contDiv.css("background-color", "blue");
        };
        Light.compCount = 0;
        Light.componentName = "light";
        return Light;
    })(HTMLComponent);
    Components.Light = Light;
    var True = (function (_super) {
        __extends(True, _super);
        function True(posx, posy) {
            this.name = True.componentName + True.compCount;
            True.compCount += 1;
            _super.call(this, 0, 1, posx, posy, True.componentName);
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = true;
            };
        }
        True.compCount = 0;
        True.componentName = "true";
        return True;
    })(HTMLComponent);
    Components.True = True;
    var False = (function (_super) {
        __extends(False, _super);
        function False(posx, posy) {
            this.name = False.componentName + False.compCount;
            False.compCount += 1;
            _super.call(this, 0, 1, posx, posy, False.componentName);
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputs[0].value = false;
            };
        }
        False.compCount = 0;
        False.componentName = "false";
        return False;
    })(HTMLComponent);
    Components.False = False;
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(posx, posy) {
            this.name = Not.componentName + Not.compCount;
            Not.compCount += 1;
            _super.call(this, 1, 1, posx, posy, Not.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/" + Not.componentName + ".png\"></>"));
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Left" }, inputEndpoint).id = this.name + "-i0";
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = !this.inputValue[0];
            };
        }
        Not.compCount = 0;
        Not.componentName = "not";
        return Not;
    })(HTMLComponent);
    Components.Not = Not;
    var Or = (function (_super) {
        __extends(Or, _super);
        function Or(posx, posy) {
            this.name = Or.componentName + Or.compCount;
            Or.compCount += 1;
            _super.call(this, 2, 1, posx, posy, Or.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/" + Or.componentName + ".png\"></>"));
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.3, 0, 0] }, inputEndpoint).id = this.name + "-i0";
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.7, 0, 0] }, inputEndpoint).id = this.name + "-i1";
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = this.inputValue[0] || this.inputValue[1];
            };
        }
        Or.compCount = 0;
        Or.componentName = "or";
        return Or;
    })(HTMLComponent);
    Components.Or = Or;
    var Xor = (function (_super) {
        __extends(Xor, _super);
        function Xor(posx, posy) {
            this.name = Xor.componentName + Xor.compCount;
            Xor.compCount += 1;
            _super.call(this, 2, 1, posx, posy, Xor.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/" + Xor.componentName + ".png\"></>"));
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.3, 0, 0] }, inputEndpoint).id = this.name + "-i0";
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.7, 0, 0] }, inputEndpoint).id = this.name + "-i1";
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = this.inputValue[0] ^ this.inputValue[1];
            };
        }
        Xor.compCount = 0;
        Xor.componentName = "xor";
        return Xor;
    })(HTMLComponent);
    Components.Xor = Xor;
    var And = (function (_super) {
        __extends(And, _super);
        function And(posx, posy) {
            this.name = And.componentName + And.compCount;
            And.compCount += 1;
            _super.call(this, 2, 1, posx, posy, And.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/" + And.componentName + ".png\"></>"));
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.3, 0, 0] }, inputEndpoint).id = this.name + "-i0";
            jsPlumb.addEndpoint(this.contDiv, { anchor: [0, 0.7, 0, 0] }, inputEndpoint).id = this.name + "-i1";
            jsPlumb.addEndpoint(this.contDiv, { anchor: "Right" }, outputEndpoint).id = this.name + "-o0";
            this.evaluate = function () {
                this.outputValue[0] = this.inputValue[0] && this.inputValue[1];
            };
        }
        And.compCount = 0;
        And.componentName = "and";
        return And;
    })(HTMLComponent);
    Components.And = And;
})(Components || (Components = {}));
jsPlumb.ready(function () {
    jsPlumb.setContainer($("#screen"));
    jsPlumb.doWhileSuspended(function () {
        jsPlumb.bind("connection", function (info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log(sourceepid, targetepid);
            //Simulator.connect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
            Simulator.connect(Simulator.getComponent(sourceid), sourceepid, Simulator.getComponent(targetid), targetepid);
        });
        jsPlumb.bind("connectionDetached", function (info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid, "(", sourceepid, ") to ", targetid, "(", targetepid, ").");
            Simulator.disconnect(Simulator.getComponent(sourceid), sourceepid, Simulator.getComponent(targetid), targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });
        jsPlumb.bind("connectionMoved", function (info, originalEvent) {
            var sourceid = info.originalSourceId;
            var targetid = info.originalTargetId;
            var sourceepid = +(info.originalSourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.originalTargetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid, "(", sourceepid, ") to ", targetid, "(", targetepid, ").");
            Simulator.disconnect(Simulator.getComponent(sourceid), sourceepid, Simulator.getComponent(targetid), targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });
    });
});
