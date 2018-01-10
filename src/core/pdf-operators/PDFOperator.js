/* @flow */
import { error, addStringToBuffer } from 'utils';
import { validate, isIdentity } from 'utils/validate';

import type { Predicate } from 'utils';

class PDFOperator {
  is = <T>(obj: T) => this instanceof obj;

  toString = (): string =>
    error(`toString() is not implemented on ${this.constructor.name}`);

  bytesSize = (): number =>
    error(`bytesSize() is not implemented on ${this.constructor.name}`);

  copyBytesInto = (buffer: Uint8Array): Uint8Array =>
    error(`copyBytesInto() is not implemented on ${this.constructor.name}`);

  static createSingletonOp = (op: string) => {
    const ENFORCER = Symbol(`${op}_ENFORCER`);

    const Singleton = class extends PDFOperator {
      constructor(enforcer: Symbol) {
        super();
        validate(
          enforcer,
          isIdentity(ENFORCER),
          `Cannot instantiate PDFOperator.${op} - use "${op}.operator" instead`,
        );
      }

      static operator: Singleton;

      toString = () => `${op}\n`;

      bytesSize = (): number => 2;

      copyBytesInto = (buffer: Uint8Array): Uint8Array =>
        addStringToBuffer(this.toString(), buffer);
    };

    Singleton.operator = new Singleton(ENFORCER);

    return Singleton;
  };
}

export default PDFOperator;