import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {typography} from "src/theme/typography";;
import { useRouter } from 'next/router';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Post } from 'src/types/content';
import {auth } from "src/libs/firebase";
import type {Profile} from "../../../types/social";
import { contentApi } from 'src/api/content';
import {socialApi} from "../../../api/social/socialApi";
import {useTranslation} from "react-i18next";









const usePost = (title: string, uid: string): Post | null => {
  const [post, setPost] = useState<Post | null>(null);


useEffect(() => {
  const fetchPost = async () => {
    if (!title || !uid) return;
    try {
      const response = await contentApi.getPost(uid, title.replace(/_/g, ' ')); // Assuming your titles are stored with spaces in Firestore
      setPost(response ?? null);

    } catch (err) {
      console.error('Error fetching post:', err);
    }
  };

  fetchPost();
}, [title, uid]);

return post;
};



const renderTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line: string, index: number) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};



const Page: NextPage = () => {
  const router = useRouter();
  const title = typeof router.query.title === 'string' ? router.query.title : '';
  const uid = auth.currentUser?.uid ?? ''; // Fallback to an empty string if uid is undefined

  const post = usePost(title, uid);
  const { t } = useTranslation();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  if (!post) {
    return <div>Post not found</div>;
  }



  return (
    <>
      <Seo title="Content: Post" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography
              color="text.primary"
              sx={{
                ...typography.h2,

                fontSize: { xs: '34px', sm: '28px', md: '32px', lg: '34px' }, // Adjust font size for different screen sizes
              }}
              variant="h2">
              {post.title}
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.content.index}
                variant="subtitle2"
              >
                Content
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                {post.category}
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Stack spacing={3}>
            {post.category && <Chip label={post.category} />}


            <Typography color="text.primary" sx={{ ...typography.body1 }} variant="body1">
              {post.htmlContent ? renderTextWithLineBreaks(t(post.htmlContent)) : t('defaultEducationKey')}
            </Typography>

          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
