import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as ComponentsLayout } from 'src/layouts/components';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { Previewer } from 'src/sections/components/previewer';
import { QuickStats1 } from 'src/sections/components/quick-stats/quick-stats-1';
import { QuickStats2 } from 'src/sections/components/quick-stats/quick-stats-2';
import { QuickStats3 } from 'src/sections/components/quick-stats/quick-stats-3';
import { QuickStats4 } from 'src/sections/components/quick-stats/quick-stats-4';
import { QuickStats5 } from 'src/sections/components/quick-stats/quick-stats-5';
import { QuickStats6 } from 'src/sections/components/quick-stats/quick-stats-6';
import { QuickStats7 } from 'src/sections/components/quick-stats/quick-stats-7';
import { QuickStats8 } from 'src/sections/components/quick-stats/quick-stats-8';
import { QuickStats9 } from 'src/sections/components/quick-stats/quick-stats-9';
import { MyContent } from 'src/sections/components/quick-stats/my-content';
import {MyImages} from "../../../sections/components/quick-stats/my-images";
import React from "react";

const components: { element: JSX.Element; title: string }[] = [
  {
    element: <QuickStats1 />,
    title: 'Quick stats 1',
  },
  {
    element: <MyContent />,
    title: 'My Content',
  },
  {
  element: <MyImages />,
  title: 'My Images',
  },

  {
    element: <QuickStats2 />,
    title: 'Quick stats 2',
  },

  {
    element: <QuickStats3 />,
    title: 'Quick stats 3',
  },
  {
    element: <QuickStats4 />,
    title: 'Quick stats 4',
  },
  {
    element: <QuickStats5 />,
    title: 'Quick stats 5',
  },
  {
    element: <QuickStats6 />,
    title: 'Quick stats 6',
  },
  {
    element: <QuickStats7 />,
    title: 'Quick stats 7',
  },
  {
    element: <QuickStats8 />,
    title: 'Quick stats 8',
  },
  {
    element: <QuickStats9 />,
    title: 'Quick stats 9',
  },
];

const Page: NextPage = () => {
  usePageView();

  return (
    <>
      <Seo title="Components: Quick Stats" />
      <ComponentsLayout title="Quick Stats">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={8}>
              {components.map((component) => (
                <Previewer
                  key={component.title}
                  title={component.title}
                >
                  {component.element}
                </Previewer>
              ))}
            </Stack>
          </Container>
        </Box>
      </ComponentsLayout>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
