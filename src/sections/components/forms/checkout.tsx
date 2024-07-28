import { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormikProps } from 'formik';

interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  policy: boolean;
}

interface CheckoutProps {
  formik: FormikProps<CheckoutFormValues>;
}

export const Checkout: FC<CheckoutProps> = ({ formik }) => (
  <Box sx={{ p: 3 }}>
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={6}>
        <Stack spacing={3}>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box
              sx={{
                alignItems: 'center',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 20,
                display: 'flex',
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}
            >
              <Typography sx={{ fontWeight: 'fontWeightBold' }} variant="h6">
                1
              </Typography>
            </Box>
            <Typography variant="h6">User Information</Typography>
          </Stack>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </Grid>
            </Grid>
          </div>
        </Stack>
        <Stack spacing={3}>
          <FormControlLabel
            control={<Checkbox name="policy" onChange={formik.handleChange} checked={formik.values.policy} />}
            label="I accept the terms and conditions"
          />
          {formik.touched.policy && formik.errors.policy && (
            <Typography color="error">{formik.errors.policy}</Typography>
          )}
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  </Box>
);
