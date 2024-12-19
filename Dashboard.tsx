import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import MainGrid from './components/MainGrid';
// import SideMenu from './components/SideMenu';

export default function Dashboard() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <AppNavbar />
        {/* <SideMenu /> */}
        {/* Main content */}
        <Box
          component='main'
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              pt: 2,
              mx: 3,
              pb: 10,
              mt: { xs: 8 },
            }}
          >
            {/* <Header /> */}
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </>
  );
}
