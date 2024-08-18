//src/sections/components/charts/trial-period.tsx
import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import { db, auth } from 'src/libs/firebase';
import { Chart } from 'src/components/chart';

type ChartSeries = number[];



const TRIAL_WORD_LIMIT = 1500;


const useChartOptions = (): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    labels: ['Word Count'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          },
          value: {
            color: theme.palette.text.secondary,
          },
        },
        hollow: {
          size: '60%',
        },
        track: {
          background: theme.palette.background.default,
        },
      },
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
  };
};

export const TrialPeriod: FC = () => {
  const [wordCount, setWordCount] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
  const theme = useTheme();
  const chartOptions = useChartOptions();

  useEffect(() => {
    const fetchUid = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUid(currentUser.uid);
      }
    };

    fetchUid();
  }, []);

  useEffect(() => {
    const fetchContentData = async (uid: string) => {
      if (!uid) return;

      const contentQuery = query(collection(db, `users/${uid}/content`));
      const contentSnapshot = await getDocs(contentQuery);

      let totalWordCount = 0;
      contentSnapshot.forEach(doc => {
        const data = doc.data();
        const htmlContent = data.htmlContent; // Assuming content is stored in a field called 'htmlContent'
        if (htmlContent) {
          const words = htmlContent.split(/\s+/).filter((word: string) => word.length > 0).length;
          totalWordCount += words;
        }
      });

      setWordCount(totalWordCount);

      // Check if the user has reached the trial word limit
      if (totalWordCount >= TRIAL_WORD_LIMIT) {
        await updateDoc(doc(db, 'users', uid), {
          plan: 'Expired',
        });
        console.log(`User ${uid}'s trial has expired due to reaching the word limit.`);
      }
    };

    if (uid) {
      fetchContentData(uid);
    }
  }, [uid]);

  const wordProgress = Math.min((wordCount / TRIAL_WORD_LIMIT) * 100, 100);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Chart
              height={350}
              options={chartOptions}
              series={[wordProgress]} // Pass the word progress as series data
              type="radialBar"
            />
            <Typography
              align="center"
              color="text.secondary"
              component="p"
              variant="caption"
            >
              Track your word count progress
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" align="center">
                Trial Progress
              </Typography>
              <Typography variant="body2" align="center">
                Words Written: {wordCount}/{TRIAL_WORD_LIMIT}
              </Typography>
              <LinearProgress variant="determinate" value={wordProgress} sx={{ mt: 1 }} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
