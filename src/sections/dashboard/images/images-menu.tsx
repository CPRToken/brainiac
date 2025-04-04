//sections/dashboard/images/images-menu.tsx
import type { FC } from 'react';
import PropTypes from 'prop-types';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import Download03Icon from '@untitled-ui/icons-react/build/esm/Download03'; // Add a download icon if available
import { firebaseDelete } from "src/utils/firebaseDelete";
import Menu from '@mui/material/Menu';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

interface ItemMenuProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
  onDelete?: () => void;
  open?: boolean;
  uid: string | null;
  fileName: string;
  storage: any;
  imageUrl: string; // <-- added
}

export const ImagesMenu: FC<ItemMenuProps> = (props) => {
  const { anchorEl, onClose, open, onDelete, uid, fileName, imageUrl } = props;

  const deleteFile = async () => {
    if (uid === null || fileName === null) return;

    const storagePath = `${uid}/images/${fileName}`;
    const collectionName = "yourFirestoreCollectionName"; // replace this
    const documentId = fileName;

    const { success, error } = await firebaseDelete(storagePath, collectionName, documentId);

    if (success) {
      console.log("File deleted successfully");
    } else {
      console.error("Error deleting file: ", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      onClose?.();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };


  return (
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
      <MenuItem onClick={handleDownload}>
        <SvgIcon fontSize="small">
          <Download03Icon /> {/* fallback: use a generic icon if you don’t have this */}
        </SvgIcon>
        Download
      </MenuItem>

      <MenuItem
        onClick={() => {
          deleteFile();
          onDelete?.();
        }}
        sx={{ color: 'error.main' }}
      >
        <SvgIcon fontSize="small">
          <Trash02Icon />
        </SvgIcon>
        Delete
      </MenuItem>
    </Menu>
  );
};

ImagesMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  imageUrl: PropTypes.string.isRequired, // <-- add this
};
