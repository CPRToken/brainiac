import React, { useEffect, useState } from "react";
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { auth, db } from "../../libs/firebase";
import { collection, doc, getDoc, query } from 'firebase/firestore';

const Page: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<any | null>(null); // Adjust type as needed
  const { t } = useTranslation();

  useTheme();

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error("User data not found");
          return;
        }

        setUser(userDoc.data()); // Set user data directly from Firestore

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  return (

      <Container>
        <Stack spacing={3}>
          <Paper>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography variant="h6">{t('profile')}</Typography>
              {/* Display user details as needed */}
              {user && (
                <div>
                  <p>Plan: {user.plan}</p>
                  <p>Price ID: {user.priceId}</p>
                </div>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>

  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
