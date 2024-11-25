import React, { FC, useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { ref, listAll, getMetadata } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import { db, auth, storage } from 'src/libs/firebase';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Chart } from 'src/components/chart';
import { tokens } from "../../../locales/tokens";

import type { ApexOptions } from 'apexcharts';



const useChartOptions = (totalUsage: number): ApexOptions => {
  const theme = useTheme();


  return {

    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    labels: [`${totalUsage.toFixed(2)} MB`],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          },
          value: {
            show: false, // Disables the additional value text
          },
        },
        hollow: {
          size: '60%',
        },
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
    theme: { mode: theme.palette.mode },
  };
};

export const TotalMemory: FC = () => {
  const [totalUsage, setTotalUsage] = useState(0); // Total usage in MB
  const chartOptions = useChartOptions(totalUsage);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStorageUsage = async (uid: string) => {
      let totalBytes = 0;

      // Fetch content sizes from Firestore
      const contentQuery = query(collection(db, `users/${uid}/content`));
      const contentSnapshot = await getDocs(contentQuery);
      contentSnapshot.forEach((doc) => {
        const data = JSON.stringify(doc.data());
        totalBytes += new Blob([data]).size; // Calculate bytes for each document
      });

      // Fetch image sizes from Firebase Storage
      const imagesRef = ref(storage, `/${uid}/images/`);
      const imagesList = await listAll(imagesRef);
      const imageSizePromises = imagesList.items.map(async (item) => {
        const metadata = await getMetadata(item);
        return metadata.size; // Get size in bytes
      });
      const imageSizes = await Promise.all(imageSizePromises);
      totalBytes += imageSizes.reduce((sum, size) => sum + size, 0);

      // Convert to MB and update state
      const totalMB = totalBytes / (1024 * 1024); // Convert bytes to MB
      setTotalUsage(totalMB);

      // Update Firestore with the new totalUsage
      try {
        await setDoc(
          doc(db, "users", uid),
          { totalUsage: totalMB },
          { merge: true } // Merge to avoid overwriting existing fields
        );
      } catch (error) {
        console.error("Error updating totalUsage in Firestore:", error);
      }
    };


    const fetchUidAndCalculate = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        fetchStorageUsage(currentUser.uid);
      }
    };

    fetchUidAndCalculate();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.transparent' : 'neutral.100'),
        p: 0,
        height: '100%',
        width: '100%', // Ensures it takes up the full width
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: 'none', // Remove the shadow around the card
          }}
        >
          <CardContent>
            {/* Add the title here */}
            <Typography

              variant="body1"
              align="center"

              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              {t(tokens.form.totalMemory)}
            </Typography>

            {/* Chart component */}
            <Chart
              height={250}

              options={chartOptions}
              series={[totalUsage]} // Pass total usage as series
              type="radialBar"
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
