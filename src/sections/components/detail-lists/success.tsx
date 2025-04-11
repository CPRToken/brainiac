import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import {tokens} from "src/locales/tokens";
import {useTranslation} from "react-i18next";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { typography } from 'src/theme/typography';
import Typography from '@mui/material/Typography';
import { getAuth } from 'firebase/auth';
import { socialApi } from 'src/api/social/socialApi';
import type { Profile } from 'src/types/social';

export const Success: FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { t } = useTranslation();

  const fetchProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userProfile = await socialApi.getProfile({ uid: user.uid });
        setProfile(userProfile);
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
        p: 3,
      }}
    >
      <Card>
        <CardHeader
          title={
            <Typography sx={{ ...typography.h6 }}>
              {t(tokens.form.thankYouSubscribe)}
            </Typography>
          }
        />
        <Divider />

        <Table>
          <TableBody>
            <TableRow>


            </TableRow>
            <TableRow>

              <TableCell>

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
