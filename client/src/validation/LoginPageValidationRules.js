/* Includes all validations in both Signup- and Login-pages. 
Returns array of errors. 
These validations are used by UseLoginForm-hook.*/

export default function validate(values) {
    let errors = {};
    
    if (!values.email) {
        errors.email = 'Sähköpostiosoite on pakollinen';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Sähköpostiosoite on virheellinen';
    }
    if (!values.password) {
        errors.password = 'Salasana on pakollinen';
    } else if (values.password.length < 8) {
        errors.password = 'Salasanan tulee olla vähintään 8 merkkiä';
    }
    
    return errors;
};