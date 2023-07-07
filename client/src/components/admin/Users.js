//Compiling component for user related admin panel components i.e. for inviting new users and user table
import React from 'react';
import {Header} from "semantic-ui-react";
import AdminAllUsers from "./AdminAllUsers";
import AdminInviteUser from "./AdminInviteUser";

function Users() {
    return(
        <div>
            <Header as='h3' attached='top' block >Kutsu uusi käyttäjä</Header>
            <AdminInviteUser/>
            <Header as='h3' attached='top' block >Kaikki käyttäjät</Header>
            <AdminAllUsers/></div>
    )
}
export default Users;