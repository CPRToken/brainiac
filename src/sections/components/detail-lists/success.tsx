import type { FC } from 'react';
import { useEffect, useState } from 'react';
import CurrencyDollarIcon from '@untitled-ui/icons-react/build/esm/CurrencyDollar';
import ReceiptIcon from '@untitled-ui/icons-react/build/esm/Receipt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { getAuth } from 'firebase/auth';
import { socialApi } from 'src/api/social/socialApi';
import type { Profile } from 'src/types/social';

export const Success: FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

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
        <CardHeader title="Thank you for subscribing!" />
        <Divider />

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Paid</Typography>
              </TableCell>
              <TableCell>
                <Typography color="text.secondary" variant="body2">
                  {profile ? `${profile.plan}` : 'Loading...'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Plan</Typography>
              </TableCell>
              <TableCell>
                <Typography color="text.secondary" variant="body2">
                  {profile ? `${profile.plan}` : 'Loading...'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Start Date</Typography>
              </TableCell>
              <TableCell>
                <Typography color="text.secondary" variant="body2">
                  {profile ? `(${profile.planStartDate})` : 'Loading...'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Gross Income</Typography>
              </TableCell>
              <TableCell>

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
