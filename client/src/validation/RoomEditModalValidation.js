
const validateRoomEditModal = (data) => {

    if(data.name === "") {
        throw new Error("Uutta nimeä ei ole syötetty")
    }
    if(data.capacity === "") {
        throw new Error("Huoneen uutta kapasiteettia ei ole syötetty")
    }
    return true;
};
export default validateRoomEditModal;