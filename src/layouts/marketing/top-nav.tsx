import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { alpha } from '@mui/system/colorManipulator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material/styles/createTheme';
import {LanguageSwitch }from 'src/layouts/dashboard/language-switch/language-switch';
import { RouterLink } from 'src/components/router-link';

import { usePathname } from 'src/hooks/use-pathname';
import { useWindowScroll } from 'src/hooks/use-window-scroll';

import { paths } from 'src/paths';

import { TopNavItem } from './top-nav-item';
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";

interface Item {
  disabled?: boolean;
  external?: boolean;
  popover?: ReactNode;
  path?: string;
  title: string;
}




const items: Item[] = [





];

const TOP_NAV_HEIGHT = 64;

interface TopNavProps {
  onMobileNavOpen?: () => void;
}

export const TopNav: FC<TopNavProps> = (props) => {
  const { onMobileNavOpen } = props;
  const pathname = usePathname();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [elevate, setElevate] = useState<boolean>(false);
  const offset = 64;
  const delay = 100;
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? "/assets/logos/logo-dark.svg" : "/assets/logos/logo-light.svg";

  const handleWindowScroll = useCallback((): void => {
    if (window.scrollY > offset) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  }, []);

  useWindowScroll({
    handler: handleWindowScroll,
    delay,
  });

    const { t } = useTranslation();

  return (
    <Box
      component="header"
      sx={{
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        pt: 2,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'transparent',
          borderRadius: 2.5,
          boxShadow: 'none',
          transition: (theme) =>
            theme.transitions.create('box-shadow, background-color', {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          ...(elevate && {
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
            boxShadow: 8,
          }),
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ height: TOP_NAV_HEIGHT }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={logoSrc}
                sx={{
                  display: 'inline-flex',
                  height: 46,
                  width: 46,
                }}
              />
              {mdUp && (
                <Typography
                  sx={{
                    ...typography.h4, // Spread the h2 style here
                    color: 'text.primary',
                    fontSize: 40,
                    fontWeight: 600,
                    letterSpacing: '0.2px',
                    lineHeight: 2.5,
                    '& span': {
                      color: 'primary.main',
                    },
                    // If mt (margin-top) and mb (margin-bottom) are needed, add them here
                    mt: 10,
                    mb: 0,
                  }}
                >
                  Br<span>ai</span>niac Media
                </Typography>
              )}
            </Stack>

          </Stack>
          {mdUp && (
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Box
                component="nav"
                sx={{ height: '100%' }}
              >
                <Stack
                  component="ul"
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                  spacing={1}
                  sx={{
                    height: '100%',
                    listStyle: 'none',
                    m: 0,
                    p: 0,
                  }}
                >
                  <>
                    {items.map((item) => {
                      const checkPath = !!(item.path && pathname);
                      const partialMatch = checkPath ? pathname.includes(item.path!) : false;
                      const exactMatch = checkPath ? pathname === item.path : false;
                      const active = item.popover ? partialMatch : exactMatch;

                      return (
                        <TopNavItem
                          active={active}
                          external={item.external}
                          key={item.title}
                          path={item.path}
                          popover={item.popover}
                          title={item.title}
                        />
                      );
                    })}
                  </>
                </Stack>
              </Box>

            </Stack>
          )}
          <LanguageSwitch />
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ flexGrow: 1 }}
          >
            <Button
              component="a"
              size={mdUp ? 'medium' : 'small'}
              href="/auth/firebase/login"
              target=""
              variant="outlined"
              sx={{
                width: mdUp ? 'auto' : '90%',  // Adjust the width here
                maxWidth: '150px', //
                marginLeft: '-50px',  // Force the button to the left
                marginRight: 'auto',  // Add some right margin for spacing
                borderColor: 'yourBorderColor',
                borderWidth: 2,
                fontWeight: 'bold'
              }}
              >
                  {t(tokens.headings.logIn)}
              </Button>

              {!mdUp && (
              <IconButton onClick={onMobileNavOpen}>
                <SvgIcon fontSize="small">
                  <Menu01Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
