import React from 'react';
import { Menu } from 'semantic-ui-react';
export default () => {
  return (
    <Menu className={'ui bottom  menu'}>
      Copyright &copy; {new Date().getFullYear()} Team Academy
    </Menu>
  );
};
