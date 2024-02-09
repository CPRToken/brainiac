import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {socialApi} from "src/api/social/socialApi";

import type { Profile } from 'src/types/social';
import {auth, db } from "src/libs/firebase";
import { contentApi } from 'src/api/content';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import {useTranslation} from "react-i18next";
import { paths } from 'src/paths';
import { doc, deleteDoc } from 'firebase/firestore';
import { PostCard } from 'src/sections/dashboard/content/post-card';
import type { Post } from 'src/types/content';
import {tokens} from "../../../locales/tokens";


const usePosts = () => {
  const isMounted = useMounted();
  const [posts, setPosts] = useState<Post[]>([]);
  const uid = auth.currentUser?.uid;

  const deletePost = async (postId: string) => {
    if (!uid) return;
    try {
      await deleteDoc(doc(db, 'users', uid, 'content', postId));
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  const handlePostsGet = useCallback(async () => {
    if (!uid) return;

    try {
      const response = await contentApi.getPosts(uid);
      if (isMounted()) {
        setPosts(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [uid, isMounted]);

  useEffect(() => {
    handlePostsGet();
  }, [handlePostsGet]);

  return { posts, deletePost }; // Return an object containing both posts and deletePost
};




const Page: NextPage = () => {
  const { posts, deletePost } = usePosts();
  const [uid] = useState<string | null>(auth.currentUser ? auth.currentUser.uid : null);
    const [user, setUser] = useState<Profile | null>(null);




  const { t } = useTranslation();

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);          // Use userData instead of fetchedUser


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);







  usePageView();

  return (
    <>

      <Seo title={t(tokens.headings.myContent)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography
              variant="h3">{t(tokens.headings.myContent)}</Typography>
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
                List
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              mt: 2,
              px: 2,
              py: 2,
            }}
          >
            <Typography variant="subtitle1">{t(tokens.form.hello)} {user?.name || 'Guest'}</Typography>

          </Card>


          <Divider sx={{ my: 4 }} />
          <Grid
            container
            spacing={2}
            justifyContent="center"
          >
            {posts.map((post) => (
              <Grid
                key={post.title}
                item
                xs={6}
                sm={3}
                md={3} // Adjusted for a 4-column layout at medium breakpoint
                lg={3} // Adjusted for a 5-column layout attempt; use 2 or 3 as exact 2.4 can't be used
                xl={2} // Adjusted for a 6-column layout attempt; use 2 or 3 as exact 2.4 can't be used
              >


                <PostCard
                  id={post.id}
                  title={post.title}
                  category={post.category}
                  createdAt={post.createdAt}
                  content={post.content}
                  shortDescription={post.shortDescription}
                  onDelete={() => deletePost(post.id)}
                  sx={{ height: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{
              mt: 4,
              mb: 8,
            }}
          >
            <Button
              disabled
              startIcon={
                <SvgIcon>
                  <ArrowLeftIcon />
                </SvgIcon>
              }
            >
              Newer
            </Button>
            <Button
              endIcon={
                <SvgIcon>
                  <ArrowRightIcon />
                </SvgIcon>
              }
            >
              Older posts
            </Button>
          </Stack>

        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
