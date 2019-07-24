"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
function reactionWithManualTrigger(expression, effect, opts) {
    var lastProcessedManualArg;
    var observables = mobx_1.observable({
        lastSeenManualArg: undefined
    });
    var disposer = mobx_1.reaction(function (r) {
        var args = {
            autoArg: expression(r)
        };
        if (observables.lastSeenManualArg !== lastProcessedManualArg) {
            args.manualArg = lastProcessedManualArg = observables.lastSeenManualArg;
        }
        return args;
    }, function (args, r) {
        effect(args.autoArg, args.manualArg, r);
    }, opts);
    disposer.triggerManaully = mobx_1.action(function (manualArg) {
        observables.lastSeenManualArg = manualArg;
    });
    return disposer;
}
exports.reactionWithManualTrigger = reactionWithManualTrigger;
//# sourceMappingURL=index.js.map