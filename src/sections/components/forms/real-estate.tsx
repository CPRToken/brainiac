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
import {useProtectedPage} from "../../../hooks/use-protectedpage";

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
  { label: tokens.form.brandNew, value: tokens.form.brandNew },
    { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
    { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
    { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
    { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
    { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];



interface PropertyDetails {
  // Define the structure of your property details here
}

interface PropertyComparables {
  // Define the structure of your property comparables here
}

interface PropertyData {
  details?: PropertyDetails;
  comparables?: PropertyComparables;
}


export const RealEstate: FC = () => {
  useProtectedPage();

  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();


    const [propertyType, setPropertyType] = useState<string>('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState<string>('');
  const [postCode, setPostCode] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [propertyData, setPropertyData] = useState<PropertyData>({} as PropertyData);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();





  const fetchCoordinates = async () => {
    try {
      const address = `${street}, ${city}, ${state}, ${country}, ${postCode}`;
      const response = await axios.post('/api/googlemaps', { address });
      const data = response.data.results[0]?.geometry?.location;
      return data ? { lat: data.lat, lng: data.lng } : null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };


  const fetchPropertyData = async () => {
    try {
      const address = `${street}, ${city}, ${state}, ${country}, ${postCode}`;
      const response = await axios.get('https://realty-mole-property-api.p.rapidapi.com/properties', {
        params: {
          address: address
        },
        headers: {
          'X-RapidAPI-Key': '4c5d537f0cmsh823b0f32f761f8fp10b155jsndfc85740adf8',
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        }
      });
      console.log(response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };


  useEffect(() => {
    if (country && city && state && street && postCode) {
      fetchCoordinates().then((coords) => {
        if (coords) {
          fetchPropertyData(); // Call the new function to fetch property data
          const fullAddress = `${country}, ${city}, ${state}, ${street}, ${postCode}`;
          console.log("Full address:", fullAddress);
        }
      }).catch(error => {
        console.error("Error in geocoding:", error);
      });
    }
  }, [country, city, state, street, postCode]);


  useEffect(() => {
    if (propertyType && country && city && state && street && postCode && place && age && propertyData) {
      let newPrompt = t(tokens.form.realEstatePrompts);


    const propertyTypeText = propertyType ? `${t(propertyType)} ` : '';
    const countryText = country ? `${country} ` : '';
    const stateText = state ? `${state} ` : '';
    const cityText = city ? `${city} ` : '';
     const streetText = street ? `${street} ` : '';
    const postCodeText = postCode ? `${postCode} ` : '';
    const placeText = place ? `${t(place)} ` : '';
    const ageText = age ? `${t(age)} ` : '';

    const processedPropertyData = propertyData ? processPropertyData(propertyData) : '';
    console.log("Processed property data:", processedPropertyData);

  newPrompt = newPrompt

      .replace('[propertyType]', propertyTypeText)
      .replace('[country]', countryText)
      .replace('[state]', stateText)
      .replace('[city]', cityText)
      .replace('[street]', streetText)
      .replace('[postCode]', postCodeText)
      .replace('[place]', placeText)
      .replace('[age]', ageText)
      .replace('[propertyData]', processedPropertyData);

    newPrompt = newPrompt.replace(/,+\s*$/, '');

    setPrompt(newPrompt.trim());
  } else {
    setPrompt('');
  }

  }, [propertyType, place, city, state, country,street, postCode, age, propertyData, t]);


  function processPropertyData(data: PropertyData | null): string {
    if (!data || !data.elements) {
      return 'No data available';
    }

    const info = data.elements.map(element => {
      return `Type: ${element.type}, ID: ${element.id}, Tags: ${JSON.stringify(element.tags)}`;
    }).join('; ');

    return info;
  }

  const maxTokens = 2000;
  const submitToOpenAI = () => {
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

      <Typography variant="body2" sx={{ paddingBottom: '20px' }}>
        {t(tokens.form.realEstateTip)}
      </Typography>

      <Stack spacing={3}>
        {/* Country Dropdown */}
        <TextField
          fullWidth
          label={t(tokens.form.country)}
           name="country"
           value={country}
          onChange={(e) => setCountry(e.target.value)}
            multiline
            rows={1}
            />

        <Stack direction="row" spacing={2}>

          <TextField
            fullWidth
            label={t(tokens.form.State)}
          name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
              multiline
              rows={1}
            sx={{ width: 'calc(50% - 8px)' }}
              />


          <TextField
            label={t(tokens.form.City)}
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            multiline
            rows={1}
            sx={{ width: 'calc(50% - 8px)' }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.street)}
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            multiline
            rows={1}
            sx={{ width: 'calc(50% - 8px)' }}
          />

          {/* PostCode TextField */}
          <TextField
            label={t(tokens.form.postCode)}
            name="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            sx={{ width: 'calc(50% - 8px)' }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          {/* Property Type Dropdown */}
          <TextField
            label={t(tokens.form.propertyType)}
            name="propertyType"
            select
            SelectProps={{ native: true }}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </TextField>

          {/* Age Dropdown */}
          <TextField
            label={t(tokens.form.propertyAge)}
            name="age"
            select
            SelectProps={{ native: true }}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {ageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </TextField>
        </Stack>

        {/* Place TextField */}
        <TextField
          label={t(tokens.form.place)}
          name="place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          multiline
          rows={1}
          sx={{ paddingBottom: '20px' }}
        />
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
