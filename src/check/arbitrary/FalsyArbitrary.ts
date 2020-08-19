import { Arbitrary } from './definition/Arbitrary';
import { constantFrom } from './ConstantArbitrary';

/**
 * Constraints to be applied on {@link fast-check#falsy}
 * @public
 */
export interface FalsyContraints {
  withBigInt?: boolean;
}

/**
 * Typing for values generated by {@link fast-check#falsy}
 * @public
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type FalsyValue<TConstraints extends FalsyContraints = {}> =
  | false
  | null
  | 0
  | ''
  | typeof NaN
  | undefined
  | (TConstraints extends { withBigInt: true } ? 0n : never);

/**
 * For falsy values:
 * - ''
 * - 0
 * - NaN
 * - false
 * - null
 * - undefined
 * - 0n (whenever withBigInt: true)
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @public
 */
function falsy<TConstraints extends FalsyContraints>(constraints?: TConstraints): Arbitrary<FalsyValue<TConstraints>> {
  if (!constraints || !constraints.withBigInt) return constantFrom<FalsyValue[]>(false, null, undefined, 0, '', NaN);
  else return constantFrom<FalsyValue<TConstraints>[]>(false, null, undefined, 0, '', NaN, BigInt(0) as any);
}

export { falsy };
