/// <reference path="../simulator/components.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/jsplumb.d.ts" />
/// <reference path="../libs/jqueryui.d.ts" />

jsPlumb.ready(function() {

    //TODO: Does nothing, find out why!
    jsPlumb.setContainer($("#screen"));

    jsPlumb.doWhileSuspended(function () {
        jsPlumb.bind("connection", function(info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log(sourceepid,targetepid);
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
