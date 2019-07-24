import { reaction, IReactionPublic, IReactionOptions, IReactionDisposer, observable, action } from 'mobx';

type  ManualTrigger<T> = {
    triggerManaully(manualArg: T): void;
}

export type ReactionDisposerAndManualTrigger<T> = IReactionDisposer & ManualTrigger<T>;

export function reactionWithManualTrigger<TAutomaticArg, TManualArg>(
    expression: (r: IReactionPublic) => TAutomaticArg, 
    effect: (autoArg: TAutomaticArg, manualArg: TManualArg | undefined,  r: IReactionPublic) => void, 
    opts?: IReactionOptions): ReactionDisposerAndManualTrigger<TManualArg> {

        let lastProcessedManualArg:TManualArg | undefined; 
        const observables = observable({
            lastSeenManualArg: undefined as TManualArg | undefined
        });

        const disposer: Partial<ReactionDisposerAndManualTrigger<TManualArg>> 
            = reaction((r: IReactionPublic) => {

            const args: {
                autoArg: TAutomaticArg,
                manualArg?: TManualArg
            } = {
                autoArg: expression(r)
            }
            
            if(observables.lastSeenManualArg !== lastProcessedManualArg) {
                args.manualArg = lastProcessedManualArg = observables.lastSeenManualArg;
            }

            return args;
        },
        (args, r: IReactionPublic)=>{
            effect(args.autoArg, args.manualArg, r);
        },
        opts);

        disposer.triggerManaully = action((manualArg: TManualArg) => {
            observables.lastSeenManualArg = manualArg;
        });

        return disposer as ReactionDisposerAndManualTrigger<TManualArg>;
}