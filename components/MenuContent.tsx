import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton, {
  listItemButtonClasses,
} from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { Typography } from '@mui/material';

const mainListItems = [
  // { text: 'Home', icon: <HomeRoundedIcon /> },
  // { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
  // { text: 'Clients', icon: <PeopleRoundedIcon /> },
  { text: 'Fokus sager', icon: <AssignmentRoundedIcon /> },
];

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
//   { text: 'Feedback', icon: <HelpRoundedIcon /> },
// ];

export default function MenuContent() {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        pr: 1,
        justifyContent: 'space-between',
        minWidth: 'content-fit',
      }}
    >
      <List>
        {mainListItems.map((item, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={{
              display: 'block',
              [`& .${listItemButtonClasses.root}`]: {
                pt: '12px',
                pb: '12px',
                pr: '90px',
                pl: '30px',
                borderTopRightRadius: '60px',
                borderBottomRightRadius: '60px',
              },
              [`& .${listItemButtonClasses.selected} `]: {
                color: '#1081cc',
              },
            }}
          >
            <ListItemButton selected={index === 0}>
              <ListItemIcon
                sx={{ scale: 1.2, color: index === 0 ? '#1081cc' : 'inherit' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant='body1'
                  sx={{
                    color: index === 0 ? '#1081cc' : 'text.primary',
                    fontWeight: 600,
                    letterSpacing: '0px',
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
