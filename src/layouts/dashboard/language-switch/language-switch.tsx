//src/layouts/dashboard/language-switch/language-switch.tsx
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { usePopover } from 'src/hooks/use-popover';
import { LanguagePopover } from './language-popover';

type Language = 'en' | 'es';

const languages: Record<Language, string> = {
  en: '/assets/flags/flag-uk.svg',
  es: '/assets/flags/flag-es.svg',
};

export const LanguageSwitch: FC = () => {
  const { i18n } = useTranslation();
  const popover = usePopover<HTMLButtonElement>();

  useEffect(() => {
    // Load language from local storage or default to 'en'
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }

    // Listen for language changes to update local storage
    const handleLanguageChange = (lang: string) => {
      localStorage.setItem('appLanguage', lang);
    };
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const flag = languages[
  (localStorage.getItem('appLanguage') as Language) || 'en' // Default to 'en' flag

    ];

  return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
          <Box
            sx={{
              width: 28,
              '& img': {
                width: '100%',
              },
            }}
          >
            <img src={flag} alt={`Flag of ${i18n.language}`} />
          </Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
