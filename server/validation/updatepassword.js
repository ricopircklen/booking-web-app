const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUpdatePasswordInput(data) {
    let errors = {};

    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = 'Password must be at least 8 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};