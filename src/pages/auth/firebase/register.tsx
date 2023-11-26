import { NextPage } from 'next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';

import { GuestGuard } from 'src/guards/guest-guard';
import { IssuerGuard } from 'src/guards/issuer-guard';
import { useRouter } from 'src/hooks/use-router';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { paths } from 'src/paths';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Issuer } from 'src/utils/auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from 'src/libs/firebase';
import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
  } else {
  }
});




const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
   email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(7).max(255).required('Password is required'),
  policy: Yup.boolean().oneOf([true], 'This field must be checked'),
});



const Page: NextPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      quote: '',
      firstName: '',
      lastName: '',
        dob: null,
      email: '',
      password: '',
      policy: false,
      currentCity: '',
      originCity: '',


    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log('Form onSubmit started');
      try {
        console.log('Firebase createUserWithEmailAndPassword starting');
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
        console.log('Firebase createUserWithEmailAndPassword finished', user);
        // Construct the user URL


        const defaultCoverImageUrl = "/assets/covers/brainiac.png";

        const profileURL = `${values.firstName}${values.lastName}`.toLowerCase().replace(/\s+/g, '');



        console.log("User created successfully", user);
        // After successfully creating the user
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
            email: user.email,
          quote: values.quote,
          cover: defaultCoverImageUrl,
          originCity: values.originCity,
            userUrl: profileURL,
          role: 'owner',
          team: [],

        });

// For public data


        // Redirect to the user's profile page
        router.push('/auth/firebase/login',);

// ... (rest of your catch block and other code)



      } catch (error) {
        console.error("Error during user creation or data saving:", error);
        setErrors({ email: error.message });

      } finally {
        setSubmitting(false);
      }
    }
  });



  const nextStep = () => {
    setCurrentStep(currentStep + 1);

  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Seo title="Register" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              currentStep === 1 ? (
                <Typography color="text.secondary" variant="body2">
                  Already have an account? &nbsp;
                  <Link
                    component={RouterLink}
                    href={paths.auth.firebase.login}
                    underline="hover"
                    variant="subtitle2"
                  >
                    Log in
                  </Link>
                </Typography>
              ) : (
                currentStep > 1 && (
                  <Button onClick={prevStep}
                          sx={{ alignSelf: 'flex-start' }}>
                    ← Previous
                  </Button>

                )
              )
            }
            sx={{ pb: 0 }}
            title={currentStep === 1 ? 'Register' : ''}
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              {/* Step 1 */}
              {currentStep === 1 && (
                <Stack spacing={3}>
                  {currentStep > 1 && <Button onClick={prevStep}>Previous</Button>}
                  <TextField
                    error={Boolean(formik.touched.quote && formik.errors.quote)}
                    fullWidth
                    helperText={formik.touched.quote && formik.errors.quote}
                    label="Favorite Quote"
                    name="quote"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.quote}
                    placeholder="Optional: Share a quote that represents you"
                  />

                  <TextField
                    error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                    fullWidth
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    label="Name"
                    name="firstName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                  />
                  <TextField
                    error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                    fullWidth
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    label="Surname"
                    name="lastName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                  />

                  <Button
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={nextStep}
                  >
                    Next
                  </Button>

                </Stack>
              )}

              {/* Step 2 (previously 3) */}
              {currentStep === 2 && (
                <Stack spacing={3}>


                      <TextField
                          error={Boolean(formik.touched.email && formik.errors.email)}
                          fullWidth
                          helperText={formik.touched.email && formik.errors.email}
                          label="Email"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="email"
                          value={formik.values.email}
                      />
                      <TextField
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        fullWidth
                        helperText={formik.touched.password && formik.errors.password}
                        label="Password"
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            ml: -1,
                            mt: 1,
                          }}
                      >
                        <Checkbox
                            checked={formik.values.policy}
                            name="policy"
                            onChange={formik.handleChange}
                        />
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                          I have read the{' '}
                          <Link
                              component="a"
                              href="#"
                          >
                            Terms & Conditions
                          </Link>
                        </Typography>
                      </Box>
                      {Boolean(formik.touched.policy && formik.errors.policy) && (
                          <FormHelperText error>{formik.errors.policy}</FormHelperText>
                      )}
                      <Button
                        disabled={formik.isSubmitting}
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                      >
                        Register
                      </Button>
                    </Stack>
                )}
                {/* ... */}

              </form>
            </CardContent>
          </Card>
        </div>
      </>
  );
}



Page.getLayout = (page) => (
    <IssuerGuard issuer={Issuer.Firebase}>
      <GuestGuard>
        <AuthLayout>{page}</AuthLayout>
      </GuestGuard>
    </IssuerGuard>
);

export default Page;
