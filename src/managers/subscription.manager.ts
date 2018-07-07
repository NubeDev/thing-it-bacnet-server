import { Subscription } from 'rxjs';

export class SubscriptionManager {
    private subscription: Map<string, Subscription>;

    /**
     * Adds the instance of the `Subscription` to the Map with subscriptions
     *
     * @type {Subscription}
     */
    public add (subId: string, sub: Subscription) {
        this.subscription.set(subId, sub);
    }

    /**
     * Inits the subscription storage
     *
     * @return {void}
     */
    public async initManager (): Promise<void> {
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
