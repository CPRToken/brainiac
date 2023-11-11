
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { useDialog } from 'src/hooks/use-dialog';

import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import {getDocs, deleteDoc, doc,  collection} from 'firebase/firestore';
import { FileUploader } from '../../../sections/dashboard/content/file-uploader';
import { ItemList } from 'src/sections/dashboard/file-manager/item-list';

import { StorageStats } from 'src/sections/dashboard/file-manager/storage-stats';
import type { Item } from 'src/types/file-manager';
import {db, auth} from 'src/libs/firebase';

import { useRouter } from 'next/router'
import {Layout as DashboardLayout} from "../../../layouts/dashboard";






type View = 'grid' | 'list';





const Page: NextPage = () => {
    const router = useRouter()



    const user = auth.currentUser;
    const uid = user ? user.uid : null;


    const settings = useSettings();

    const [view, setView] = useState<View>('grid');
    const uploadDialog = useDialog();
    const detailsDialog = useDialog<string>();

    const [items, setItems] = useState<Item[]>([]);


    const fetchFiles = async () => {
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const querySnapshot = await getDocs(collection(db, 'users', uid, 'content'));
            const fetchedFiles = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            console.log(fetchedFiles); // Log the fetched files to the console
            setItems(fetchedFiles as Item[]);  // Update your items state here
        }
    };


    useEffect(() => {
        fetchFiles();
    }, []);



    const deleteItem = async (itemId: string) => {
         if (!uid) return; // Exit if uid is null
        const itemRef = doc(db, 'users', uid, 'content', itemId);

        await deleteDoc(itemRef);

        setItems ((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };



    usePageView();


    return (
        <>
            <Seo title="Dashboard: File Manager" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={settings.stretch ? false : 'xl'}>
                    <Grid
                        container
                        spacing={{
                            xs: 3,
                            lg: 4,
                        }}
                    >
                        <Grid xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <div>
                                    <Typography variant="h4">Content</Typography>
                                </div>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Button
                                        onClick={uploadDialog.handleOpen}
                                        startIcon={
                                            <SvgIcon>
                                                <Upload01Icon />
                                            </SvgIcon>
                                        }
                                        variant="contained"
                                    >
                                        Upload file
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            <Stack
                                spacing={{
                                    xs: 3,
                                    lg: 4,
                                }}
                            >

                                <ItemList

                                    items={items}
                                    onDelete={deleteItem}


                                    onOpen={detailsDialog.handleOpen}

                                    view={view}
                                />
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <StorageStats />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
            />

        </>  );

}


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

