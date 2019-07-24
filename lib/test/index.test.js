"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mobx_1 = require("mobx");
var index_1 = require("./../src/index");
mobx_1.configure({
    enforceActions: true
});
var delay = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
describe('reactionWithManualTrigger ', function () {
    it('expression is observed', function () {
        var autoMarker = '555777';
        var autoArgs = mobx_1.observable({
            marker: ''
        });
        var captured;
        index_1.reactionWithManualTrigger(function (manual) { return [autoArgs.marker, manual]; }, function (args) {
            captured = args;
        });
        chai_1.expect(captured).to.equal(undefined);
        mobx_1.action(function () { return autoArgs.marker = autoMarker; })();
        chai_1.expect(captured[0]).to.equal(autoMarker);
        chai_1.expect(captured[1]).to.equal(undefined);
    });
    it('can be triggered manually', function () {
        var autoMarker = '555777';
        var manualMarker1 = '111999';
        var manualMarker2 = '333555';
        var autoArgs = mobx_1.observable({
            marker: ''
        });
        var captured;
        var trigger = index_1.reactionWithManualTrigger(function (manual) { return [autoArgs.marker, manual]; }, function (args) {
            captured = args;
        });
        chai_1.expect(captured).to.equal(undefined);
        trigger.triggerManaully(manualMarker1);
        chai_1.expect(captured[0]).to.equal('');
        chai_1.expect(captured[1]).to.equal(manualMarker1);
        mobx_1.action(function () { return autoArgs.marker = autoMarker; })();
        chai_1.expect(captured[0]).to.equal(autoMarker);
        chai_1.expect(captured[1]).to.equal(undefined);
        trigger.triggerManaully(manualMarker2);
        chai_1.expect(captured[0]).to.equal(autoMarker);
        chai_1.expect(captured[1]).to.equal(manualMarker2);
    });
    it('returns disposer', function () {
        var autoMarker1 = '555777';
        var autoMarker2 = '111999';
        var autoArgs = mobx_1.observable({
            marker: ''
        });
        var captured;
        var disposer = index_1.reactionWithManualTrigger(function (manual) { return [autoArgs.marker, manual]; }, function (args) {
            captured = args;
        });
        chai_1.expect(typeof disposer === 'function').to.equal(true);
        chai_1.expect(disposer.$mobx !== undefined).to.equal(true);
        chai_1.expect(captured).to.equal(undefined);
        mobx_1.action(function () { return autoArgs.marker = autoMarker1; })();
        chai_1.expect(captured[0]).to.equal(autoMarker1);
        chai_1.expect(captured[1]).to.equal(undefined);
        captured = undefined;
        disposer();
        mobx_1.action(function () { return autoArgs.marker = autoMarker2; })();
        chai_1.expect(captured === undefined).to.equal(true);
    });
    it('passes IReactionPublic to expression and effect', function () {
        var autoMarker = '555777';
        var autoArgs = mobx_1.observable({
            marker: ''
        });
        var captured = [undefined, undefined];
        index_1.reactionWithManualTrigger(function (manual, r) {
            captured[0] = r;
            return autoArgs.marker;
        }, function (args, r) {
            captured[1] = r;
        });
        chai_1.expect(captured[0] !== undefined).to.equal(true);
        chai_1.expect(captured[1] === undefined).to.equal(true);
        mobx_1.action(function () { return autoArgs.marker = autoMarker; })();
        chai_1.expect(captured[0] === captured[1]).to.equal(true);
        chai_1.expect(typeof captured[0].dispose === 'function').to.equal(true);
    });
    it('passes options to underlying reaction', function () {
        var captured = [undefined, undefined];
        index_1.reactionWithManualTrigger(function (manual, r) {
            captured[0] = r;
        }, function (args, r) {
            captured[1] = r;
        });
        chai_1.expect(captured[0] !== undefined).to.equal(true);
        chai_1.expect(captured[1] === undefined).to.equal(true);
        captured = [undefined, undefined];
        index_1.reactionWithManualTrigger(function (manual, r) {
            captured[0] = r;
        }, function (auto, r) {
            captured[1] = r;
        }, { fireImmediately: true });
        chai_1.expect(captured[0] !== undefined).to.equal(true);
        chai_1.expect(captured[1] !== undefined).to.equal(true);
    });
});
//# sourceMappingURL=index.test.js.map