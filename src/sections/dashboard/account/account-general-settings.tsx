import type { FC } from 'react';
import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {auth, db }  from "../../../libs/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState} from 'react';
import { doc, updateDoc, getDoc } from "firebase/firestore";




interface AccountGeneralSettingsProps {
    uid?: string;
  avatar: string;
  email: string;
  name?: string;
  maritalStatus?: string;
     highSchool?: string;
     highestYearCompleted?: string;
    university?: string;
    degree?: string;
        placesWorked?: string;
       quote?: string;
}




export const AccountGeneralSettings: FC<AccountGeneralSettingsProps> = (props) => {
    const { avatar, name, quote, email, maritalStatus, highSchool, highestYearCompleted, university, degree, placesWorked } = props;
    const [uid, setUid] = useState<string | null>(null); // Add this line to hold uid this line to hold uid
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
    const [isPublic, setIsPublic] = useState(false);

  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [newQuote, setNewQuote] = useState(quote);


    const [isEditingMaritalStatus, setIsEditingMaritalStatus] = useState(false);
    const [newMaritalStatus, setNewMaritalStatus] = useState(maritalStatus);



  const [isEditingHighSchool, setIsEditingHighSchool] = useState(false);
  const [newHighSchool, setNewHighSchool] = useState(highSchool);

  const [isEditingHighestYear, setIsEditingHighestYear] = useState(false);
  const [newHighestYearCompleted, setHighestYear] = useState(highestYearCompleted);


  const [isEditingUni, setIsEditingUni] = useState(false);
    const [newUni, setNewUni] = useState(university);


  const [isEditingDegree, setIsEditingDegree] = useState(false);
  const [newDegree, setDegree] = useState(degree);



  const [isEditingPlacesWorked, setIsEditingPlacesWorked] = useState(false);
  const [newPlacesWorked, setNewPlacesWorked] = useState(placesWorked);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);




    useEffect(() => {


        const fetchIsPublic = async () => {

            const uid = auth.currentUser?.uid;
            if (!uid) return;
            const userDocRef = doc(db, 'users', uid);

            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                setIsPublic(docSnapshot.data().isPublic || false);
            }
        };
        fetchIsPublic();
    }, [uid]);

    const handleToggle = async () => {
        const newIsPublic = !isPublic;
        setIsPublic(newIsPublic);
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { isPublic: newIsPublic });
    };







  const handleEditClick = () => {
    setIsEditingName(true);
  };

  const handleSaveClick = async () => {
      if (uid) {
    const userRef = doc(db, 'users', uid);

    await updateDoc(userRef, {
      name: newName
    });

    setIsEditingName(false);
        } else {

      }
  };



  //edit quote below

  const handleEditQuoteClick = () => {
    setIsEditingQuote(true);
  };
  const handleSaveQuoteClick = async () => {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        quote: newQuote
      });
      setIsEditingQuote(false);
    } else {
      // Handle the case when uid is null
      console.error("UID is null. Cannot update document.");
    }
  };

//edit quote end here



    //edit quote below

    const handleEditMaritalStatusClick = () => {
        setIsEditingMaritalStatus(true);
    };
    const handleSaveMaritalStatusClick = async () => {
        if (uid) {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                maritalStatus: newMaritalStatus
            });
            setIsEditingMaritalStatus(false);
        } else {
            // Handle the case when uid is null
            console.error("UID is null. Cannot update document.");
        }
    };

//edit quote end here


  const handleEditHighSchoolClick = () => {
    setIsEditingHighSchool(true);
    setIsEditingHighestYear(true);
  };

