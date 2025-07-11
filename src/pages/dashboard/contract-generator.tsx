import type { NextPage } from 'next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";
import Hidden from '@mui/material/Hidden';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MyContent } from 'src/sections/dashboard/file-manager/my-content';
import { usePageView } from 'src/hooks/use-page-view';
import { ContractGenerator } from 'src/sections/components/forms/contract-generator';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import {socialApi} from "src/api/social/socialApi";
import type { Profile } from 'src/types/social';
import { auth } from '../../libs/firebase';
import {useEffect, useState} from "react";

const Page: NextPage = () => {
  usePageView();

  const { t } = useTranslation();
  const [uid] = useState<string | null>(auth.currentUser ? auth.currentUser.uid : null);
  const [user, setUser] = useState<Profile | null>(null);
  const settings = {
    stretch: false // Replace with your actual settings value
  };

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);



      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  usePageView();

  return (
    <>
      <Seo title="Contract Generator" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth="xl"  // Set the max width to medium (you can use 'sm', 'md', 'lg', etc.)
          sx={{
            mx: 'auto',  // Center the container horizontally
            px: 3       // Optional padding for extra space on the sides
          }}
        >
          <Grid
            container
            justifyContent="center"
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={4}
              >
                <div>
                  <Typography
                      variant="h5">{t(tokens.headings.contractGenerator)}</Typography>
                </div>

                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >

                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={9}
              sx={{
                paddingLeft: 2, // Add padding here
                // Or if you prefer margin: marginLeft: 2
              }}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <Box paddingTop={4}>
                  {user && (
                      <ContractGenerator

                      />
                  )}

                </Box>
              </Stack>
            </Grid>

          </Grid>
        </Container>
      </Box>



    </>
  );

};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
