
const validateUserEditModal = (data) => {

    if(data.firstName === "") {
        throw new Error("first name was not set")
    } else if (data.firstName.length < 2) {
        throw new Error("first name must be at least 2 characters")
    }
    if(data.lastName === "") {
        throw new Error("last name was not set")
    }else if (data.lastName.length < 2) {
        throw new Error("last name must be at least 2 characters")
    }
    if(data.email === "") {
        throw new Error("email was not set")
    }else if (!/\S+@\S+\.\S+/.test(data.email)) {
        throw new Error("email is not valid")
    }
    return true;
};
export default validateUserEditModal;