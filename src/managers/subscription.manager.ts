import { Subscription } from 'rxjs';

export class SubscriptionManager {
    private subscription: Map<string, Subscription>;

    /**
     * Adds the instance of the `Subscription` to the Map with subscriptions
     *
     * @type {Subscription}
     */
    public add (subId: string, sub: Subscription) {
        const oldSub = this.subscription.get(subId);
        if (oldSub) {
            oldSub.unsubscribe();
        }
        this.subscription.set(subId, sub);
    }

    /**
     * Gets the instance of the `Subscription` from the Map with subscriptions
     *
     * @type {Subscription}
     */
    public get (subId: string): Subscription {
        return this.subscription.get(subId);
    }

    public delete (subId: string) {
        this.subscription.delete(subId)
    }
    /**
     * Inits the subscription storage
     *
     * @return {void}
     */
    public initManager (): void {
        this.subscription = new Map();
    }

    /**
     * Destroys the subscription storage
     *
     * @return {void}
     */
    public destroy (): void {
        this.subscription.forEach((data) => data && data.unsubscribe && data.unsubscribe());
        this.subscription.clear();
        this.subscription = null;
    }
}
