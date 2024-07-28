import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as ComponentsLayout } from 'src/layouts/components';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { Previewer } from 'src/sections/components/previewer';
import { Success } from 'src/sections/components/detail-lists/success';
import { db, auth } from 'src/libs/firebase'; // Import db and auth
import { doc, getDoc } from 'firebase/firestore';

const components: { element: JSX.Element; title: string }[] = [
  {
    element: <Success />,
    title: 'Payment Successful',
  },
];

const Page: NextPage = () => {
  const [user, setUser] = useState<any>(null);  // Adjust type as needed
  const [loading, setLoading] = useState(true);

  usePageView();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Seo title="Payment Success" />
      <ComponentsLayout title="Payment Success">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={8}>
              {loading ? (
                <p>Loading...</p>  // Show loading state
              ) : (
                <>
                  {components.map((component) => (
                    <Previewer
                      key={component.title}
                      title={component.title}
                    >
                      {component.element}
                    </Previewer>
                  ))}
                  {/* Optionally display user data */}
                  {user && (
                    <div>
                      <p>User Plan: {user.plan}</p>
                      <p>Price ID: {user.priceId}</p>
                      {/* Add more user data here as needed */}
                    </div>
                  )}
                </>
              )}
            </Stack>
          </Container>
        </Box>
      </ComponentsLayout>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
