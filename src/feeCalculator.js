function calculateFee({
    amount,
    rate = 0.1,
    flatFee = 0,
    freeThreshold = 0,
    minFee = 0,
    maxFee = null,
} = {}) {
    if (!Number.isFinite(amount)) {
        throw new TypeError('amount must be a finite number');
    }

    if (!Number.isFinite(rate) || rate < 0) {
        throw new TypeError('rate must be a finite number greater than or equal to zero');
    }

    if (!Number.isFinite(flatFee) || flatFee < 0) {
        throw new TypeError('flatFee must be a finite number greater than or equal to zero');
    }

    if (!Number.isFinite(freeThreshold) || freeThreshold < 0) {
        throw new TypeError('freeThreshold must be a finite number greater than or equal to zero');
    }

    if (!Number.isFinite(minFee) || minFee < 0) {
        throw new TypeError('minFee must be a finite number greater than or equal to zero');
    }

    if (maxFee !== null && (!Number.isFinite(maxFee) || maxFee < 0)) {
        throw new TypeError('maxFee must be null or a finite number greater than or equal to zero');
    }

    if (amount < 0) {
        throw new RangeError('amount cannot be negative');
    }

    if (amount >= freeThreshold && freeThreshold > 0) {
        return 0;
    }

    const computedFee = amount * rate + flatFee;
    const feeWithMinimum = Math.max(computedFee, minFee);

    if (maxFee !== null) {
        return Number(Math.min(feeWithMinimum, maxFee).toFixed(2));
    }

    return Number(feeWithMinimum.toFixed(2));
}

module.exports = {
    calculateFee,
};
