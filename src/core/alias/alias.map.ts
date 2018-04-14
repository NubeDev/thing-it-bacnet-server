import * as _ from 'lodash';

import { Alias } from './alias';
import { ApiError } from '../errors';

export class AliasMap <T> {
    private aliases: Alias[];
    private store: Map<symbol, T>;

    constructor () {
        this.store = new Map();
    }

    /**
     * has - returns "true" if value from internal store exists.
     *
     * @param  {string} aliasTag - alias
     * @return {boolean}
     */
    public has (aliasTag: string): boolean {
        const aliasId = this.getAliasId(aliasTag);
        return this.store.has(aliasId);
    }

    /**
     * get - returns the value from internal store.
     *
     * @param  {string} aliasTag - alias
     * @return {T}
     */
    public get (aliasTag: string): T {
        const aliasId = this.getAliasId(aliasTag);
        return this.store.get(aliasId);
    }

    /**
     * set - sets the value in internal store by alias tag.
     *
     * @param  {string} aliasTag - alias
     * @param  {T} value - new value
     * @return {void}
     */
    public set (aliasTag: string, value: T): void {
        const aliasId = this.getAliasId(aliasTag);

        if (_.isNil(aliasId)) {
            throw new ApiError('AliasMap - set: Alias is not exist!');
        }

        this.store.set(aliasId, value);
    }

    /**
     * getAlias - finds an alias by alias tag.
     *
     * @param  {string} aliasTag - alias
     * @return {AliasUtil} - alias instance
     */
    private getAlias (aliasTag: string): Alias {
        return _.find(this.aliases, (alias) => alias.has(aliasTag));
    }

    /**
     * getAliasId - finds an alias by alias tag and extracts the ID of alias.
     *
     * @param  {string} aliasTag - alias
     * @return {symbol} - ID of alias
     */
    private getAliasId (aliasTag: string): symbol {
        const alias: Alias = this.getAlias(aliasTag);

        return _.isNil(alias) ? null : alias.id;
    }
}
