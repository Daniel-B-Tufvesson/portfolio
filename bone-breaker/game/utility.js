
/**
 * Numerically approach the target value from a current value.
 * 
 * @param {number} value - the current value to move away from.
 * @param {number} target - the value to move towards. 
 * @param {number} amount - the size of the step to take towards the target.
 * @returns a value which is closer to the target, or the target if it has been reached.
 */
export function approach(value, target, amount) {
    if (value === target) {
        return target;
    }
    amount = Math.abs(amount);
    if (amount > Math.abs(value - target)) {
        return target;
    }
    else if (value > target) {
        return value - amount;
    }
    else {
        return value + amount;
    }
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min
}