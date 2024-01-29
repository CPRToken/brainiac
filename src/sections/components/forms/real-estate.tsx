import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';

import axios from 'axios';

import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import Typography from "@mui/material/Typography";

type Option = {
    label: string;
    value: string;
};

interface PropertyData {
  elements: Array<{
    type: string;
    id: number;
    tags: {
      [key: string]: string; // Example: name, building type, etc.
    };
    // Add other properties as needed based on the Overpass API response
  }>;
}


    // ... add more as neede

const propertyTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.house, value: tokens.form.house },
  { label: tokens.form.condo, value: tokens.form.condo },
  { label: tokens.form.apartment, value: tokens.form.apartment },
  { label: tokens.form.townhouse, value: tokens.form.townhouse },


  // ... continue for other countries
];





    // ... add more as needed


const ageOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
    { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
    { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
    { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
    { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];





export const RealEstate: FC = () => {

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();


    const [propertyType, setPropertyType] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [propertyData, setPropertyData] = useState<any>(null);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const fetchCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`);
      const data = response.data.results[0].geometry.location; // latitude and longitude
      return { lat: data.lat, lng: data.lng };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };


  useEffect(() => {
    if (location) {
      fetchCoordinates(location).then((coords) => {
        if (coords) {
          // Now TypeScript knows that coords is not null
          const { lat, lng } = coords;

          // Use lat and lng to construct your Overpass API query
          const overpassQuery = `
           [out:json][timeout:25];
          (
            node["building"](${lat},${lng},${lat + 0.01},${lng + 0.01});
            way["building"](${lat},${lng},${lat + 0.01},${lng + 0.01});
            relation["building"](${lat},${lng},${lat + 0.01},${lng + 0.01});
          );
          out body;
          >;
          out skel qt;
        `;

          // ... rest of your axios.post call
        } else {
          console.error("Coordinates could not be fetched for the address.");
        }
      }).catch(error => {
        console.error("Error in geocoding:", error);
      });
    }
  }, [location]); // Add other dependencies as needed

  useEffect(() => {
    const propertyTypeText = propertyType ? `${t(propertyType)} ` : '';
    const placeText = place ? `${t(place)} ` : '';
    const locationText = location ? `${t(location)} ` : '';
    const ageText = age ? `${t(age)} ` : '';

    const processedPropertyData = propertyData ? processPropertyData(propertyData) : '';
    console.log("Processed property data:", processedPropertyData); // Debugging line


    let newPrompt = t(tokens.form.realEstatePrompts)
      .replace('[propertyType]', propertyTypeText)
      .replace('[place]', placeText)
      .replace('[location]', locationText)
      .replace('[age]', ageText)
      .replace('[propertyData]', processedPropertyData);

    setPrompt(newPrompt.trim());
  }, [propertyType, propertyData, place, location, age, t]);

  function processPropertyData(data: PropertyData | null): string {
    if (!data || !data.elements) {
      return 'No data available';
    }

    const info = data.elements.map(element => {
      return `Type: ${element.type}, ID: ${element.id}, Tags: ${JSON.stringify(element.tags)}`;
    }).join('; ');

    return info;
  }


  const submitToOpenAI = () => {
    const maxTokens = 2000;
    if (prompt) {
      handleSubmit(prompt, maxTokens)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
    } else {
      console.error("Prompt is empty or not updated, cannot submit.");
    }
  };




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

        <Typography variant="body2"sx={{ paddingBottom: '20px' }}>
          {t(tokens.form.realEstateTip)}
        </Typography>


      <Stack spacing={3}>
        <TextField

          label={t(tokens.form.location)}
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          multiline
          rows={1}

        >


        </TextField>
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.propertyType)}
            name="propertyType"
            select
            SelectProps={{ native: true }}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>

        <TextField
          label={t(tokens.form.age)}
          name="propertyType"
          select
          SelectProps={{ native: true }}
           value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          sx={{ width: 'calc(50% - 8px)' }}
        >
          {ageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}


        </TextField>

        </Stack>
          <TextField

            label={t(tokens.form.place)}
            name="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            multiline
            rows={1}
            sx={{ paddingBottom: '20px' }}

          >


          </TextField>






      </Stack>

        {/* Submit button */}
        <Box sx={{ mt: 3 }}>
            <Button
                onClick={submitToOpenAI}
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
        </Box>

        {openAIResponse && (
            <Box sx={{ mt: 3 }}>
                <label>{t(tokens.form.yourValuation)}</label>
                <Button onClick={handleCopyText} title="Copy response text">
                    <FileCopyIcon />
                </Button>
                <Paper elevation={3} ref={textRef} style={{ padding: '30px', overflow: 'auto', lineHeight: '1.5' }}>
                    {openAIResponse.split('\n').map((str, index, array) => (
                        <React.Fragment key={index}>
                            {str}
                            {index < array.length - 1 ? <br /> : null}
                        </React.Fragment>
                    ))}
                </Paper>
            </Box>
        )}
    </Box>

  );
}
