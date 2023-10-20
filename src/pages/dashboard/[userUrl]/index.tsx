import type { ChangeEvent } from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import type { NextPage } from 'next';

import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';

import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/system/colorManipulator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { blueGrey } from '@mui/material/colors';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import { socialApi } from 'src/api/social/socialApi';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';

import { SocialTimeline } from 'src/sections/dashboard/social/social-timeline';
import type { Profile, Post } from 'src/types/social';
import { useRouter } from 'next/router';

import { doc, query, where, collection, updateDoc, getDocs } from "firebase/firestore";

import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { db, auth, storage } from 'src/libs/firebase';
import {useTranslation} from "react-i18next";



const tabs = [
    { label: 'Timeline', value: 'timeline' },
    { label: 'Videos', value: 'videos' },
];


const useProfile = (): Profile | null => {

    const [profile, setProfile] = useState<Profile | null>(null);
    const router = useRouter();

    const { userUrl } = router.query;

    useEffect(() => {
        if (!userUrl || typeof userUrl !== 'string') return;

        async function fetchProfileData() {
            try {
                const querySnapshot = await getDocs(query(collection(db, "users"), where("userUrl", "==", userUrl)));

                const userDoc = querySnapshot.docs[0];
                if (userDoc) {
                    const uid = userDoc.id;

                    // Using the SocialApi method to fetch profile
                    socialApi.getProfile({ uid })
                        .then(profileData => {
                            setProfile(profileData);
                        })
                        .catch(error => {
                            console.error("Error fetching profile using socialApi:", error);
                        });
                } else {

                }
            } catch (error) {
                console.error("Error fetching user data based on userUrl: ", error);
            }
        }

        fetchProfileData();
    }, [userUrl]);

    return profile;
};



//fetch all posts code below

const usePosts = (uid: string | undefined): Post[] => {
    const [posts, setPosts] = useState<Post[]>([]);

    const handlePostsGet = useCallback(async () => {
        if (!uid) {
            console.error("No UID provided");
            return;
        }

        try {
            // Use SocialApi's getPosts method
            const unsubscribe = await socialApi.getPosts({ uid }, (fetchedPosts) => {
                setPosts(fetchedPosts);
            });

            // Return the unsubscribe function
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [uid]);

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        handlePostsGet().then((unsub) => {
            if (unsub !== undefined) {
                unsubscribe = unsub;
            }
        });

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };

    }   , [handlePostsGet]);

    return posts;
}







const Page: NextPage = () => {

    const { t } = useTranslation();
    const profile = useProfile();
    const posts = usePosts(profile?.uid);


    const [currentTab, setCurrentTab] = useState<string>('timeline');





    const coverInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    usePageView();




    const handleTabsChange = useCallback((event: ChangeEvent<any>, value: string): void => {
        setCurrentTab(value);
    }, []);

    if (!profile) {
        return null;
    }





//below is to upload and change the user's cover and avatar images.


    const handleUpload = async (file: Blob | Uint8Array | ArrayBuffer) => {

        const uid = auth.currentUser?.uid;
        if (file && uid) {

        } else {

        }

        const storageReference = storageRef(storage, 'avatars/' + uid + '/' + (file as File).name);

        try {

            const snapshot = await uploadBytesResumable(storageReference, file);

            const avatarUrl = await getDownloadURL(snapshot.ref);



            const userRef = doc(db, `users/${uid}`);
            const publicUserRef = doc(db, `public/${uid}`);


            await updateDoc(userRef, { avatar: avatarUrl });
            await updateDoc(publicUserRef, { avatar: avatarUrl });


            // Assuming you have a method to update user data



            if (inputRef.current) {
                inputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const imageType = e.target.getAttribute('data-type');

            if (file) {
                if (imageType === 'avatar') {
                    await handleUpload(file); // For avatar
                } else if (imageType === 'cover') {
                    // your cover upload logic here
                }
            }
        }
    };



    const SendFlowers = () => {
        // Your code here
    };


    return (
        <>
            <Seo title="Dashboard: Social Profile" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <div>




                        <Box

                            style={{ backgroundImage: `url(${profile.cover})` }}
                            sx={{
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                borderRadius: 1,
                                height: { xs: 250, md: 400 },
                                position: 'relative',
                                '&:hover': {
                                    '& button': {
                                        visibility: 'visible',
                                    },
                                },
                            }}
                        >
                            {auth.currentUser?.uid === profile?.uid && (
                                <div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        ref={coverInputRef}
                                        data-type="cover"
                                    />


                                    <Button
                                        startIcon={
                                            <SvgIcon>
                                                <Image01Icon />
                                            </SvgIcon>
                                        }
                                        sx={{
                                            backgroundColor: blueGrey[900],
                                            bottom: {
                                                lg: 24,
                                                xs: 'auto',
                                            },
                                            color: 'common.white',
                                            position: 'absolute',
                                            right: 24,
                                            top: {
                                                lg: 'auto',
                                                xs: 24,
                                            },
                                            visibility: 'hidden',
                                            '&:hover': {
                                                backgroundColor: blueGrey[900],
                                            },
                                        }}
                                        onClick={() => coverInputRef.current?.click()}

                                        variant="contained"
                                    >
                                        {t('headings.changeCover')}
                                    </Button>
                                </div>
                            )}
                        </Box>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                            sx={{ mt: 5 }}
                        >
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center" position="relative"> {/* Added position="relative" here */}
                                    <Avatar
                                        src={profile.avatar}
                                        sx={{
                                            height: { xs: 150, md: 180 }, // 100 on phones and 150 on medium and up (like desktop)
                                            width: { xs: 150, md: 180 },
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {auth.currentUser?.uid === profile?.uid && (
                                        <div>
                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                                ref={inputRef}
                                                data-type="avatar"
                                            />
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                                                    borderRadius: '50%',
                                                    color: 'common.white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    left: 0,
                                                    opacity: 0,
                                                    position: 'absolute',
                                                    top: 0,
                                                    width: '100%',
                                                    zIndex: 1,
                                                    '&:hover': {
                                                        opacity: 1,
                                                    },
                                                }}
                                                onClick={() => inputRef.current?.click()}
                                            >
                                                <Stack
                                                    alignItems="center"
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    <SvgIcon color="inherit">
                                                        <Camera01Icon />
                                                    </SvgIcon>
                                                    <Typography
                                                        color="inherit"
                                                        variant="subtitle2"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        Cambiar
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </div>
                                    )}
                                </Box>
                                <div>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        {profile.bio}
                                    </Typography>
                                    <Typography variant="h4">{profile.name}</Typography>
                                </div>
                            </Stack>
                            <Box sx={{ flexGrow: 1 }} />


                        </Stack>
                    </div>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        sx={{ mt: 5 }}
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                    <Divider />
                    <Box sx={{ mt: 3 }}>
                        {currentTab === 'timeline' && (
                            <SocialTimeline
                                posts={posts}
                                // pass the otherPosts array here if you want
                                profile={profile}
                            />
                        )}


                    </Box>
                </Container>
            </Box>
        </>
    );
};



Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
