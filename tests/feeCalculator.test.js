const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateFee } = require('../src/feeCalculator');

const feeCases = [
    {
        name: 'calculates percentage-based fee for a standard order',
        input: { amount: 100, rate: 0.1 },
        expected: 10,
    },
    {
        name: 'adds flat fee to the percentage calculation',
        input: { amount: 200, rate: 0.1, flatFee: 15 },
        expected: 35,
    },
    {
        name: 'uses the minimum fee when the computed value is lower',
        input: { amount: 25, rate: 0.02, minFee: 5 },
        expected: 5,
    },
    {
        name: 'returns zero when the amount meets the free threshold',
        input: { amount: 1500, rate: 0.1, freeThreshold: 1000 },
        expected: 0,
    },
    {
        name: 'caps the fee at the configured maximum',
        input: { amount: 500, rate: 0.2, maxFee: 25 },
        expected: 25,
    },
    {
        name: 'rounds the result to two decimal places',
        input: { amount: 99.999, rate: 0.15 },
        expected: 15,
    },
];

test('calculateFee should return expected values for valid business rules', () => {
    for (const { name, input, expected } of feeCases) {
        assert.equal(calculateFee(input), expected, name);
    }
});

test('calculateFee should reject invalid numeric inputs', () => {
    assert.throws(() => calculateFee({ amount: -1 }), /amount cannot be negative/);
    assert.throws(() => calculateFee({ amount: 100, rate: -0.1 }), /rate must be a finite number greater than or equal to zero/);
    assert.throws(() => calculateFee({ amount: 100, flatFee: -5 }), /flatFee must be a finite number greater than or equal to zero/);
    assert.throws(() => calculateFee({ amount: 100, freeThreshold: -1 }), /freeThreshold must be a finite number greater than or equal to zero/);
    assert.throws(() => calculateFee({ amount: NaN }), /amount must be a finite number/);
});
