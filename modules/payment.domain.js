const PAYMENT_STATUS = {
    CREATED: 'CEWATED',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
};

const allowedTransitions = {
    CREATED: ['PROCESSING'],
    PROCESSING: ['SUCCESS', 'FAILED'],
    SUCCESS: [],
    FAILED: [],
};
function canTransition(from, to) {
    return allowedTransitions[from].includes(to);
}
function assertTransition(from, to) {
    if (!canTransition(from, to)) {
        throw new Error(`Invalid status transition from ${from} to ${to}`);
    }
}

module.exports = {
    PAYMENT_STATUS,
    canTransition,
    assertTransition,
};