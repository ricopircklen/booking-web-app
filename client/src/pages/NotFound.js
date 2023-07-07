import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
export default function NotFound() {
  return (
    <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          Valitettavasti jokin meni vikaan.
        </Header>
        <h3>Tarkista verkko-osoitteesi tai yritä myöhemmin uudelleen.</h3>
      </Grid.Column>
    </Grid>
  );
}
