import React, { Component } from 'react';
import { Table, Icon, Popup, Grid, Header } from 'semantic-ui-react';

// let backgroundColor = '#1678C2';
// let backgroundColor2 = '#DB2828';

class RoomCell extends Component {
  check() {
    if (this.props.cellData.available) {
      return '';
    } else {
      //Check if user is admin and is allowed to see popups
      let isAdmin = false;
      for (var i = 0; i < this.props.userList.length; i++) {
        if (
          localStorage.getItem('userId') === this.props.userList[i].id &&
          this.props.userList[i].isAdmin
        ) {
          isAdmin = true;
        }
      }

      //Handle booking time for booking popup
      let startTime = this.props.cellData.booking.startTime;
      let endTime = this.props.cellData.booking.endTime;
      let startTimeFixed = startTime.substring(0, startTime.length - 3);
      let endTimeFixed = endTime.substring(0, endTime.length - 3);

      //Handle the change from userId to user's name
      let userId = this.props.cellData.booking.userId;
      let username = 'Ei löytynyt';

      for (i = 0; i < this.props.userList.length; i++) {
        if (userId === this.props.userList[i].id) {
          username =
            this.props.userList[i].firstName +
            ' ' +
            this.props.userList[i].lastName;
        }
      }
      if (this.props.cellData.users) {
        if (isAdmin) {
          return (
            <Popup
              position='top center'
              hideOnScroll
              basic
              trigger={<Icon circular name='user' />}
            >
              <Grid centered>
                <Grid.Column textAlign='center'>
                  <Header as='h4'>Varauksen tiedot</Header>

                  <p>
                    Huoneen nimi:<b> {this.props.roomName}</b>
                    <br />
                    Ajankohta:{' '}
                    <b>
                      {' '}
                      {startTimeFixed}-{endTimeFixed}{' '}
                    </b>
                    <br />
                    Varaajan nimi:<b> {username}</b>
                  </p>
                </Grid.Column>
              </Grid>
            </Popup>
          );
        } else {
          return <Icon circular name='user' />;
        }
      } else {
        // return <Icon size='large' color='red' name='ban'/> =red ban-icon for grey background
        if (isAdmin) {
          return (
            <Popup
              position='top center'
              hideOnScroll
              basic
              trigger={<Icon size='large' name='ban' />}
            >
              <Grid centered>
                <Grid.Column textAlign='center'>
                  <Header as='h4'>Varauksen tiedot</Header>
                  <p>
                    Huoneen nimi:<b> {this.props.roomName}</b>
                    <br />
                    Ajankohta:{' '}
                    <b>
                      {' '}
                      {startTimeFixed}-{endTimeFixed}{' '}
                    </b>
                    <br />
                    Varaajan nimi:<b> {username}</b>
                  </p>
                </Grid.Column>
              </Grid>
            </Popup>
          );
        } else {
          return <Icon size='large' name='ban' />;
        }
      }
    }
  }

  render() {
    let backgroundColor = 'inherit';

    if (!this.props.cellData.available && this.props.cellData.users) {
      backgroundColor = '#7bace4';
    } else if (!this.props.cellData.available) {
      // backgroundColor = '#cfcfcf'; =grey
      backgroundColor = '#fc9fa3';
    }

    return (
      <Table.Cell textAlign={'center'} style={{ backgroundColor }}>
        {this.check()}
      </Table.Cell>
    );
  }
}

export default RoomCell;
