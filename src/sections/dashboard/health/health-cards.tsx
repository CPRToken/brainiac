import type { FC } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Box from '@mui/material/Box';

import { HealthCard } from './health-card';

const sliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface CryptoCardsProps {
  cards: {
    id: string;
    brand: string;
    cardNumber: string;
    expiryDate: string;
    holderName: string;
  }[];
}

export const HealthCards: FC<CryptoCardsProps> = (props) => {
  const { cards } = props;

  return (
    <Box
      sx={{
        '& .slick-list': {
          borderRadius: 2,
          boxShadow: 12,
        },
        '& .slick-dots': {
          bottom: 'unset',
          left: (theme) => theme.spacing(3),
          textAlign: 'left',
          top: (theme) => theme.spacing(1),
        },
        '& .slick-dots li button': {
          '&:before': {
            fontSize: 10,
            color: 'common.white',
          },
        },
        '& .slick-dots li.slick-active button': {
          '&:before': {
            color: 'common.white',
          },
        },
      }}
    >
      <Slider {...sliderSettings}>
        {cards.map((card) => (
          <HealthCard
            key={card.id}
            {...card}
          />
        ))}
      </Slider>
    </Box>
  );
};

HealthCards.propTypes = {
  cards: PropTypes.array.isRequired,
};
