// Admin panel
// import React, { useState, useEffect } from 'react';
import React from 'react';
import {Container, Header, Icon, Tab, Responsive} from 'semantic-ui-react';
import Rooms from "../components/admin/Rooms";
import Users from "../components/admin/Users";
import Bookings from "../components/admin/Bookings";

function Admin() {

  const panes = [
    { menuItem: 'Käyttäjät', render: () => <Tab.Pane><Users/></Tab.Pane> },
    { menuItem: 'Huoneet', render: () => <Tab.Pane><Rooms/></Tab.Pane> },
    { menuItem: 'Varaukset', render: () => <Tab.Pane><Bookings/></Tab.Pane> },
  ];

  return (
      <div>
        <Responsive minWidth={768} style={{backgroundColor: 'white',
          paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px',
          paddingRight: '20px'}}>
          <Header as='h2' block>
            <Icon name='shield' />
            <Header.Content>
              Admin-paneeli
            </Header.Content>
          </Header>
          <Container style={{overflow:'auto'}}>
          <Tab panes={panes} />
          </Container>
        </Responsive>
        <Responsive {...Responsive.onlyMobile} style={{backgroundColor: 'white',
          paddingTop: '20px', paddingBottom: '20px', marginLeft: '0px!important', marginRight: '0px!important'}}>
          <Header as='h2' block>
            <Icon name='shield' />
            <Header.Content>
              Admin-paneeli
            </Header.Content>
          </Header>
          <Container style={{overflow:'auto'}}>
            <Tab panes={panes} />
          </Container>
        </Responsive>
      </div>
  );
}

export default Admin;
