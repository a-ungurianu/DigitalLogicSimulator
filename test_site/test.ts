/// <reference path="../simulator/simulator.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/jsplumb.d.ts" />
/// <reference path="../libs/jqueryui.d.ts" />
class Switch extends Simulator.Component {
    private value:boolean;

    constructor(posx:number,posy:number, id:string = "") {
        super(0,1);
        this.name = "switch" + id;
        this.value = true;

        this.contDiv = $("<div id="+this.name+"></div>").addClass("component").addClass("switch").offset({top:posx,left:posy})
                                       .css("background-color","green");
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
        $("#screen").append(this.contDiv);
        jsPlumb.addEndpoint(this.contDiv,{endpoint:"Dot",anchor:"Right"});

        this.evaluate = function () {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = this.value;
            }
        }
    }
}

class SpanPrinter extends Simulator.Component {
    constructor(private span:JQuery, id:string = "") {
        super(1,0);
        this.name = "SpanPrinter";
        if(id != "") {
            name += "_" + id;
        }
        this.evaluate = function () {
            this.span.text(this.inputs[0].value);
        }
    }
}

jsPlumb.ready(function() {


    jsPlumb.setContainer($("#screen"));
    jsPlumb.draggable($(".component"));
    //Stuff

    console.log("jsPlumb is ready!");

    var input1 = new Switch(20,20,"1");
});
