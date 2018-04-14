import * as _ from 'lodash';

export class AliasUtil {
    private aliases: Set<string>;
    private _id: symbol;

    constructor (aliases?: string|string[]) {
        this.aliases = new Set();
        this._id = Symbol('alias');

        this.add(aliases)
    }

    /**
     * id - unique identifier of alias.
     *
     * @property
     */
    get id (): symbol {
        return this._id;
    }

    /**
     * add - adds the alias or aliases to internal "Set" store.
     *
     * @param  {string|string[]} aliases - list of aliases
     * @return {void}
     */
    public add (aliases: string|string[]): void {
        if (!aliases) {
            return;
        }

        const arrAliases = _.isArray(aliases) ? aliases : [aliases];

        _.map(arrAliases, (alias) => {
            const aliasTagLow = alias.toLowerCase();
            this.aliases.add(aliasTagLow);
        });
    }

    /**
     * has - returns "true" if value exists in internal store.
     *
     * @param  {string} aliasTag - alias
     * @return {boolean}
     */
    public has (aliasTag: string): boolean {
        const aliasTagLow = aliasTag.toLowerCase();
        return this.aliases.has(aliasTagLow);
    }
}
