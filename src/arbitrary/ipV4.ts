import { Arbitrary } from '../check/arbitrary/definition/Arbitrary';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters';
import { nat } from './nat';
import { tuple } from './tuple';

/** @internal */
function ipV4Mapper(t: [number, number, number, number]): string {
  return `${t[0]}.${t[1]}.${t[2]}.${t[3]}`;
}

/** @internal */
function ipV4Unmapper(value: unknown): [number, number, number, number] {
  if (typeof value !== 'string') throw new Error('Invalid type received');
  const chunks = value.split('.');
  if (chunks.length !== 4) throw new Error('Invalid number of chunks');
  return chunks.map((c) => Number(c)) as [number, number, number, number];
}

/**
 * For valid IP v4
 *
 * Following {@link https://tools.ietf.org/html/rfc3986#section-3.2.2 | RFC 3986}
 *
 * @remarks Since 1.14.0
 * @public
 */
export function ipV4(): Arbitrary<string> {
  // IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
  return convertFromNext(convertToNext(tuple(nat(255), nat(255), nat(255), nat(255))).map(ipV4Mapper, ipV4Unmapper));
}
