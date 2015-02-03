/// <reference path="simulator.ts" />

module Components {

    var linkColor = "#aaa";
    var outputEndpoint = {
        endpoint:["Dot", { radius:5 }],
        paintStyle:{ fillStyle:linkColor },
        isSource:true,
        scope:"green",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Bezier", { curviness:63 } ],
        maxConnections:1
    };

    var inputEndpoint = {
        endpoint:["Dot", { radius:5}],
        paintStyle:{ fillStyle:linkColor },
        isTarget:true,
        scope:"green",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Bezier", { curviness:63 } ],
        maxConnections:1
    };

    export class Switch extends Simulator.Component {
        private value:boolean;
        static compCount = 0;
        static componentName = "switch";
        constructor(posx:number,posy:number) {
            this.name = Switch.componentName + Switch.compCount;
            Switch.compCount += 1;

            this.value = false;

            super(0,1,Switch.componentName);
            this.contDiv.css("background-color","red").offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            this.contDiv.click({parent:this},function (event) {
                if(event.data.parent.value) {
                    event.data.parent.value = false;
                    event.data.parent.contDiv.css("background-color","red");
                }
                else {
                    event.data.parent.value = true;
                    event.data.parent.contDiv.css("background-color","green");
                }
                event.data.parent.update();
            })

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function () {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.value;
                }
            }
        }
    }

    export class Light extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "light";

        constructor(posx:number,posy:number) {
            this.name = Light.componentName + Light.compCount;
            Light.compCount+=1;

            super(1,0,Light.componentName);

            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpoint).id = this.name+"-i0";


            this.evaluate = function () {
                if(this.inputs[0].value) {
                    this.contDiv.css("background-color","green");
                }
                else {
                    this.contDiv.css("background-color","red");
                }
            }
        }
        removeInput(index:number) {
            super.removeInput(index);
            this.contDiv.css("background-color","blue");
        }
    }

    export class True extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "true";
        constructor(posx:number,posy:number) {
            this.name = True.componentName + True.compCount;
            True.compCount+=1;

            super(0,1,True.componentName);

            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = true;
                }
            }
        }
    }

    export class False extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "false";
        constructor(posx:number,posy:number) {
            this.name = False.componentName + False.compCount;
            False.compCount+=1;

            super(0,1,False.componentName);

            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = false;
                }
            }
        }
    }

    export class Not extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "not";
        constructor(posx:number,posy:number) {
            this.name = Not.componentName + False.compCount;
            False.compCount+=1;

            super(1,1,Not.componentName);
            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = !this.inputs[0].value;
                }
            }
        }
    }

    export class Or extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "or";
        constructor(posx:number,posy:number) {
            this.name = Or.componentName + Or.compCount;
            Or.compCount+=1;

            super(2,1,Or.componentName);
            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"TopLeft"},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"BottomLeft"},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value || this.inputs[1].value;
                }
            }
        }
    }

    export class Xor extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "xor";
        constructor(posx:number,posy:number) {
            this.name = Xor.componentName + Xor.compCount;
            Xor.compCount+=1;

            super(2,1,Xor.componentName);
            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"TopLeft"},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"BottomLeft"},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value ^ this.inputs[1].value;
                }
            }
        }
    }

    export class And extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "and";
        constructor(posx:number,posy:number) {
            this.name = And.componentName + And.compCount;
            And.compCount+=1;

            super(2,1,And.componentName);
            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"TopLeft"},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"BottomLeft"},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value && this.inputs[1].value;
                }
            }
        }
    }

    export class Splitter extends Simulator.Component {
        static compCount:number = 0;
        static componentName:string = "splitter";
        constructor(posx:number,posy:number) {
            this.name = Splitter.componentName + Splitter.compCount;
            Splitter.compCount+=1;

            super(1,2,Splitter.componentName);
            this.contDiv.offset({top:posy,left:posx});
            jsPlumb.draggable(this.contDiv);

            jsPlumb.addEndpoint(this.contDiv,{anchor:"TopRight"},outputEndpoint).id = this.name+"-o0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"BottomRight"},outputEndpoint).id = this.name+"-o1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpoint).id = this.name+"-10";

            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value;
                }
                if(this.outputs[1] != undefined) {
                    this.outputs[1].value = this.inputs[0].value;
                }
            }
        }
    }
}