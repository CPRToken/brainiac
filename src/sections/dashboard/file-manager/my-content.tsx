import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { FileIcon } from 'src/components/file-icon';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {  ref,  listAll, getMetadata } from "firebase/storage";
import { auth , storage } from 'src/libs/firebase';
import { tokens } from 'src/locales/tokens';


const useChartOptions = (usage: string): ApexOptions => {
  const theme = useTheme();






  return {
    chart: {
      background: 'transparent',
      redrawOnParentResize: false,
      redrawOnWindowResize: false,
    },
    colors: [theme.palette.primary.main],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    labels: [usage],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            color: theme.palette.text.primary,
            fontSize: '24px',
            fontWeight: 500,
            show: true,
            offsetY: -15,
          },
          value: {
            show: false,
          },
        },
        endAngle: 90,
        hollow: {
          size: '60%',
        },
        startAngle: -90,
        track: {
          background:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
          strokeWidth: '100%',
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
    stroke: {
      lineCap: 'round',
    },
    theme: {
      mode: theme.palette.mode,
    },
  };
};

type ChartSeries = number[];

interface Total {
  extension:  'pdf' | 'doc' | 'docx' | null;
  itemsCount: number;
  label: string;
  size: number;
}


export const MyContent: FC = () => {
  const [currentUsageBytes, setCurrentUsageBytes] = useState<number>(0);
  const [totals, setTotals] = useState<Total[]>([]);
  const TOTAL_STORAGE = 10 * (10 ** 9);  // Changing from 5 GB to 20 GB

  const currentUsage = `${(currentUsageBytes / (10 ** 9)).toFixed(2)} GB`;  // Fixed the divisor to 10 ** 9
  const currentUsagePercentage = (currentUsageBytes / TOTAL_STORAGE) * 100;  // No change here, it's correct.

  useEffect(() => {
    const fetchStorageData = async () => {
      let totalSize = 0;
      let totalPDFs = 0;
      let totalPDFSize = 0;
      let totalDOCs = 0;
      let totalDOCSize = 0;



      if (auth.currentUser) {
        // For Documents (PDFs, DOCs, DOCXs)
        const docStorageRef = ref(storage, `/${auth.currentUser.uid}/content`);
        const listResults = await listAll(docStorageRef);
        const promises = listResults.items.map((itemRef) => getMetadata(itemRef));
        const metadataResults = await Promise.all(promises);

        metadataResults.forEach((metadata) => {
          if (metadata.name.endsWith('.pdf')) {
            totalPDFSize += metadata.size;
            totalPDFs++;
          } else if (metadata.name.endsWith('.doc') || metadata.name.endsWith('.docx')) {
            totalDOCSize += metadata.size;
            totalDOCs++;
          }
        });

        totalSize = totalPDFSize + totalDOCSize; // Update totalSize to be the sum of PDF and DOC sizes
      }


      setCurrentUsageBytes(totalSize); // Set the total storage used
      setTotals([
        { extension: 'pdf', itemsCount: totalPDFs, label: 'PDF', size: totalPDFSize },
        { extension: 'doc', itemsCount: totalDOCs, label: 'DOC', size: totalDOCSize },
        { extension: 'docx', itemsCount: totalDOCs, label: 'DOCX', size: totalDOCSize }, // Assuming the same count for DOC and DOCX
      ]);
    };

    fetchStorageData();
  }, []);




  const chartOptions = useChartOptions(currentUsage);
  const chartSeries: ChartSeries = [currentUsagePercentage];

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={t(tokens.headings.myContent)}

      />
      <CardContent>
        <Stack alignItems="center">
          <Box
            sx={{
              height: 260,
              mt: '-48px',
              mb: '-100px',
            }}
          >
            <Chart

              width={260}
              height={260}
              options={chartOptions}
              series={chartSeries}
              type="radialBar"
            />
          </Box>

          <Typography
            color="text.secondary"
            variant="body2"
          >
            You have used {currentUsagePercentage.toFixed(2)}% of your storage
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >


          </Typography>
        </Stack>
        <List
          disablePadding
          sx={{ mt: 2 }}
        >
          {totals.map((total) => {
            const size = bytesToSize(total.size);

            return (
              <ListItem
                disableGutters
                key={total.extension}
              >
                <ListItemIcon>
                  <Box sx={{ color: 'primary.main' }}>
                    <FileIcon extension={total.extension} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="caption">{total.label}</Typography>}
                  secondary={
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {size} • {total.itemsCount} {t(tokens.headings.items)}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>

      </CardActions>
    </Card>
  );
};
