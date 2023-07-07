import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function AdminRoute({ component: RouteComponent, ...rest }) {
    const { currentUser } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={routeProps =>
                !!currentUser.isadmin ? (
                    <RouteComponent {...routeProps} />
                ) : (
                    <Redirect to={'/login'} />
                )
            }
        />
    );
}

export default AdminRoute;