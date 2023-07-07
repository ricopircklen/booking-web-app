// Compiling page for user settings. Components from the /components/settings-directory are shown on this page
import React from 'react';
import SettingsForm from '../components/settings/SettingsForm';
import PasswordSettings from '../components/settings/PasswordSettings';
import {Container, Header, Icon, Responsive, Message} from 'semantic-ui-react';

function Settings() {
  return (
    <div>
        <Responsive minWidth={768} style={{backgroundColor: 'white',
            paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px',
            paddingRight: '20px'}}>
            <Header as='h2' block>
                <Icon name='settings' />
                <Header.Content>
                    Asetukset
                </Header.Content>
            </Header>
            <Container style={{overflow:'auto'}}>
                <SettingsForm/>
                <PasswordSettings/>
                <Message info>
                    <Message.Header>Haluatko poistaa käyttäjätilisi?</Message.Header>
                    <a href='/contact'>Ota yhteyttä ylläpitäjään.</a>
                </Message>
            </Container>
        </Responsive>
        <Responsive {...Responsive.onlyMobile} style={{backgroundColor: 'white',
            paddingTop: '20px', paddingBottom: '20px', marginLeft: '0px', marginRight: '0px'}}>
            <Header as='h2' block>
                <Icon name='settings' />
                <Header.Content>
                    Asetukset
                </Header.Content>
            </Header>
            <Container style={{overflow:'auto'}}>
                <SettingsForm/>
                <PasswordSettings/>
                <Message info>
                    <Message.Header>Haluatko poistaa käyttäjätilisi?</Message.Header>
                    <a href='/contact'>Ota yhteyttä ylläpitäjään.</a>
                </Message>
            </Container>
        </Responsive>
    </div>
  );
}
export default Settings;
