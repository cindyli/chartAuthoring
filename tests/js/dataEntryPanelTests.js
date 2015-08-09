/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.chartAuthoring.dataEntries");

    gpii.tests.chartAuthoring.dataEntries.vals = [0, 1, 2.2, null, undefined];

    gpii.tests.chartAuthoring.dataEntries.expected = [
        //entry
        // 0, 1, 2.2, "", null, undefined
        [0, 1, 2.2, 0, 0], // currentValue === 0
        [1, 2, 3.2, 1, 1], // currentValue === 1
        [2.2, 3.2, 4.4, 2.2, 2.2], // currentValue === 2.2
        [0, 1, 2.2, null, null], // currentValue === null
        [0, 1, 2.2, null, null] // currentValue === undefined
    ];

    jqUnit.test("Test gpii.chartAuthoring.dataEntryPanel.sumDataEntries", function () {
        fluid.each(gpii.tests.chartAuthoring.dataEntries.vals, function (currentValue, cvIdx) {
            fluid.each(gpii.tests.chartAuthoring.dataEntries.vals, function (value, valIdx) {
                var sum = gpii.chartAuthoring.dataEntryPanel.sumDataEntries({value: value}, currentValue);
                jqUnit.assertEquals("The entry value: '" + value + "' and currentValue: '" + currentValue + "' should be summed together correctly.", gpii.tests.chartAuthoring.dataEntries.expected[cvIdx][valIdx], sum);
            });
        });
    });

    jqUnit.test("Test gpii.chartAuthoring.dataEntryPanel.append", function () {
        var container = $(".appendtest");
        var template = "<span class='appendtest-appended'>Appended</span>";

        gpii.chartAuthoring.dataEntryPanel.append(container, template);
        gpii.chartAuthoring.dataEntryPanel.append(container, $(template));

        jqUnit.assertEquals("The elements should be appended to the container", 2, container.find(".appendtest-appended").length);
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanel", {
        gradeNames: ["gpii.chartAuthoring.dataEntryPanel", "autoInit"],
        resources: {
            template: {
                resourceText: "<form>" +
                                "<fieldset>" +
                                "<legend class=\"gpiic-ca-dataEntryPanel-dataEntryLabel\">Entry</legend>" +
                                "<ul class=\"gpiic-ca-dataEntryPanel-dataEntries\">" +
                                "<li class=\"gpiic-ca-dataEntryPanel-dataEntry\"></li>" +
                                "</ul>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalLabel\">Total</span>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalValue\">Value</span>" +
                                "<span class=\"gpiic-ca-dataEntryPanel-totalPercentage\">%</span>" +
                                "</fieldset>" +
                                "</form>"
            },
            dataEntry: {
                resourceText: "<input type=\"text\" class=\"gpiic-ca-dataEntry-label\">" +
                                "<input type=\"text\" class=\"gpiic-ca-dataEntry-value\">" +
                                "<span class=\"gpiic-ca-dataEntry-percentage\"></span>"

            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanelTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            dataEntryPanel: {
                type: "gpii.tests.chartAuthoring.dataEntryPanel",
                container: ".gpiic-ca-dataEntryPanel"
            },
            dataEntryPanelTester: {
                type: "gpii.tests.chartAuthoring.dataEntryPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.chartAuthoring.dataEntryPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            totalsChanged: {
                value: 10
            },
            entryValue1: 20,
            entryValue2: 30,
            totalsExpected: {
                value: 10,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            },
            totalsExpected1: {
                value: 20,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            },
            totalsExpected2: {
                value: 50,
                percentage: "100%",
                label: "{dataEntryPanel}.options.strings.totalLabel"
            }
        },
        modules: [{
            name: "Tests the data entry panel component",
            tests: [{
                expect: 1,
                name: "Test Init",
                type: "test",
                func: "jqUnit.assertValue",
                args: ["The component should have been initialized.", "{dataEntryPanel}"]
            }, {
                expect: 11,
                name: "Test Initial Rendering",
                type: "test",
                func: "gpii.tests.chartAuthoring.dataEntryPanelTester.testRendering",
                args: ["{dataEntryPanel}"]
            }, {
                name: "Model Changed Sequence",
                expect: 16,
                sequence: [{
                    func: "{dataEntryPanel}.dataEntry.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue1"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected1"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }, {
                    func: "{dataEntryPanel}.dataEntry-1.applier.change",
                    args: ["value", "{that}.options.testOptions.entryValue2"]
                }, {
                    listener: "gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput",
                    args: ["{dataEntryPanel}", "{that}.options.testOptions.totalsExpected2"],
                    spec: {path: "total", priority: "last"},
                    changeEvent: "{dataEntryPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.chartAuthoring.dataEntryPanelTester.testRendering = function (that) {
        var dataEntryLabel = that.locate("dataEntryLabel");
        jqUnit.assertEquals("The data entry label should be set", that.options.strings.dataEntryLabel, dataEntryLabel.text());

        // Test creation of dataEntry components
        var expectedDataEntryFields = that.options.numDataEntryFields;
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entry components added", expectedDataEntryFields, that.locate("dataEntry").length);
        jqUnit.assertEquals("There should be " + expectedDataEntryFields + " data entries added to the model", expectedDataEntryFields, fluid.keys(that.model.dataEntries).length);

        gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput(that, {
            label: that.options.strings.totalLabel,
            value: that.options.strings.emptyTotalValue,
            percentage: "%"
        });
    };

    gpii.tests.chartAuthoring.dataEntryPanelTester.verifyTotalOutput = function (that, expected) {
        jqUnit.assertEquals("The total label should be set", expected.label, that.locate("totalLabel").text());
        jqUnit.assertEquals("The total value should be set", expected.value, that.locate("totalValue").text());
        jqUnit.assertEquals("The total percentage should be set", expected.percentage, that.locate("totalPercentage").text());

        for (var i = 0; i < that.options.numDataEntryFields; i++) {
            var dataEntry = "dataEntry" + (i ? "-" + i : "");
            jqUnit.assertEquals("The total for " + dataEntry + " should be updated from the panel total", that.model.total.value, that[dataEntry].model.total);
        }
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.chartAuthoring.dataEntryPanelTest"
        ]);
    });

})(jQuery, fluid);
