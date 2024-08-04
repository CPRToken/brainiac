import type { FC } from 'react';
import CurrencyDollarIcon from '@untitled-ui/icons-react/build/esm/CurrencyDollar';
import ReceiptIcon from '@untitled-ui/icons-react/build/esm/Receipt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export const Success: FC = () => (
  <Box
    sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
      p: 3,
    }}
  >
    <Card>
      <CardHeader title="Order Details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>


          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Paid</Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                2 ($50.00)
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Plan</Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                1 ($5.00)
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Unpaid/Due</Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                1 ($12.00)
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>

          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Gross Income</Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                $1,200.00
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </Card>
  </Box>
);
