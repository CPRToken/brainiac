import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from 'src/libs/firebase';
import Grid from '@mui/material/Unstable_Grid2';

import { PostCard } from 'src/sections/dashboard/blog/post-card';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


interface Cap {
    avatar: string;
    name: string;
    dob: Timestamp;
    originCity: string;
     dod: string;
    cover: string;
    quote: string;
    gender?: string;
}


export const HomeCaps: React.FC = () => {

    const [caps, setCaps] = useState<Cap[]>([]);
    const numberOfItems = window.innerWidth <= 600 ? 4 : 6;

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "public"));
            const allData: Cap[] = [];  // specify the type here
            querySnapshot.forEach((doc) => {
                allData.push(doc.data() as Cap);
            });
            setCaps(allData);
        };



        fetchData();
    }, []);



    //slice means total number of items to show = 6

    return (
        <Container maxWidth="lg">


            <Typography variant="h3" sx={{ paddingTop: '100px', paddingBottom: '50px', textAlign: 'center' }}>
                All your business and Marketing needs in one place
            </Typography>
            <Typography
                variant="subtitle1"
                        sx={{
                            paddingTop: '8px',
                            paddingBottom: '10px',
                            textAlign: 'left',
                            fontSize: { xs: '1.3rem', sm: '1.2rem' }  // Add this line
                        }}>
               round the clock marteting 24/7 at affordable prices.
            </Typography>



            <Grid container spacing={4} sx={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '50px',  paddingBottom: '10px', marginTop: '15px', marginBottom: '50px' }}>

                {caps.slice(0, numberOfItems).map((cap, index) => {
                    const formattedDob = cap.dob.toDate().getFullYear(); // <-- Format the date here


                    return (
                        <Grid key={index} xs={6} md={4} sx={{ padding: 2 }}>
                            <PostCard
                                avatar={cap.avatar}
                                name={cap.name}
                                dob={formattedDob.toString()}
                                dod={cap.dod}// <-- Use the formatted date here
                                cover={cap.cover}
                                originCity={cap.originCity}
                                quote={cap.quote}
                                gender={cap.gender}
                                sx={{
                                    maxHeight: { xs: '80px', sm: 'auto' },
                                    minHeight: { xs: '80px', sm: 'auto' },
                                    width: '100%'
                                }}
                                // <-- Set a fixed width here
                            />
                        </Grid>
                    );
                })}
            </Grid>
            {/* ... */}
        </Container>

    );

};
