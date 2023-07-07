import React, {Component} from 'react';
import RoomList from "./RoomList";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import fi from 'date-fns/locale/fi';
import {Form} from "semantic-ui-react";

class RoomTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return (
            <div>
                <Form style={{ marginTop: 20 , marginBottom: 20}}>
                    <Form.Group>
                        <Form.Input>
                            <DatePicker
                                dateFormat='dd/MM/yyyy'
                                selected={this.state.startDate}
                                onChange={this.handleDateChange}
                                locale={fi}
                                onFocus={(e) => e.target.readOnly = true}
                            />
                        </Form.Input>
                    </Form.Group>
                </Form>
                <div style={{overflow:'auto'}}>
                <RoomList date={this.state.startDate}/>
            </div>
            </div>
        );
    }
}

export default RoomTable;