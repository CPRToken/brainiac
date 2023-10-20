import type { FC } from 'react';
import PropTypes from 'prop-types';


import type { SxProps } from '@mui/system/styleFunctionSx';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
 import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { getInitials } from 'src/utils/get-initials';

interface PostCardProps {

  avatar?: string;
  cover?: string;
  name?: string;
  firstName?: string;
    lastName?: string;
  dob?: string;
  dod?: string;
  email?: string;
  gender?: string;
  originCity?: string,
  highSchool?: string;
  university?: string;
    quote?: string;
  userUrl?: string;
  sx?: SxProps;

}

export const PostCard: FC<PostCardProps> = (props) => {
  const {


    avatar,
    cover,
    name,
      firstName,
        lastName,
      email,
      dob,
      dod,
    gender,
    originCity,
      highSchool,
  university,
  quote,
  userUrl,
        ...other
  } = props;



  return (
      <Card {...other} sx={{ width: '100%', height: { xs: '100%', md: '100%' } }}>
        <CardMedia
            component={RouterLink}
            href={paths.dashboard.capsules.postDetails}
            image={cover}
            sx={{ height: { xs: 90, md: 200 }, paddingBottom: '0px' }}
        />
        <CardContent>
          <Stack alignItems="center" direction="column" spacing={2} sx={{ padding: '0px' }}>
            <Box sx={{
              paddingTop: { xs: '-20px', md: '0px' },
              paddingBottom: { xs: '0px', md: '0px' },
              paddingLeft: '4px',
              paddingRight: '4px'
            }}>
              <Avatar src={avatar} sx={{
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 }
              }}>

              </Avatar>
            </Box>
            <Typography variant="subtitle2"
                sx={{
                  padding: '8px',
                  fontSize: { xs: '1.1rem', sm: '1rem' }
                }}>
              {dob} - {dod}
            </Typography>
          </Stack>
          <Link
              color="text.primary"
              variant="h6"
              sx={{ paddingTop: '0px', paddingBottom: '20px', paddingLeft: '4px', paddingRight: '4px' }}
          >
            {name}
          </Link>
          <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                paddingTop: '4px',
                paddingBottom: '0px',
                paddingLeft: '2px',
                paddingRight: '2px',
                fontSize: { xs: '0.9rem', sm: '0.9rem' }
              }}
              variant="body2"
          >
            {quote}
          </Typography>
          <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              spacing={2}
              sx={{ mt: 2, padding: '2px' }}
          >


          </Stack>
        </CardContent>
      </Card>
  );

};

PostCard.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    dob: PropTypes.string,
  dod: PropTypes.string,
  cover: PropTypes.string.isRequired,
   quote: PropTypes.string.isRequired,
  lastName: PropTypes.string,
};
