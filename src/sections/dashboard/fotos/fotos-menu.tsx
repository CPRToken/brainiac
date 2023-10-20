import type { FC } from 'react';
import PropTypes from 'prop-types';

import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';




import Menu from '@mui/material/Menu';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

interface ItemMenuProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
  onDelete?: () => void;
  open?: boolean;


}


export const FotosMenu: FC<ItemMenuProps> = (props) => {
  const {anchorEl, onClose, open, onDelete } = props; // <-- Add this line


  let element = <><>
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={open || false}
        onClose={onClose}

        sx={{
          [`& .${menuItemClasses.root}`]: {
            fontSize: 14,
            '& svg': {
              mr: 1,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
    >

      <MenuItem
          onClick={onDelete}
          sx={{color: 'error.main'}}
      >
        <SvgIcon fontSize="small">
          <Trash02Icon/>
        </SvgIcon>
        Delete
      </MenuItem>
    </Menu>


  </>
  </>;
  return element;
};

FotosMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
     open: PropTypes.bool,

};
