/// <reference path="simulator.ts" />

module Simulator.Components {
    export class True extends Simulator.Component {
        constructor(posx:numbers,posy:numbers,id:string = "") {

            super(0,1);
            this.name="True_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = true;
                }
            }
        }
    }

    export class False extends Component {
        constructor(id:string = "") {
            super(0,1);
            this.name="False_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = false;
                }
            }
        }
    }

    export class Not extends Component {
        constructor(id:string = "") {
            super(1,1);
            this.name = "Not_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = !this.inputs[0].value;
                }
            }
        }
    }

    export class Or extends Component {
        constructor(id:string = "") {
            super(2,1);
            this.name = "Or_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value || this.inputs[1].value;
                }
            }
        }
    }

    export class And extends Component {
        constructor(id:string = "") {
            super(2,1);
            this.name = "And_"+id;
            this.evaluate = function() {
                if(this.outputs[0] != undefined) {
                    this.outputs[0].value = this.inputs[0].value && this.inputs[1].value;
                }
            }
        }
    }
}