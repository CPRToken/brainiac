//src/pages/dashboard/account.tsx
import type { ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from "firebase/firestore";
import { Seo } from 'src/components/seo';

import { useCallback, useState, useEffect } from 'react';
import {socialApi} from "src/api/social/socialApi";
import { Layout as DashboardLayout } from 'src/layouts/dashboard';

import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import type { LoginEvent } from 'src/types/logins';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';
import type { Profile } from 'src/types/social';
import {auth, db} from "../../libs/firebase";
import {tokens} from "../../locales/tokens";
import {useTranslation} from "react-i18next";
import {typography} from "../../theme/typography";
new Date();
const tabs = [
  { label: 'General', value: 'general' },



  { label: 'Security', value: 'security' },
];



const Page: NextPage = () => {
  const [uid, setUid] = useState<string | null>(auth.currentUser ? auth.currentUser.uid : null);
    const [user, setUser] = useState<Profile | null>(null);

  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
    const [currentTab, setCurrentTab] = useState<string>('general');

    const { t } = useTranslation();




  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);          // Use userData instead of fetchedUser


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  useEffect(() => {
    if (currentTab !== 'security' || !uid) return; // Only fetch when security tab is active

    const fetchLoginEvents = async () => {
      try {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setLoginEvents(userSnapshot.data().loginEvents || []);
        }
      } catch (error) {
        console.error("Error fetching login events:", error);
      }
    };

    fetchLoginEvents();
  }, [currentTab, uid]);



  const handleTabsChange = useCallback((event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value);
  }, []);



  return (
    <>
      <Seo title="Dashboard: Account" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography sx={{
              ...typography.h5,
              mb: 6,
              mt: 0,
              pl: 2,
              pr: 0,
              textAlign: 'left'
            }}>{t(tokens.nav.account)}</Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' && user && (
            <AccountGeneralSettings

              email={user.email || ''}
              name={user.name || ''}
              plan={user.plan || ''}
              role={user.role || ''}
            />
          )}

          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && (
            <AccountSecuritySettings loginEvents={loginEvents} />  // Pass the actual state
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
