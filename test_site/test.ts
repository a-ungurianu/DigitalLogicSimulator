/// <reference path="../simulator/simulator.ts" />

class CheckboxInput extends Simulator.Component {
    constructor(private checkbox, id:string = "") {
        super(0,1);
        this.name = "CheckboxInput_" + id;
        this.evaluate = function () {
            if(this.outputs[0] != undefined) {
                this.outputs[0].value = this.checkbox.checked;
            }
        }
    }
}

class SpanPrinter extends Simulator.Component {
    constructor(private span, id:string = "") {
        super(1,0);
        this.name = "SpanPrinter";
        if(id != "") {
            name += "_" + id;
        }
        this.evaluate = function () {
            this.span.innerText = this.inputs[0].value;
        }
    }
}

window.onload = function () {
    var input1_el = document.getElementsByName("input1")[0];
    var input2_el = document.getElementsByName("input2")[0];


    var input1 = new CheckboxInput(document.getElementsByName("input1")[0],"1");
    var input2 = new CheckboxInput(document.getElementsByName("input2")[0],"2");

    input1_el.addEventListener("change",function() {input1.update();});
    input2_el.addEventListener("change",function() {input2.update();});

    var and = new Simulator.LogicalComponents.And("1");
    var printer = new SpanPrinter(document.getElementById("output"),"1");
    Simulator.connect(input1,0,and,0);
    Simulator.connect(input2,0,and,1);
    Simulator.connect(and,0,printer,0);
}