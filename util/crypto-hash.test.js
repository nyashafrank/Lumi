const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 output', () => {
        expect(cryptoHash('sushi')).toEqual('003a508fc03ae27e3e51683bb5a592501febfcec21feaaba2bc69e1f35c47fa5');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});
