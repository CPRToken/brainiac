//pages/dashboard/images/index.tsx
import React, {useState, useEffect, useCallback, MouseEvent, ChangeEvent, useMemo} from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { ImageViewer } from "../../../sections/components/modals/modal-image";
import { ThumbnailCard } from '../../../sections/dashboard/images/thumbnail-card';
import {auth, db, storage} from 'src/libs/firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import Divider from '@mui/material/Divider';
import { Grid, Box } from '@mui/material';
import { useSettings } from "../../../hooks/use-settings";
import { ItemList } from 'src/sections/dashboard/file-manager/item-list';
import { useDialog } from "../../../hooks/use-dialog";
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";
import {Item} from "../../../types/file-manager";
import {useMounted} from "../../../hooks/use-mounted";
import {collection, deleteDoc, doc, onSnapshot, query} from "firebase/firestore";
import {useRouter} from "next/router";


const user = auth.currentUser;


type View = 'grid' | 'list';

interface Filters {
    query?: string;
    folderId?: string;
}

type SortDir = 'asc' | 'desc';

interface ItemsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
    sortBy?: string;
    sortDir?: SortDir;
}




const useItemsSearch = (folderId?:string) => {
    const [state, setState] = useState<ItemsSearchState>({
        filters: {
            query: undefined,
            folderId,
        },
        page: 0,
        rowsPerPage: 9,
        sortBy: 'createdAt',
        sortDir: 'desc',
    });

    const handleFiltersChange = useCallback((filters: Filters): void => {
        setState((prevState) => ({
            ...prevState,
            filters,
        }));
    }, []);

    const handleSortChange = useCallback((sortDir: SortDir): void => {
        setState((prevState) => ({
            ...prevState,
            sortDir,
        }));
    }, []);

    const handlePageChange = useCallback(
        (event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
            setState((prevState) => ({
                ...prevState,
                page,
            }));
        },
        []
    );

    const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10),
        }));
    }, []);

    return {
        handleFiltersChange,
        handleSortChange,

        handlePageChange,
        handleRowsPerPageChange,
        state,
    };
};

interface ItemsStoreState {
    items: Item[];
    itemsCount: number;
}

const useItemsStore = (searchState: ItemsSearchState) => {
    useMounted();
    const [state, setState] = useState<ItemsStoreState>({
        items: [],
        itemsCount: 0,
    });



    useEffect(() => {
        if (user?.uid) {
            const userUID = user.uid;
            const q = query(collection(db, `users/${userUID}/folders`));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as Item[];
                setState({ items: documents, itemsCount: documents.length });
            });

            return () => {
                unsubscribe();
            };
        }
    }, [searchState, setState]);



    const handleDelete = useCallback(
        async (itemId: string): Promise<void> => {
            const user = auth.currentUser;
            if (user) {
                await deleteDoc(doc(db, `users/${user.uid}/folders/${itemId}`));
            }
        } , [] );



    const handleFavorite = useCallback((itemId: string, value: boolean): void => {
        setState((prevState) => {
            return {
                ...prevState,
                items: prevState.items.map((item) => {
                    if (item.id === itemId) {
                        return {
                            ...item,
                            isFavorite: value,
                        };
                    }

                    return item;
                }),
            };
        });
    }, []);
    return {
        handleDelete,
        handleFavorite,
        ...state,
    };
};




const useCurrentItem = (items: Item[], itemId?: string): Item | undefined => {
    return useMemo((): Item | undefined => {
        if (!itemId) {
            return undefined;
        }

        return items.find((item) => item.id === itemId);
    }, [items, itemId]);
};



const Page: NextPage = () => {
    const router = useRouter()
    const folderIds = router.query?.folderId ?? [];
    const folderId = folderIds[folderIds.length -1]
    const [imageUrls, setImageUrls] = useState<Array<{ url: string, name: string }>>([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { t } = useTranslation();
    const settings = useSettings();
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);
    const [view, setView] = useState<View>('grid');
    useDialog();

    const uploadDialog = useDialog();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    const handleClickOpen = (url: string) => {
        setSelectedImage(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchImages = () => {
        const imagesListRef = ref(storage, `/${uid}/images/`);
        setImageUrls([]);
        listAll(imagesListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageUrls((prev) => [...prev, { url: url, name: item.name }]);
                }).catch((error) => console.log("Error getting URL:", error));
            });
        }).catch((error) => console.log("Error in listAll:", error));
    };

    useEffect(() => {
        if (uid) fetchImages();
    }, [uid]);



  return (
    <>
      <Seo title={t(tokens.headings.myImages)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2, // Adjusted padding for consistency
        }}
      >
        <Container maxWidth="xl"> {/* Standardized maxWidth */}
          <Stack spacing={1}>
            <Typography variant="h3">{t(tokens.headings.myImages)}</Typography>
            <div>
              <Typography
                variant="body2"
                sx={{ paddingTop: '30px', paddingBottom: '30px' }}
              >
                {t(tokens.form.deleteImages)}
              </Typography>

            </div>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={2} justifyContent="center">
            {imageUrls.map((imageObj, index) => (
              <Grid item key={index} xs={6} sm={3} md={2} lg={2} xl={2}>
                <ThumbnailCard
                  item={{
                    id: index.toString(),
                    uid: uid,
                    size: 0,
                    type: 'file',
                    isFavorite: false,
                    name: imageObj.name // Use name from imageObj
                  }}
                  imageUrls={imageObj.url} // Use url from imageObj
                  onDelete={() => console.log("Delete")}
                  onFavorite={() => console.log("Favorite")}
                  onOpen={() => handleClickOpen(imageObj.url)} // Use url from imageObj
                />
              </Grid>

            ))}
          </Grid>


          <ItemList
            count={itemsStore.itemsCount}



            onFavorite={itemsStore.handleFavorite}

            onPageChange={itemsSearch.handlePageChange}
            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
            page={itemsSearch.state.page}
            rowsPerPage={itemsSearch.state.rowsPerPage}
            view={view}
          />

          {open && selectedImage && (
            <ImageViewer
              imageUrl={selectedImage}
              onClose={handleClose}
            />
          )}

        </Container>
      </Box>
    </>
  );
}
  Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

  export default Page;
