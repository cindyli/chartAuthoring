var demo = demo || {};

/*

Potential demo color stacks:

Grey Scale: colors: ["#979798", "#bbbdc0", "#58585b", "#e6e7e8", "#231f20"]
Green: colors: ["#00a59a", "#9bc863", "#1a6b61", "#e9ea7b", "#1b443d"]
Blue: colors: ["#04ca6dc", "#65cdf5", "#546ab2", "#b6e2ec", "#20386c"]
Red: colors: ["#f15e4e", "#faa634", "#a41c3f", "#fde95f", "#5b173b"]
Varied#1: colors: ["#04858d", "#41beae", "#faa634", "#f15e4e", "#004861"]
Varied#2: colors: ["#f7961c", "#87acdb", "#ffc60a", "#a2ce5a", "#f15e4e"]
Varied#3: colors: ["#f15e4e", "#acdee4", "#73c163", "#ffc74a", "#41beae"]

*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("demo.chartAuthoring");

    demo.chartAuthoring.addExampleInput = function (that) {
        var dataEntry = that.chartAuthoringInterface.dataEntryPanel.dataEntry;
        var dataEntry2 = that.chartAuthoringInterface.dataEntryPanel["dataEntry-1"];

        dataEntry.locate("label").val("label 1");
        dataEntry.locate("value").val(60).trigger("change");

        dataEntry2.locate("label").val("label 2");
        dataEntry2.locate("value").val(40).trigger("change");
    };

    demo.chartAuthoring.addResetButton = function (that) {
        var dataEntryForm = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntryForm");

        $("<button>Reset</button>").appendTo(dataEntryForm)
            .attr({
                "class": "floe-demo-resetButton"
            })
            .click(function(e) {
                if($(this).is(":focus")) {
                    that.reset();
                }
                e.preventDefault();
            });
    };

    demo.chartAuthoring.resetPanel = function (that) {
        var dataEntries = that.chartAuthoringInterface.dataEntryPanel.locate("dataEntries");

        var labelInputs = dataEntries.find("input.floec-ca-dataEntry-label");
        labelInputs.each(function () {
            $(this).val("");
        });

        var valueInputs = dataEntries.find("input.floec-ca-dataEntry-value");
        valueInputs.each(function () {
            $(this).val("");
        });
        valueInputs.trigger("change");
    };

    floe.chartAuthoring("#floec-chartAuthoring", {
        templateLoader: {
            terms: {
                templatePrefix: "../src/html"
            }
        },
        dataEntryPanel: {
            strings: {
                dataEntryLabel: "Enter your labels and values"
            }
        },
        pieChart: {
            pieChartOptions: {
                sliceTextDisplayTemplate: "%percentage%",
                labelTextDisplayTemplate: "%label",
                valueTextDisplayTemplate: "%percentage% (%value/%total)",
                colors: ["#00a59a", "#9bc863", "#1a6b61", "#e9ea7b", "#1b443d"],
                width: 400,
                height: 400
            }
        },
        invokers: {
            "reset": {
                funcName: "demo.chartAuthoring.resetPanel",
                args: ["{that}"]
            }
        },
        listeners: {
            "onToolReady.addExampleInput": {
                funcName: "demo.chartAuthoring.addExampleInput",
                args: ["{that}"]
            },
            "onToolReady.addResetButton": {
                funcName: "demo.chartAuthoring.addResetButton",
                args: ["{that}"]
            }
        }
    });

})(jQuery,fluid);
