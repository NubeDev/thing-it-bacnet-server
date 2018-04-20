import { NoopMetadata } from './noop.metadata';

import { CustomUnit } from '../custom.unit';

export class NoopUnit extends CustomUnit {
    public readonly className: string = 'NoopUnit';

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(NoopMetadata);
    }
}
