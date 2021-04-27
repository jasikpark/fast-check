import { Arbitrary } from '../check/arbitrary/definition/Arbitrary';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters';
import { constantFrom } from './constantFrom';
import { nat } from './nat';
import { oneof } from './oneof';
import { tuple } from './tuple';

/** @internal */
function ipV4ExtendedMapper(t: string[]): string {
  return t.join('.');
}

/** @internal */
function ipV4ExtendedUnmapper(value: unknown): string[] {
  if (typeof value !== 'string') throw new Error('Invalid type received');
  return value.split('.');
}

/** @internal */
function natReprMapper(definition: [string, number]): string {
  switch (definition[0]) {
    case 'oct':
      return `0${Number(definition[1]).toString(8)}`;
    case 'hex':
      return `0x${Number(definition[1]).toString(16)}`;
    case 'dec':
    default:
      return String(definition[1]);
  }
}

/** @internal */
function natReprUnmapper(value: unknown): [string, number] {
  if (typeof value !== 'string') throw new Error('Invalid type received');
  if (value.length === 0) throw new Error('Invalid string received (empty)');
  if (value[0] === '0') {
    if (value[1] === 'x') {
      const parsed = Number.parseInt(value, 16);
      if (parsed.toString(16) !== value.substr(2)) throw new Error('Invalid string received (hex invalid)');
      return ['hex', parsed];
    } else {
      const parsed = Number.parseInt(value, 8);
      if (parsed.toString(8) !== value.substr(2)) throw new Error('Invalid string received (oct invalid)');
      return ['oct', parsed];
    }
  }
  return ['dec', Number(value)];
}

/**
 * For valid IP v4 according to WhatWG
 *
 * Following {@link https://url.spec.whatwg.org/ | WhatWG}, the specification for web-browsers
 *
 * There is no equivalent for IP v6 according to the {@link https://url.spec.whatwg.org/#concept-ipv6-parser | IP v6 parser}
 *
 * @remarks Since 1.17.0
 * @public
 */
export function ipV4Extended(): Arbitrary<string> {
  const natRepr = (maxValue: number) =>
    convertFromNext(
      convertToNext(tuple(constantFrom('dec', 'oct', 'hex'), nat(maxValue))).map(natReprMapper, natReprUnmapper)
    );
  return oneof(
    convertFromNext(
      convertToNext(tuple(natRepr(255), natRepr(255), natRepr(255), natRepr(255))).map(
        ipV4ExtendedMapper,
        ipV4ExtendedUnmapper as (possiblyU: unknown) => [string, string, string, string]
      )
    ),
    convertFromNext(
      convertToNext(tuple(natRepr(255), natRepr(255), natRepr(65535))).map(
        ipV4ExtendedMapper,
        ipV4ExtendedUnmapper as (possiblyU: unknown) => [string, string, string]
      )
    ),
    convertFromNext(
      convertToNext(tuple(natRepr(255), natRepr(16777215))).map(
        ipV4ExtendedMapper,
        ipV4ExtendedUnmapper as (possiblyU: unknown) => [string, string]
      )
    ),
    natRepr(4294967295)
  );
}
