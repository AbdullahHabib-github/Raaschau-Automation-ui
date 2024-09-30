import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedDataTable from './CustomizedDataTable';

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      {/* <Typography component='h2' variant='h6' sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid> */}
      <Typography component='h2' variant='h6' sx={{ mb: 2 }}>
        Details
      </Typography>
      {/* <Grid container spacing={2} columns={12}> */}
      {/* <Grid size={{ md: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid> */}
      {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
      {/* </Grid> */}
      <Grid size={{ md: 12, lg: 9 }} marginTop={2}>
        <CustomizedDataTable />
      </Grid>
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
