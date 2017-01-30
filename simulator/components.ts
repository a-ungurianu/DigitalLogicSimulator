/// <reference path="simulator.ts" />

module Components {

    var linkColor = "#aaa";
    var outputEndpointStyle = {
        endpoint:["Dot", { radius:8 }],
        paintStyle:{ fillStyle:linkColor },
        isTarget:true,
        isSource:true,
        scope:"logicConnections",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Flowchart", { } ],
        maxConnections:10
    };

    var inputEndpointStyle = {
        endpoint:["Dot", { radius:8}],
        paintStyle:{ fillStyle:linkColor },
        isTarget:true,
        scope:"logicConnections",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Flowchart", { } ],
        maxConnections:1
    };

    /** This abstract class adds a view layer to the logic component */
    class HTMLComponent extends Simulator.Component {
        public contDiv:JQuery;
        constructor(nInputs:number,nOutputs:number,posx:number,posy:number,compName:string) {
            super(nInputs,nOutputs);
            this.contDiv = $("<div id=" + this.name + "></div>").addClass("component").addClass(compName);
            $("#screen").append(this.contDiv);
            var spos = $("#screen").offset()
            Simulator.addComponent(this.name,this);
            this.contDiv.offset({ top: spos.top + posy, left: spos.left + posx });
            jsPlumb.draggable(this.contDiv, {containment:$("#screen")});
        }
    }

    export class Switch extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        private value:boolean;
        static compCount = 0;
        static componentName = "switch";
        constructor(posx:number,posy:number) {
            this.name = Switch.componentName + Switch.compCount;
            Switch.compCount += 1;

            this.value = false;

            super(0,1,posx,posy,Switch.componentName);

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

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function () {
                    this.outputValue[0] = this.value;
            }
        }
    }

    export class Light extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        static compCount:number = 0;
        static componentName:string = "light";

        constructor(posx:number,posy:number) {
            this.name = Light.componentName + Light.compCount;
            Light.compCount+=1;

            super(1,0,posx,posy,Light.componentName);

            this.contDiv.append($("<img src=\"simulator/gates/light_off.png\"></>"));

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Bottom"},inputEndpointStyle).id = this.name+"-i0";

            this.evaluate = function () {
                if (this.inputValue[0]) {
                    this.contDiv.children("img").attr("src","simulator/gates/light_on.png");
                }
                else {
                    this.contDiv.children("img").attr("src","simulator/gates/light_off.png");
                }
            }
        }
        removeInput(index:number):void {
            super.removeInput(index);
            this.contDiv.children("img").attr("src","simulator/gates/light_off.png");
        }
    }

    export class Not extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        static compCount:number = 0;
        static componentName:string = "not";
        constructor(posx:number,posy:number) {
            this.name = Not.componentName + Not.compCount;
            Not.compCount+=1;

            super(1,1,posx,posy,Not.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/"+Not.componentName + ".png\"></>"));

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpointStyle).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = !this.inputValue[0];
            }
        }
    }

    export class Or extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        static compCount:number = 0;
        static componentName:string = "or";
        constructor(posx:number,posy:number) {
            this.name = Or.componentName + Or.compCount;
            Or.compCount+=1;

            super(2,1,posx,posy,Or.componentName);
            this.contDiv.append($("<img src=\"simulator/"+ Or.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpointStyle).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpointStyle).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] || this.inputValue[1];
            }
        }
    }

    export class Xor extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.
        static compCount:number = 0;
        static componentName:string = "xor";
        constructor(posx:number,posy:number) {
            this.name = Xor.componentName + Xor.compCount;
            Xor.compCount+=1;

            super(2,1,posx,posy,Xor.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/"+Xor.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpointStyle).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpointStyle).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] ^ this.inputValue[1];
            }
        }
    }

    export class And extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        static compCount:number = 0;
        static componentName:string = "and";
        constructor(posx:number,posy:number) {
            this.name = And.componentName + And.compCount;
            And.compCount+=1;

            super(2,1,posx,posy,And.componentName);
            this.contDiv.append($("<img src=\"simulator/gates/"+And.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpointStyle).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpointStyle).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] && this.inputValue[1];
            }
        }
    }

// Components used for debug

    export class True extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.

        static compCount:number = 0;
        static componentName:string = "true";
        constructor(posx:number,posy:number) {
            this.name = True.componentName + True.compCount;
            True.compCount+=1;

            super(0,1,posx,posy,True.componentName);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = true;
            }
        }
    }

    export class False extends HTMLComponent {
        // Counter for the number of components of this type.
        // Used for making unique css ids for each of the endpoints.
        
        static compCount:number = 0;
        static componentName:string = "false";
        constructor(posx:number,posy:number) {
            this.name = False.componentName + False.compCount;
            False.compCount+=1;

            super(0,1,posx,posy,False.componentName);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpointStyle).id = this.name+"-o0";
            this.evaluate = function() {
                this.outputs[0].value = false;
            }
        }
    }

}

jsPlumb.ready(function() {

    jsPlumb.setContainer($("#screen"));

    jsPlumb.doWhileSuspended(function () {
        jsPlumb.bind("connection", function(info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            //Simulator.connect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
            Simulator.connect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
        });

        jsPlumb.bind("connectionDetached", function(info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            Simulator.disconnect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });

        jsPlumb.bind("connectionMoved", function(info, originalEvent) {
            var sourceid = info.originalSourceId;
            var targetid = info.originalTargetId;
            var sourceepid = +(info.originalSourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.originalTargetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            Simulator.disconnect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });
    });
});
