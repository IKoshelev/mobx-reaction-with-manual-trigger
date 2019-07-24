import * as mocha from 'mocha';
import { expect } from 'chai';
import { observable, runInAction, configure, reaction, action, IReactionPublic } from 'mobx';

import { reactionWithManualTrigger } from './../src/index';

configure({
    enforceActions: true
});

const delay = (ms: number = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe('reactionWithManualTrigger ', () => {

    it('expression is observed', () => {
        const autoMarker = '555777';
        const autoArgs = observable({
            marker: ''
        });

        let captured: (string | undefined)[] | undefined;
        reactionWithManualTrigger(
            (manual: string | undefined) => [autoArgs.marker, manual],
            (args) => {
                captured = args;
            }
        );

        expect(captured).to.equal(undefined);

        action(() => autoArgs.marker = autoMarker)();

        expect(captured![0]).to.equal(autoMarker);
        expect(captured![1]).to.equal(undefined);
    });

    it('can be triggered manually', () => {
        const autoMarker = '555777';
        const manualMarker1 = '111999';
        const manualMarker2 = '333555';
        const autoArgs = observable({
            marker: ''
        });

        let captured: (string | undefined)[] | undefined;
        const trigger = reactionWithManualTrigger(
            (manual: string | undefined) => [autoArgs.marker, manual],
            (args) => {
                captured = args;
            }
        );

        expect(captured).to.equal(undefined);

        trigger.triggerManaully(manualMarker1);

        expect(captured![0]).to.equal('');
        expect(captured![1]).to.equal(manualMarker1);

        action(() => autoArgs.marker = autoMarker)();

        expect(captured![0]).to.equal(autoMarker);
        expect(captured![1]).to.equal(undefined);

        trigger.triggerManaully(manualMarker2);

        expect(captured![0]).to.equal(autoMarker);
        expect(captured![1]).to.equal(manualMarker2);
    });

    it('returns disposer', () => {

        const autoMarker1 = '555777';
        const autoMarker2 = '111999';
        const autoArgs = observable({
            marker: ''
        });

        let captured: (string | undefined)[] | undefined;
        const disposer = reactionWithManualTrigger(
            (manual: string | undefined) => [autoArgs.marker, manual],
            (args) => {
                captured = args;
            }
        );

        expect(typeof disposer === 'function').to.equal(true);
        expect(disposer.$mobx !== undefined).to.equal(true);

        expect(captured).to.equal(undefined);

        action(() => autoArgs.marker = autoMarker1)();

        expect(captured![0]).to.equal(autoMarker1);
        expect(captured![1]).to.equal(undefined);
        captured = undefined;

        disposer();

        action(() => autoArgs.marker = autoMarker2)();
        expect(captured === undefined).to.equal(true);
    });

    it('passes IReactionPublic to expression and effect', () => {
        const autoMarker = '555777';
        const autoArgs = observable({
            marker: ''
        });

        let captured: [IReactionPublic | undefined, IReactionPublic | undefined] = [undefined, undefined];
        reactionWithManualTrigger(
            (manual: string | undefined, r) => {
                captured[0] = r;
                return autoArgs.marker;
            },
            (args, r) => {
                captured[1] = r;
            }
        );

        expect(captured[0] !== undefined).to.equal(true);
        expect(captured[1] === undefined).to.equal(true);

        action(() => autoArgs.marker = autoMarker)();

        expect(captured[0] === captured[1]).to.equal(true);
        expect(typeof captured![0]!.dispose === 'function').to.equal(true);
    });

    it('passes options to underlying reaction', () => {

        let captured: [IReactionPublic | undefined, IReactionPublic | undefined] = [undefined, undefined];
        reactionWithManualTrigger(
            (manual: string | undefined, r) => {
                captured[0] = r;
            },
            (args, r) => {
                captured[1] = r;
            }
        );

        expect(captured[0] !== undefined).to.equal(true);
        expect(captured[1] === undefined).to.equal(true);

        captured = [undefined, undefined];

        reactionWithManualTrigger(
            (manual: string | undefined, r) => {
                captured[0] = r;
            },
            (auto, r) => {
                captured[1] = r;
            },
            { fireImmediately: true });

        expect(captured[0] !== undefined).to.equal(true);
        expect(captured[1] !== undefined).to.equal(true);
    });
});