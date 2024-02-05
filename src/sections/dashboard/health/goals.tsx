import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import TrendUp02Icon from '@untitled-ui/icons-react/build/esm/TrendUp02';
import TrendDown02Icon from '@untitled-ui/icons-react/build/esm/TrendDown02';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

type Transaction = {
   id: string;
  calories: number;
  weight: number;
  goal: 'lose weight' | 'make money' | 'find work';
  commencementDate: number;
  completionDate: number;
  operation: 'add' | 'sub';
  title: string;
};

interface CryptoTransactionsProps {
  transactions: Transaction[];
}

export const Goals: FC<CryptoTransactionsProps> = (props) => {
  const { transactions } = props;

  return (
    <Card>
      <CardHeader title="Goals Progress" />
      <List disablePadding>
        {transactions.map((transaction) => {
          const icon = transaction.operation === 'add' ? <TrendUp02Icon /> : <TrendDown02Icon />;
          const commencementDate = format(transaction.commencementDate, 'MM.dd.yyyy / HH:mm a');
          const amount =
            (transaction.operation === 'add' ? '+' : '-') +
            ' ' +
            transaction.calories +
            ' ' +
            transaction.goal;
          const amountColor = transaction.operation === 'add' ? 'success.main' : 'error.main';
          const balance = numeral(transaction.weight).format('$0,0.00');

          return (
            <ListItem
              key={transaction.id}
              divider
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor:
                      transaction.operation === 'add' ? 'success.alpha4' : 'error.alpha4',
                    color: transaction.operation === 'add' ? 'success.main' : 'error.main',
                  }}
                >
                  <SvgIcon>{icon}</SvgIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="subtitle2">{transaction.title}</Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {commencementDate}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <Typography
                  color={amountColor}
                  variant="subtitle2"
                >
                  {amount}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {balance}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <CardActions>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          See all
        </Button>
      </CardActions>
    </Card>
  );
};

Goals.propTypes = {
  transactions: PropTypes.array.isRequired,
};
