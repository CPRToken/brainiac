import React from 'react';
import Slider, { SliderProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

// Custom styled Slider
const StyledSlider = styled(Slider)({
    // Apply your custom styles for the thumb here
    '& .MuiSlider-thumb': {
        // Styling to make the thumb larger or as required
        height: 24,
        width: 24,
        // Additional styles...
    },
    // Style for the value label
    '& .MuiSlider-valueLabel': {
        // Styles to position the label as required
        top: -6,
        left: 'calc(-50% - 4px)',
        '& *': {
            background: 'transparent',
            color: '#000000',
            // Additional styles...
        },
      // Set the background of the small arrow beneath the label to transparent
      '&::before': {
        backgroundColor: 'transparent',
      },
    }
});

// Custom Slider component
export function CustomSlider(props: SliderProps) {
    const valueLabelFormat = (value: number) => {
        // Format the label as needed
        return `${value}`;
    };

    return (
        <StyledSlider
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay="on"
            {...props}
        />
    );
}
