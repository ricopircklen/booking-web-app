import React, { useContext, useState } from 'react';
import {
  Menu,
  Responsive,
  Icon,
  Dropdown,
  Sidebar,
  Button,
  Image
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function NavBar() {
  const { currentUser, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const [visible, setVisible] = useState(false);

  //Here we define the user's name.
  let username = 'Käyttäjä';

  if (currentUser !== null) {
    if (typeof currentUser !== 'undefined') {
      username = currentUser.username;
    }
  }

  // Handles clicking tasks in desktop-mode.
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const handleHomeItemClick = (e, { name }) => setActiveItem('');

  const handleMobileItemClick = (e, { name }) => {
    setActiveItem(name);
    setVisible(!visible);
  };

  //Handles changes of sidebar visibility in mobile phone-mode.
  const handleToggle = () => {
    setVisible(!visible);
  };

  const navBar = currentUser ? (
    <div>
      <Responsive minWidth={768}>
        <Menu
          pointing
          secondary
          size='large'
          color='blue'
          style={{ backgroundColor: 'white' }}
        >
          <Menu.Item
            style={{ padding: 0 }}
            as={Link}
            to='/home'
            onClick={handleHomeItemClick}
          >
            <Image
              size='small'
              src='/logo3.png'
              style={{ height: 'auto', widht: '100%' }}
            />
          </Menu.Item>
          <Menu.Item
            as={Link}
            to='/bookings'
            name='bookings'
            iconposition='left'
            active={activeItem === 'bookings'}
            onClick={handleItemClick}
          >
            <Icon name='calendar alternate outline' />
            Omat varaukset
          </Menu.Item>
          {currentUser.isadmin && (
            <Menu.Item
              as={Link}
              to='/admin'
              name='admin'
              iconposition='left'
              active={activeItem === 'admin'}
              onClick={handleItemClick}
            >
              <Icon name='shield' />
              Admin
            </Menu.Item>
          )}
          <Menu.Menu position='right'>
            <Dropdown
              trigger={
                <span>
                  <Icon name='user' style={{ color: '#1678C2', size: 'big' }} />
                  {username}
                </span>
              }
              fluid
              className='icon link item'
            >
              <Dropdown.Menu>
                <Menu.Item
                  as={Link}
                  to='/settings'
                  name='Asetukset'
                  icon='settings'
                  iconposition='left'
                  active={activeItem === 'Asetukset'}
                  onClick={handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to='/contact'
                  name='Yhteystiedot'
                  icon='phone'
                  iconposition='left'
                  active={activeItem === 'Yhteystiedot'}
                  onClick={handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to='/login'
                  name='Kirjaudu ulos'
                  icon='log out'
                  iconposition='left'
                  active={activeItem === 'Kirjaudu ulos'}
                  onClick={logout}
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Responsive>
      <Responsive {...Responsive.onlyMobile}>
        <Menu
          pointing
          secondary
          size='small'
          color='blue'
          style={{ backgroundColor: 'white' }}
        >
          <Menu.Item
            as={Link}
            to='/home'
            name='Logo'
            active={activeItem === 'Logo'}
            onClick={handleHomeItemClick}
            style={{ padding: 0 }}
          >
            <Image
              size='small'
              src='/logo3.png'
              style={{ height: 'auto', widht: '100%' }}
            />
          </Menu.Item>
          <Menu.Menu position='right'>
            <Button icon onClick={handleToggle} color='blue'>
              <Icon name='sidebar' />
            </Button>
          </Menu.Menu>
          <Sidebar
            style={{ background: '#1678C2' }}
            animation={'overlay'}
            direction='right'
            vertical='true'
            inverted='true'
            // onHide={handleToggle}
            onHide={() => setVisible(false)}
            width='thin'
            visible={visible}
          >
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/home'
              onClick={handleMobileItemClick}
              name='home'
              active={activeItem === 'home'}
            >
              <Icon name='home' />
              Etusivu
            </Menu.Item>
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/bookings'
              onClick={handleMobileItemClick}
              name='bookings'
              active={activeItem === 'bookings'}
            >
              <Icon name='calendar alternate outline' />
              Omat varaukset
            </Menu.Item>
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/settings'
              name='Asetukset'
              active={activeItem === 'Asetukset'}
              onClick={handleMobileItemClick}
            >
              <Icon name='settings' />
              Asetukset
            </Menu.Item>
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/contact'
              name='Yhteystiedot'
              active={activeItem === 'Yhteystiedot'}
              onClick={handleMobileItemClick}
            >
              <Icon name='phone' />
              Yhteystiedot
            </Menu.Item>
            {currentUser.isadmin && (
              <Menu.Item
                style={{ color: 'white' }}
                as={Link}
                to='/admin'
                onClick={handleMobileItemClick}
                name='admin'
                active={activeItem === 'admin'}
              >
                <Icon name='shield' />
                Admin
              </Menu.Item>
            )}
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/login'
              name='logout'
              active={activeItem === 'logout'}
              onClick={logout}
            >
              <Icon name='log out' />
              Kirjaudu ulos
            </Menu.Item>
          </Sidebar>
        </Menu>
      </Responsive>
    </div>
  ) : (
    <div>
      <Responsive minWidth={768}>
        <Menu
          pointing
          secondary
          size='large'
          color='blue'
          style={{ backgroundColor: 'white' }}
        >
          <Menu.Item
            style={{ padding: 0 }}
            as={Link}
            to='/home'
            onClick={handleHomeItemClick}
          >
            <Image
              size='small'
              src='/logo3.png'
              style={{ height: 'auto', widht: '100%' }}
            />
          </Menu.Item>
          <Menu.Item
            position='right'
            as={Link}
            to='/contact'
            name='Yhteystiedot'
            iconposition='left'
            active={activeItem === 'Yhteystiedot'}
            onClick={handleItemClick}
          >
            <Icon name='phone' />
            Yhteystiedot
          </Menu.Item>
          <Menu.Item
            as={Link}
            to='/login'
            name='login'
            iconposition='left'
            active={activeItem === 'login'}
            onClick={handleItemClick}
          >
            <Icon name='key' />
            Kirjaudu
          </Menu.Item>
        </Menu>
      </Responsive>
      <Responsive {...Responsive.onlyMobile}>
        <Menu
          pointing
          secondary
          size='small'
          color='blue'
          style={{ backgroundColor: 'white' }}
        >
          <Menu.Item
            as={Link}
            to='/home'
            name='Logo'
            active={activeItem === 'Logo'}
            onClick={handleHomeItemClick}
            style={{ padding: 0 }}
          >
            <Image
              size='small'
              src='/logo3.png'
              style={{ height: 'auto', widht: '100%' }}
            />
          </Menu.Item>
          <Menu.Menu position='right'>
            <Button icon onClick={handleToggle} color='blue'>
              <Icon name='sidebar' />
            </Button>
          </Menu.Menu>
          <Sidebar
            style={{ background: '#1678C2' }}
            animation={'overlay'}
            direction='right'
            vertical='true'
            inverted='true'
            // onHide={handleToggle}
            onHide={() => setVisible(false)}
            width='thin'
            visible={visible}
          >
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/login'
              name='login'
              active={activeItem === 'login'}
              onClick={handleMobileItemClick}
            >
              <Icon name='key' />
              Kirjaudu sisään
            </Menu.Item>
            <Menu.Item
              style={{ color: 'white' }}
              as={Link}
              to='/contact'
              name='Yhteystiedot'
              active={activeItem === 'Yhteystiedot'}
              onClick={handleMobileItemClick}
            >
              <Icon name='phone' />
              Yhteystiedot
            </Menu.Item>
          </Sidebar>
        </Menu>
      </Responsive>
    </div>
  );

  return navBar;
}

export default NavBar;
