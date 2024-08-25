import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';

import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import {typography} from "src/theme/typography";;
import { useRouter } from 'next/router';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from 'src/sections/components/clipboards/response-text';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { printContent } from 'src/utils/print-content';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Post } from 'src/types/content';
import {auth, db } from "src/libs/firebase";
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
      const response = await contentApi.getPost(uid, title.replace(/_/g, ' '));
      if (response) {
        setPost(response);

        // Check if the post has an associated image filename
        const imageName = response.image; // Get the image filename from the post document
        if (imageName) {
          const storage = getStorage();
          // Construct the path using the user ID and the image filename
          const imageRef = ref(storage, `${uid}/images/${imageName}`);
          getDownloadURL(imageRef).then((imageUrl) => {
            setPost((prevPost) => {
              if (prevPost) {
                return { ...prevPost, imageUrl }; // Correctly merge imageUrl with existing post data
              }
              return null; // Handle the case where there might not be a previous post
            });
          }
          );
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }

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
  const title = typeof router.query.title === 'string' ? router.query.title : 'defaultFilename';  // Ensuring title is a string
  const uid = auth.currentUser?.uid ?? ''; // Fallback to an empty string if uid is undefined

  const post = usePost(title, uid);
  const { t } = useTranslation();
  const [user, setUser] = useState<Profile | null>(null);

  const { textRef, handleCopyText } = ResponseText();


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
  }
  , [uid]);
  usePageView();
  if (!post) return null; // Return early if post is null


  return (
    <>
      <Seo title="{Content: Post}" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            pt: {xs: '20px', sm: '20px', md: '20px', lg: '10px'}, // Responsive padding top
            pb: {xs: '20px', sm: '20px', md: '50px', lg: '60px'}, // Responsive padding bottom
            px: {xs: '10px', sm: '15px', md: '20px', lg: '25px'}, // Responsive padding left and right
            pl: {xs: '20px', sm: '20px', md: '20px', lg: '40px'}, // Responsive padding top
            // You can add more responsive styles here
          }}>
          <div id="printableContent">
            <div id="printHeader" style={{display: 'none'}}>
              <img src="/assets/bmprintlogo.png" alt="Logo"
                   style={{width: '100px'}}/>
              <p style={{fontSize: '12px', marginBottom: '20px'}}>brainiacmedia.ai</p>
            </div>
            {post.imageUrl && (
              <Box
                component="img"
                src={post.imageUrl}
                alt={post.title}
                sx={{
                  float: 'left',
                  borderRadius: '20px',
                  marginRight: '20px',
                  marginTop: '20px',
                  marginBottom: '20px',
                  width: 600,
                  height: '100%',
                  maxWidth: '100%',
                  objectFit: 'cover',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  '@media (max-width:600px)': {
                    pt: '20px',
                    pb: '20px',
                    height: '50vh',
                    width: '100%',
                    borderRadius: '30px',
                  }
                }}
              />
            )}

            <Typography
              color="text.primary"
              sx={{
                ...typography.h3} // Adjust font size for different screen sizes
            }>
              {post.title}
            </Typography>

            <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
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

            <Button id="copyTextButton" onClick={handleCopyText} title="Copy text to clipboard" sx={{ mt: 2 }}>
              <FileCopyIcon />
            </Button>



            <Typography color="text.primary" sx={{...typography.body1, mb:2, mt: 2}} variant="body1"
                        ref={textRef}>
              {post.htmlContent ? renderTextWithLineBreaks(t(post.htmlContent)) : t('defaultEducationKey')}
            </Typography>

          </div>


          <Box sx={{display: 'flex', justifyContent: 'center', pt:3, mt: 3}}>
            <IconButton id="printButton" onClick={() => printContent(title)} aria-label="print">
              <PrintIcon fontSize="large" />
            </IconButton>
            </Box>


        </Container>


      </Box>
    </>
);
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
