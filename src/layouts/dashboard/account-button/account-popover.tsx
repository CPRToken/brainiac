//src/layouts/dashboard/account-button/account-popover.tsx
import type { FC } from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import SvgIcon from '@mui/material/SvgIcon';
import HelpCircleIcon from '@untitled-ui/icons-react/build/esm/HelpCircle';
import Typography from '@mui/material/Typography';
import {t} from "i18next";
import { RouterLink } from 'src/components/router-link';
import {socialApi} from "../../../api/social/socialApi";
import React, { useState, useEffect } from 'react';
import { Profile } from "../../../types/social";
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {tokens} from "src/locales/tokens";
import { useTranslation } from 'react-i18next';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
  name?: string;
  email?: string;
  plan?: string;

}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'Basic':
      return '#cd7f32'; // Bronze
    case 'Premium':
      return '#c0c0c0'; // Silver
    case 'Business':
      return '#ffd700'; // Gold
    case 'Trial':
      return '#00bfff'; // Light Blue
    default:
      return 'gray';
  }
};


const PlanDot: FC<{ plan: string }> = ({ plan }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: getPlanColor(plan),
      marginRight: 1,
    }}
  />
);
export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState<Profile | null>(null);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;


        try {
          const response = await socialApi.getProfile({ uid });

          setUser(response);
        } catch (err) {
          console.error("Error fetching profile data:", err);
        }
      } else {
        // Optionally handle the case when no user is signed in.
        setUser(null);  // for example, reset the profile to null.
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);



  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      onClose?.();

      await auth.signOut();
      router.push('/auth/firebase/login');


    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, [auth, router, onClose]);



  const { t } = useTranslation();


  return (
      <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          disableScrollLock
          onClose={onClose}
          open={!!open}
          PaperProps={{ sx: { width: 230 } }}
          {...other}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2">{user?.name}</Typography>
          <Typography
              color="text.secondary"
              variant="body2"
              sx={{ mb: 1, mt:1 }}
          >
            {user?.email}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
          >
            <PlanDot plan={user?.plan || ''} />
            Plan: {user?.plan}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 0, display: 'flex', alignItems: 'center' }}
          >

            Role: {user?.role}
          </Typography>

        </Box>
        <Box sx={{ p: 0 }}>
          <ListItemButton
            component={RouterLink}
            href={paths.dashboard.support} // adjust path
            onClick={onClose}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 1,
            }}
          >
            <ListItemIcon>
              <SvgIcon fontSize="medium">
                <HelpCircleIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary={<Typography variant="body2">{t(tokens.form.support)}</Typography>} />
          </ListItemButton>
        </Box>

        <Divider />



        <Box sx={{ p: 0 }}>
          <ListItemButton
            component={RouterLink}
            href={paths.dashboard.account}
            onClick={onClose}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 1,
            }}
          >
            <ListItemIcon>
              <SvgIcon fontSize="small">
                <User03Icon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary={<Typography variant="body1">{t(tokens.nav.account)}</Typography>} />
          </ListItemButton>

        </Box>
        <Divider sx={{ my: '0 !important' }} />
        <Box
            sx={{
              display: 'flex',
              p: 1,
              justifyContent: 'center',
            }}
        >
          <Button
              color="inherit"
              onClick={handleLogout}
              size="large"
          >
            {t(tokens.headings.logout)}
          </Button>
        </Box>
      </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  email: PropTypes.string,
  name: PropTypes.string,

};
