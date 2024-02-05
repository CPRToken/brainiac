import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import type { SxProps } from '@mui/system/styleFunctionSx';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import {typography} from "src/theme/typography";;

import { RouterLink } from 'src/components/router-link';




interface PostCardProps {
  title: string;
  category: string;
  content?: string;
  createdAt: number;
  htmlContent?: string;
   shortDescription: string;
   onClick?: () => void;


  sx?: SxProps;

}

export const PostCard: FC<PostCardProps> = (props) => {
  const {
    title,
    category,
    content,
    htmlContent,
    createdAt,
    shortDescription,


    ...other
  } = props;

  const formattedPublishedAt = Number.isFinite(createdAt) // Check if createdAt is a finite number
    ? format(new Date(createdAt), 'MMM dd, yyyy')
    : 'Invalid date';

  return (
    <Card {...other}>
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Chip label={category} />
        </Box>
        <Link
          color="text.primary"
          component={RouterLink}
          href={`/dashboard/content/${encodeURIComponent(title)}`}
          variant="h6"
        >
          {title}
        </Link>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            ...typography.body2, // Adjust styling as necessary
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
