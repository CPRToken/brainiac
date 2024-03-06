import type { FC } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import type { SxProps } from '@mui/system/styleFunctionSx';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useRouter } from 'next/router';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import {typography} from "src/theme/typography";;

import { RouterLink } from 'src/components/router-link';




interface PostCardProps {
  id: string;
  title: string;
  category: string;
  content?: string;
  createdAt: number;
  htmlContent?: string;
   shortDescription: string;
   onClick?: () => void;
  onDelete: () => void; // Add this line

  sx?: SxProps;

}

export const PostCard: FC<PostCardProps> = (props) => {
  const {
    id,
    title,
    category,
    content,
    htmlContent,
    createdAt,
    shortDescription,
    onDelete,

    ...other
  } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const router = useRouter();
  const handleEdit = () => {
    router.push(`/dashboard/content/${encodeURIComponent(title)}`);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card {...other} sx={{ position: 'relative', ...other.sx }}>
      <IconButton
        aria-label="more"
        aria-controls="post-card-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="post-card-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: '0.800rem' }}>
          {t(tokens.form.edit)}
        </MenuItem>

        <MenuItem onClick={() => { handleClose(); onDelete(); }} sx={{ fontSize: '0.800rem' }}>
          {t(tokens.form.delete)} {/* Now correctly calls the onDelete prop */}
        </MenuItem>

      </Menu>
      <CardContent>



        <Box sx={{ mb: 1 }}>
          <Chip label={category} />
        </Box>
        <Box>
          <Typography
            variant="h6" // This sets the typography style for the title
            sx={{
              paddingX: 0, // Adds padding on the left and right
              // Add any additional styling here
            }}
          >
            <Link
              color="text.primary"
              component={RouterLink}
              href={`/dashboard/content/${encodeURIComponent(title)}`}
              sx={{
                textDecoration: 'none', // Optional: remove the underline from the link
                // Add any additional link-specific styling here
              }}
            >
              {title}
            </Link>
          </Typography>
        </Box>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            mb:0,
            ...typography.caption, // Adjust styling as necessary
          }}
          variant="body2"
        >
          {shortDescription}
        </Typography>
        {/* Render content, assuming it's safe HTML */}

      </CardContent>
    </Card>
  );
};

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  content: PropTypes.string,
  htmlContent: PropTypes.string,
  createdAt: PropTypes.number.isRequired,
  shortDescription: PropTypes.string.isRequired,
};
