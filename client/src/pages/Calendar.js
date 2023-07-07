import React, {Component} from 'react';
import BookingForm from '../components/BookingForm';
import {Responsive} from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import RoomTable from "../components/RoomTable";

class Calendar extends Component {
    render() {
        return (
            <div>
                <Responsive
                    minWidth={768}
                    style={{
                        backgroundColor: 'white',
                        paddingTop: '5px',
                        paddingBottom: '20px',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                    }}
                >
                    <RoomTable/>
                    <div style={{marginTop: 20}}>
                        <BookingForm/>
                    </div>
                </Responsive>
                <Responsive
                    {...Responsive.onlyMobile}
                    style={{
                        backgroundColor: 'white',
                        paddingTop: '5px',
                        paddingBottom: '20px'
                    }}
                >
                    <RoomTable/>
                    <div style={{marginTop: 20}}>
                        <BookingForm/>
                    </div>
                </Responsive>
            </div>
        );
    }
}

export default Calendar;
