import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
    BACnetUnitFamily,
} from '../../../core/enums';

import {
    IEDEUnit,
    Units,
} from '../../../core/interfaces';
import { AliasMap } from '../../../core/alias/alias.map';

import { FunctionalMetadata } from './functional.metadata';
import { CustomUnit } from '../custom.unit';
import { NativeUnit } from '../../native/native.unit';

import * as PRNG from '../../../core/prng';

import * as BACNet from 'tid-bacnet-logic';

export class FunctionalUnit extends CustomUnit {
    public readonly className: string = 'FunctionalUnit';
    public storage: AliasMap<Units.Functional.Function<NativeUnit>>;

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(FunctionalMetadata);
    }

    /**
     * startSimulation - starts the simulation logic of the "function" custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
        const unifFn = this.storage.get('unif');
        if (unifFn.unit) {
            this.uniformDistribution(unifFn);
        }

        const normFn = this.storage.get('norm');
        if (normFn.unit) {
            this.normalDistribution(normFn);
        }
    }

    /**
     * uniformDistribution - implements the simulation logic for uniform distribution.
     *
     * @param  {ICustomFunction<NativeUnit>} unitFn - option of the unit function
     * @return {void}
     */
    private uniformDistribution (unitFn: Units.Functional.Function<NativeUnit>): void {
        const config = unitFn.config;
        const uniformPRNG = new PRNG.UniformPRNG(config);

        this.simulateDistribution(unitFn, uniformPRNG);
    }

    /**
     * normalDistribution - implements the simulation logic for normal distribution.
     *
     * @param  {ICustomFunction<NativeUnit>} unitFn - option of the unit function
     * @return {void}
     */
    private normalDistribution (unitFn: Units.Functional.Function<NativeUnit>): void {
        const config = unitFn.config;
        const normalPRNG = new PRNG.NormalPRNG(config);

        this.simulateDistribution(unitFn, normalPRNG);
    }

    /**
     * genPayloadOfPresentValue - generates payload for "Present Value" BACnet property.
     * Method uses PRNG from arguments to get values for "Present Value" property.
     *
     * @param  {PRNG.PRNGBase} prng - instance of a PRNG
     * @param  {NativeUnit} unit - instance of a native unit
     * @return {void}
     */
    private genPayloadOfPresentValue (prng: PRNG.PRNGBase, unit: NativeUnit):
            BACNet.Types.BACnetTypeBase {
        let randomValue: number = 0;

        switch (unit.family) {
            case BACnetUnitFamily.Analog:
                randomValue = prng.next();
                return new BACNet.Types.BACnetReal(randomValue);
            case BACnetUnitFamily.Binary:
            case BACnetUnitFamily.MultiState:
                randomValue = prng.nextInteger();
                return new BACNet.Types.BACnetUnsignedInteger(randomValue);
            default:
                return null;
        }
    }

    /**
     * simulateDistribution - gets new payload for "Present Value" BACnet property,
     * creates the periodic timer to update the payload of the "Present Value",
     * sets new payload in "Present Value" property.
     *
     * @param  {PRNG.PRNGBase} prng - instance of a PRNG
     * @param  {NativeUnit} unit - instance of a native unit
     * @return {void}
     */
    private simulateDistribution (unitFn: Units.Functional.Function<NativeUnit>, prng: PRNG.PRNGBase): void {
        const unit = unitFn.unit;
        const config = unitFn.config;

        Observable.timer(0, config.freq)
            .subscribe(() => {
                let payload = this.genPayloadOfPresentValue(prng, unit);

                if (_.isNil(payload)) {
                    return;
                }

                unit.storage.setProperty({
                    id: BACNet.Enums.PropertyId.presentValue,
                    payload: payload,
                });
            });
    }

    /**
     * getConfigWithEDE - concatenates the default unit configuration with EDE
     * configuration.
     *
     * @param  {ICustomFunctionConfig} unitConfig - default unit configuration
     * @param  {IEDEUnit} edeUnit - EDE configuration
     * @return {ICustomFunctionConfig} - unit configuration
     */
    public getConfigWithEDE (unitConfig: Units.Functional.Config, edeUnit: IEDEUnit): Units.Functional.Config {
        let max: number = _.isNumber(edeUnit.custUnitMax) && _.isFinite(edeUnit.custUnitMax)
            ? edeUnit.custUnitMax : unitConfig.max;

        let min: number = _.isNumber(edeUnit.custUnitMin) && _.isFinite(edeUnit.custUnitMin)
            ? edeUnit.custUnitMin : unitConfig.min;

        let freq: number = _.isNumber(edeUnit.custUnitFreq) && _.isFinite(edeUnit.custUnitFreq)
            ? edeUnit.custUnitFreq : unitConfig.freq;

        return { min, max, freq };
    }
}