// Combine the save functions to update both fields at once
  const handleSaveHighSchoolClick = async () => {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        highSchool: newHighSchool,
        highestYearCompleted: newHighestYearCompleted,
      });
      setIsEditingHighSchool(false);
      setIsEditingHighestYear(false);
    } else {
      console.error("UID is null. Cannot update document.");
    }
  };





  const handleEditUniClick = () => {
        setIsEditingUni(true);
        setIsEditingDegree(true);
    };
    const handleSaveUniClick = async () => {
        if (uid) {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                university: newUni,
              degree: newDegree,
            });
            setIsEditingUni(false);
            setIsEditingDegree(false);
        } else {
            // Handle the case when uid is null
            console.error("UID is null. Cannot update document.");
        }
    };



  const handleEditPlacesWorkedClick = () => {
    setIsEditingPlacesWorked(true);
  };
  const handleSavePlacesWorkedClick = async () => {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        placesWorked: newPlacesWorked
      });
      setIsEditingPlacesWorked(false);
    } else {
      // Handle the case when uid is null
      console.error("UID is null. Cannot update document.");
    }
  };



    const { t } = useTranslation();




  return (
      <Stack
          spacing={4}
          {...props}
      >
        <Card>
          <CardContent>
            <Grid
                container
                spacing={3}
            >
              <Grid
                  xs={12}
                  md={4}
              >
                  <Typography variant="h5">{t(tokens.nav.details)}</Typography>
              </Grid>
              <Grid
                  xs={12}
                  md={8}
              >
                <Stack spacing={3}>
                  <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                  >
                    <Box
                        sx={{
                          borderColor: 'neutral.300',
                          borderRadius: '50%',
                          borderStyle: 'dashed',
                          borderWidth: 1,
                          p: '4px',
                        }}
                    >
                      <Box
                          sx={{
                            borderRadius: '50%',
                            height: '100%',
                            width: '100%',
                            position: 'relative',
                          }}
                      >
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
                              Select
                            </Typography>
                          </Stack>
                        </Box>
                        <Avatar
                            src={avatar}
                            sx={{
                              height: 100,
                              width: 100,
                            }}
                        >
                          <SvgIcon>
                            <User01Icon />
                          </SvgIcon>
                        </Avatar>
                      </Box>
                    </Box>
                    <Button
                        color="inherit"
                        size="small"
                    >
                        <Typography >{t(tokens.headings.changeAvatar)}</Typography>
                    </Button>
                  </Stack>
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <TextField
                      defaultValue={name}
                      disabled={!isEditingName}
                      label={t(tokens.form.name)}
                      sx={{ flexGrow: 1 }}
                    />
                    {isEditingName ? (
                      <Button color="inherit" size="small" onClick={handleSaveClick}>
                        Save
                      </Button>
                    ) : (
                      <Button color="inherit" size="small" onClick={handleEditClick}>
                        Edit
                      </Button>
                    )}
                  </Stack>
                  <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                  >
                    <TextField
                        defaultValue={email}
                        disabled
                        label={t(tokens.form.email)}
                        required
                        sx={{
                          flexGrow: 1,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderStyle: 'dashed',
                          },
                        }}
                    />

                    <Button
                        color="inherit"
                        size="small"
                        onClick={handleEditClick}
                    >
                      Edit
                    </Button>
                  </Stack>




                  <Stack alignItems="center" direction="row" spacing={2}>
                    <TextField
                      defaultValue={newMaritalStatus}
                      label={t(tokens.form.maritalStatus)}
                      disabled={!isEditingMaritalStatus}
                      onChange={(e) => setNewMaritalStatus(e.target.value)}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {isEditingMaritalStatus ? (
                      <Button color="inherit" size="small" onClick={handleSaveMaritalStatusClick}>
                        Save
                      </Button>
                    ) : (
                      <Button color="inherit" size="small" onClick={handleEditMaritalStatusClick}>
                        Edit
                      </Button>
                    )}
                  </Stack>









                  <Stack alignItems="center" direction="row" spacing={2}>
                        <TextField
                            defaultValue={newQuote}
                            label={t(tokens.headings.citaFavorita)}
                            disabled={!isEditingQuote}
                            onChange={(e) => setNewQuote(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderStyle: 'dashed',
                                },
                            }}
                        />
                        {isEditingQuote ? (
                            <Button color="inherit" size="small" onClick={handleSaveQuoteClick}>
                                Save
                            </Button>
                        ) : (
                            <Button color="inherit" size="small" onClick={handleEditQuoteClick}>
                                Edit
                            </Button>
                        )}
                    </Stack>


                  <Stack alignItems="center" direction="row" spacing={2}>
                    <TextField
                      defaultValue={newHighSchool}
                      label={t(tokens.form.highSchool)}
                      disabled={!isEditingHighSchool}
                      onChange={(e) => setNewHighSchool(e.target.value)}
                      sx={{
                        width: 'calc(50% - 8px)', // Adjust the value 8px according to your spacing needs
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    <TextField
                      defaultValue={highestYearCompleted}
                      label={t(tokens.form.highestYearCompleted)}
                      disabled={!isEditingHighSchool}
                      onChange={(e) => setHighestYear(e.target.value)}
                      sx={{
                        width: 'calc(50% - 8px)', // Adjust the value 8px according to your spacing needs
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {isEditingHighSchool ? (
                      <Button color="inherit" size="small" onClick={handleSaveHighSchoolClick}>
                        Save
                      </Button>
                    ) : (
                      <Button color="inherit" size="small" onClick={handleEditHighSchoolClick}>
                        Edit
                      </Button>
                    )}
                  </Stack>




                  <Stack alignItems="center" direction="row" spacing={2}>
                    <TextField
                      defaultValue={newUni}
                      label={t(tokens.form.university)}
                      disabled={!isEditingUni}
                      onChange={(e) => setNewUni(e.target.value)}
                      sx={{
                        width: '50%', // Adjust the width to 50%
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    <TextField // New TextField for degreeType
                      defaultValue={degree}
                      label={t(tokens.form.degree)}
                      disabled={!isEditingUni}
                      onChange={(e) => setDegree(e.target.value)}
                      sx={{
                        width: '50%', // Adjust the width to 50%
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {isEditingUni ? (
                      <Button color="inherit" size="small" onClick={handleSaveUniClick}>
                        Save
                      </Button>
                    ) : (
                      <Button color="inherit" size="small" onClick={handleEditUniClick}>
                        Edit
                      </Button>
                    )}
                  </Stack>


                  <Stack alignItems="center" direction="row" spacing={2}>
                    <TextField
                      defaultValue={newPlacesWorked}
                      label={t(tokens.form.placesWorked)}
                      disabled={!isEditingPlacesWorked}
                      onChange={(e) => setNewPlacesWorked(e.target.value)}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderStyle: 'dashed',
                        },
                      }}
                    />
                    {isEditingPlacesWorked ? (
                      <Button color="inherit" size="small" onClick={handleSavePlacesWorkedClick}>
                        Save
                      </Button>
                    ) : (
                      <Button color="inherit" size="small" onClick={handleEditPlacesWorkedClick}>
                        Edit
                      </Button>
                    )}
                  </Stack>


                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid
                container
                spacing={3}
            >
              <Grid
                  xs={12}
                  md={4}
              >
                <Typography variant="h6">Public profile</Typography>
              </Grid>
              <Grid
                  xs={12}
                  sm={12}
                  md={8}
              >
                <Stack
                    divider={<Divider />}
                    spacing={3}
                >
                  <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">Make Contact Info Public</Typography>
                      <Typography
                          color="text.secondary"
                          variant="body2"
                      >
                        Means that anyone viewing your profile will be able to see your contacts
                        details.
                      </Typography>
                    </Stack>
                      <div>
                          <label>Make Profile Public:</label>
                          <Switch checked={isPublic}
                                  onChange={handleToggle} />
                      </div>
                  </Stack>
                  <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">Available to hire</Typography>
                      <Typography
                          color="text.secondary"
                          variant="body2"
                      >
                        Toggling this will let your teammates know that you are available for
                        acquiring new projects.
                      </Typography>
                    </Stack>
                    <Switch defaultChecked />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid
                container
                spacing={3}
            >
              <Grid
                  xs={12}
                  md={4}
              >
                <Typography variant="h6">Delete Account</Typography>
              </Grid>
              <Grid
                  xs={12}
                  md={8}
              >
                <Stack
                    alignItems="flex-start"
                    spacing={3}
                >
                  <Typography variant="subtitle1">
                    Delete your account and all of your source data. This is irreversible.
                  </Typography>
                  <Button
                      color="error"
                      variant="outlined"
                  >
                    Delete account
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>

  );
};

AccountGeneralSettings.propTypes = {
    uid: PropTypes.string,
  avatar: PropTypes.string.isRequired,
   email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
    highSchool: PropTypes.string,
     quote: PropTypes.string,
};
