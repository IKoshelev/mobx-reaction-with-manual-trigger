# mobx-reaction-with-manual-trigger

Small wrapper over MobX reaction for cases where you 
would like to trigger reaction manually sometimes with additional args.


```typescript
        const autoMarker = '555777';
        const manualMarker = '111999';
        const autoArgs = observable({
            marker: ''
        });

        const disposerAndTrigger = reactionWithManualTrigger(
            () => autoArgs.marker,
            (autoArg, manualArg: string | undefined) => {
                // `manualArg` arg is only passed during manual trigger 
                //...
            }
        );

        // this will trigger effect function with 
        // args of ('555777', undefined)
        action(() => autoArgs.marker = autoMarker)();

        // this will trigger effect function with 
        // args of ('555777', '111999')
        disposerAndTrigger.triggerManaully(manualMarker);
```