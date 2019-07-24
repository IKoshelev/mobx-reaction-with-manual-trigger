import { reaction, IReactionPublic, IReactionOptions, IReactionDisposer, observable, action } from 'mobx';

type  ManualTrigger<T> = {
    triggerManaully(manualArg: T): void;
}

export type ReactionDisposerAndManualTrigger<T> = IReactionDisposer & ManualTrigger<T>;

export function reactionWithManualTrigger<TAutomaticArg, TManualArg>(
    expression: ( manualArg: TManualArg | undefined, r: IReactionPublic) => TAutomaticArg, 
    effect: (autoArg: TAutomaticArg, r: IReactionPublic) => void, 
    opts?: IReactionOptions): ReactionDisposerAndManualTrigger<TManualArg> {

        let lastProcessedManualArg:TManualArg | undefined; 
        const observables = observable({
            lastSeenManualArg: undefined as TManualArg | undefined
        });

        const disposer: Partial<ReactionDisposerAndManualTrigger<TManualArg>> 
            = reaction(
        (r: IReactionPublic) => {
            if(observables.lastSeenManualArg !== lastProcessedManualArg) {
                lastProcessedManualArg = observables.lastSeenManualArg;
                return expression(lastProcessedManualArg, r);
            }
            return expression(undefined, r);
        },
        effect,
        opts);

        disposer.triggerManaully = action((manualArg: TManualArg) => {
            observables.lastSeenManualArg = manualArg;
        });

        return disposer as ReactionDisposerAndManualTrigger<TManualArg>;
}