import React, { FC } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { paths } from 'src/paths';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {useTranslation} from "react-i18next";
import {typography} from "../../../theme/typography";
import {tokens} from "../../../locales/tokens";

interface OverviewPendingIssuesProps {

}

export const OverviewImageGenerator: FC<OverviewPendingIssuesProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={3}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <div>
          <img
            src="/assets/iconly/image-eg.svg"
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{...typography.body1, mb: 1, mt: 1, pl: 2, pr: 0, textAlign: 'left'}}>{t(tokens.headings.imageGenerator)}</Typography>
          <Typography
            color="text.primary"
            variant="h4"
          >

          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        <Link href={paths.dashboard.images} passHref>
          <Button
            color="inherit"



            size="small"
          >

          </Button>
      </Link>
      </CardActions>
    </Card>
  );
};

OverviewImageGenerator.propTypes = {

};
