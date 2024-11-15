//src/sections/dashboard/account/account-security-settings.tsx
import type { FC } from 'react';
import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {typography} from "src/theme/typography";
import type { LoginEvent } from 'src/types/logins';

import { Scrollbar } from 'src/components/scrollbar';

import {useTranslation} from "react-i18next";



interface AccountSecuritySettingsProps {
  loginEvents: LoginEvent[];
}

export const AccountSecuritySettings: FC<AccountSecuritySettingsProps> = (props) => {

  const { t } = useTranslation();
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = useCallback((): void => {
    setIsEditing((prevState) => !prevState);
  }, []);


  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          title="Login history"
          subheader="Your recent login activity"
          titleTypographyProps={{
            sx: {
              ...typography.h6, // Apply your typography styles here
              mb: 3,
              mt: 0,
              pl: 2,
              pr: 0,
              textAlign: 'left'
            }
          }}
          subheaderTypographyProps={{
            sx: {
              mb: 4, // Adjust styling as needed
              pl: 2,
              textAlign: 'left'
            }
          }}
        />
        <CardContent>
          <Scrollbar>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Login type</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Client</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loginEvents.map((event) => {
                  const createdAt = format(event.createdAt, 'HH:mm a MM/dd/yyyy');

                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{event.type}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          on {createdAt}
                        </Typography>
                      </TableCell>
                      <TableCell>{event.ip}</TableCell>
                      <TableCell>{event.userAgent}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountSecuritySettings.propTypes = {
  loginEvents: PropTypes.array.isRequired,
};
