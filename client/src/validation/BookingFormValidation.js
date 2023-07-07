//validates data which is sent with BookingForm

const validateBookingForm = (data) => {
    // console.log('data in form validation', data)

    //user must be set when creating booking as a admin user
    if(data.user_id === '') {
        throw new Error('user has to be selected')
    }

    //room can be booked between 06:00 and 22:00
    if (data.start_time.substring(0,2) < 6) {
        throw new Error('start time is before 6 am')
    }
    if (data.end_time.substring(0,2) > 22) {
        throw new Error('end time is after 22 am')
    }

    //room name must be set
    if (data.room_id === "") {
        throw new Error('room was not set')
    }

    //room can be booked for one day only
    if (data.start_time.substring(0,2) > data.end_time.substring(0,2)) {
        throw new Error('start time cannot be after endtime')
    }
    if ((data.start_time.substring(0,2) === data.end_time.substring(0,2)) &&  (data.start_time.substring(3,5) > data.end_time.substring(3,5))) {
        throw new Error('start time cannot be after endtime')
    }
    if((data.start_time.substring(0,2) === data.end_time.substring(0,2)) &&
        (data.start_time.substring(3,5) === data.end_time.substring(3,5))){
        throw new Error('start and end time cant be same')
    }

    //booking start- and end time must be even or half hour
    if((data.start_time.substring(3,5) === '00' || data.start_time.substring(3,5) === '30')&&
    (data.end_time.substring(3,5) === '00' || data.end_time.substring(3,5) === '30')){
    }else{
        throw new Error('start and end time must be even or half hour')
    }

    // console.log('validation succesfull')
    return true

};

export default validateBookingForm