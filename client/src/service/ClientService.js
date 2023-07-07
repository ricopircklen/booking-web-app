import axios from 'axios';

const baseUrl = 'http://localhost:9999/api';

// @route   GET api/bookings
// @desc    Get all bookings
// @access  Private
export function getAllBookings(setData) {
  axios
    .get(baseUrl + '/bookings', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      return setData(response.data);
    })
    .catch(error => {
      return error.message;
    });
}

export const getAllBookingsPromise = async () => {
  try {
    const result = await axios.get(baseUrl + '/bookings', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
};

// @route   GET api/userbookings/:userId
// @desc    Get all bookings for user
// @access  Private
export function getUserBookings(id, setData) {
  axios
    .get(baseUrl + '/userbookings/' + id, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      return setData(response.data);
    })
    .catch(error => {
      return error.message;
    });
}

export const getUserBookingsPromise = async id => {
  try {
    const result = await axios.get(baseUrl + '/userbookings/' + id, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
};

// @route   POST api/booking
// @desc    Create booking
// @access  Private
export function createBooking(data) {
  return axios
    .post(baseUrl + '/booking', data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function createBookingForAllRooms(data) {
  return axios
    .post(baseUrl + '/booking/allrooms', data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

// @route   GET api/users
// @desc    Get all users
// @access  Private
export function getAllUsers(setUserData) {
  axios
    .get(baseUrl + '/users', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      return setUserData(response.data);
    })
    .catch(error => {
      return error.message;
    });
}

// @route   GET api/rooms
// @desc    Get all rooms
// @access  Private
export function getAllRooms(setRoomData) {
  axios
    .get(baseUrl + '/rooms', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      return setRoomData(response.data);
    })
    .catch(error => {
      return error.message;
    });
}

export function getRoomData(callback) {
  axios
    .get(baseUrl + '/rooms', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(function(rooms) {
      callback(rooms.data);
    })
    .catch(error => {
      return false;
    });
}

// ADMIN SERVICES
export function adminDeleteBooking(id) {
  return axios
    .delete(baseUrl + '/booking/' + id, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminUpdateBooking(id, data) {
  return axios
    .put(baseUrl + /booking/ + id, data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminDeleteRoom(id) {
  return axios
    .delete(baseUrl + '/room/' + id, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminDeleteUser(id) {
  return axios
    .delete(baseUrl + '/user/' + id, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminUpdateRoom(id, data) {
  return axios
    .put(baseUrl + /room/ + id, data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminCreateRoom(data) {
  return axios
    .post(baseUrl + /room/, data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}

export function adminUpdateUser(id, data) {
  return axios
    .put(baseUrl + /user/ + id, data, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch(error => {
      return false;
    });
}
export function getAllUsersAdmin(setUserData) {
  axios
    .get(baseUrl + '/users/admin', {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('jwtToken')
      }
    })
    .then(response => {
      return setUserData(response.data);
    })
    .catch(error => {
      return error.message;
    });
}
