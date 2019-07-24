import { IReactionPublic, IReactionOptions, IReactionDisposer } from 'mobx';
declare type ManualTrigger<T> = {
    triggerManaully(manualArg: T): void;
};
export declare type ReactionDisposerAndManualTrigger<T> = IReactionDisposer & ManualTrigger<T>;
export declare function reactionWithManualTrigger<TAutomaticArg, TManualArg>(expression: (manualArg: TManualArg | undefined, r: IReactionPublic) => TAutomaticArg, effect: (autoArg: TAutomaticArg, r: IReactionPublic) => void, opts?: IReactionOptions): ReactionDisposerAndManualTrigger<TManualArg>;
export {};
