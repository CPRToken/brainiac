//sections/dashboard/images/thumbnail-card.tsx
import type { FC } from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { format } from 'date-fns';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import Box from '@mui/material/Box';
import { storage } from "src/libs/firebase";
import Typography from '@mui/material/Typography';
import { usePopover } from 'src/hooks/use-popover';
import type { Item } from 'src/types/file-manager';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { ImagesMenu } from './images-menu';

interface ThumbnailCardProps {
  item: Item;
  imageUrls?: string;
  onDelete?: (itemId: string) => void;
  onFavorite?: (itemId: string, value: boolean) => void;
  onOpen?: () => void;
}

export const ThumbnailCard: FC<ThumbnailCardProps> = (props) => {
  const { imageUrls, item, onDelete, onOpen } = props;
  const uid = item.uid;
  const popover = usePopover<HTMLButtonElement>();

  const handleDelete = useCallback((): void => {
    popover.handleClose();
    onDelete?.(item.id);
  }, [item, popover, onDelete]);

  let size = bytesToSize(item.size);
  if (item.type === 'folder') {
    size += `• ${item.itemsCount} items`;
  }
  const createdAt = item.createdAt ? format(new Date(item.createdAt), 'dd MMM, yyyy') : 'N/A';

  return (
    <>
      <Card
        key={item.id}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 0,
          transition: (theme) =>
            theme.transitions.create(['background-color, box-shadow'], {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          '&:hover': {
            backgroundColor: 'background.paper',
            boxShadow: 16,
          },
        }}
        variant="outlined"
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{ pt: 1, px: 2 }}
        >
          {imageUrls && (
            <Image
              src={imageUrls}
              alt="Thumbnail"
              width={1024}
              height={1024}
              layout="responsive"
              onClick={onOpen}
            />
          )}
        </Stack>
        <Box sx={{ p: 2 }}>
          <Divider sx={{ my: 1 }} />
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
            <div></div>
          </Stack>
          <Typography color="text.secondary" variant="caption"></Typography>
        </Box>
        <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
          <SvgIcon fontSize="small">
            <DotsVerticalIcon />
          </SvgIcon>
        </IconButton>
      </Card>
      <ImagesMenu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        onDelete={handleDelete}
        open={popover.open}
        uid={uid}
        fileName={item.name}
        storage={storage}
        imageUrl={imageUrls || ''} // Passing imageUrl for download
      />
    </>
  );
};


ThumbnailCard.propTypes = {
  // @ts-ignore
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  onOpen: PropTypes.func,
};
