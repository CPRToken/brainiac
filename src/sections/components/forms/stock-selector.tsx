import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import {CustomSlider} from "../slider/slider";

type Option = {
    label: string;
    value: string;
};

// Mock options for demonstration. Replace these with actual stock data options.
const stockOptions: Option[]  = [
    { label: '', value: '' },
    { label: tokens.form.realTimeStocks, value: tokens.form.realTimeStocks },
    { label: tokens.form.AlphaIntelligence, value: tokens.form.AlphaIntelligence },
    { label: tokens.form.fundamentalData, value: tokens.form.fundamentalData },
    { label: tokens.form.PhysicalNDigitalCryptoCurrencies, value: tokens.form.PhysicalNDigitalCryptoCurrencies },
    { label: tokens.form.Commodities, value: tokens.form.Commodities },
    { label: tokens.form.EconomicIndicators, value: tokens.form.EconomicIndicators },
    { label: tokens.form.TechnicalIndicators, value: tokens.form.TechnicalIndicators },

];


// Define other option arrays similarly...





export const StockSelector: FC = () => {


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [stock, setStock] = useState<string>('');
  const [duration, setDuration] = useState<number>(100);
  const [prompt, setPrompt] = useState<string>('');

  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();



    const fetchStockData = async () => {
        const apiKey = process.env.ALPHA_VANTAGE_KEY; // Ensure this is set in your environment
        if (apiKey && stock) {
            try {
                const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=5min&apikey=${apiKey}`;

                const response = await fetch(url, {
                    headers: {'User-Agent': 'YourAppName'}
                });
                const data = await response.json();

                if (response.status !== 200) {
                    console.log('Error with status code:', response.status);
                } else {
                    // Process and use the fetched data
                    console.log(data);
                    // Update the prompt or other component state based on the fetched data
                    // Example: setPrompt(`Fetched data for ${stock}: ${JSON.stringify(data)}`);
                }
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        } else {
            // Handle case where API key or stock is not available
            console.log("API key or stock symbol is missing");
        }
    };





    useEffect(() => {
        if (stock && duration) {
        let newPrompt = t(tokens.form.stockPrompts);

const stockText = stock !== '' ? `${t(stock)} ` : '';
            const durationText = `${duration} ${t('')}`;


            newPrompt = newPrompt
                .replace ('[stock]', stockText)
                .replace('[duration]', durationText);

            newPrompt = newPrompt.replace(/,+\s*$/, '');

            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
        }
    }, [stock, duration, t]);





    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
          <TextField
              fullWidth
              label={t(tokens.form.stockType)}
              name="stock"
             select
              SelectProps={{ native: true }}
           value={stock}
          onChange={(e) => setStock(e.target.value)}

        >
          {stockOptions.map((option) => (
              <option key={option.value} value={option.value}>
                  {t(option.label)} {/* Apply translation here */}
              </option>
          ))}
        </TextField>




        <div>
          <label>{t(tokens.form.budget)}</label>

          <CustomSlider
            value={duration}
            min={100}
            max={10000}
            step={100}
            onChange={(_, newValue) => setDuration(newValue as number)}
          />
        </div>

          <TextField
              fullWidth
              label={t(tokens.form.prompts)}
              name="prompt"
              value={prompt}
              multiline
              rows={4}
          />



      </Stack>
          <Box sx={{ mt: 3 }}>
              <Button
                  onClick={async () => {
                      await fetchStockData();
                      handleSubmit(prompt, 1300);
                  }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
              >
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>

          </Box>


          <Box sx={{ mt: 3 }}>
              {openAIResponse && (
                  <>
                      <label>{t(tokens.form.stockTips)}</label>
                      <Button onClick={handleCopyText} title="Copy response text">
                          <FileCopyIcon />
                      </Button>
                  </>
              )}

              <Paper elevation={3} ref={textRef} style={{ padding: '10px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
                  {openAIResponse && openAIResponse.split('\n').map((str, index, array) =>
                      index === array.length - 1 ? str : <>
                          {str}
                          <br />
                      </>
                  )}
              </Paper>
          </Box>


      </Box>

    );
};

