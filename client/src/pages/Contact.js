import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
export default function Contact() {
    return (
        <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='blue' textAlign='center'>
                    Yhteystiedot:
                </Header>
                <h3>Vesa Meriläinen</h3>
                <h3>Kullberg Consulting Oy</h3>
                <h3>Iso Roobertinkatu 43 A</h3>
                <h3>00120 Helsinki</h3>
                <h3><Icon name='phone'/><a href="tel:+358400944181">0400944181</a></h3>
                <h3><Icon name='mail'/><a href="mailto:vesa@kullberg.fi">vesa@kullberg.fi</a></h3>
            </Grid.Column>
        </Grid>
    );
}