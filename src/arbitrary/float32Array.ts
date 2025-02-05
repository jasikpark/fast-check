import { Arbitrary } from '../check/arbitrary/definition/Arbitrary';
import { float } from '../check/arbitrary/FloatingPointArbitrary';
import { FloatNextConstraints } from '../check/arbitrary/FloatNextArbitrary';
import { array } from './array';

/**
 * Constraints to be applied on {@link float32Array}
 * @remarks Since 2.9.0
 * @public
 */
export type Float32ArrayConstraints = {
  /**
   * Lower bound of the generated array size
   * @remarks Since 2.9.0
   */
  minLength?: number;
  /**
   * Upper bound of the generated array size
   * @remarks Since 2.9.0
   */
  maxLength?: number;
} & FloatNextConstraints;

/**
 * For Float32Array
 * @remarks Since 2.9.0
 * @public
 */
export function float32Array(constraints: Float32ArrayConstraints = {}): Arbitrary<Float32Array> {
  return array(float({ ...constraints, next: true }), constraints).map((data) => Float32Array.from(data));
}
