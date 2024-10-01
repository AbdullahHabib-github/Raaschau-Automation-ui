import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton, {
  listItemButtonClasses,
} from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

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
                padding: '12px 60px 12px 26px',
                borderTopRightRadius: '60px',
                borderBottomRightRadius: '60px',
              },
              [`& .${listItemButtonClasses.selected} `]: {
                color: 'blue',
              },
            }}
          >
            <ListItemButton
              selected={index === 0}
              sx={{
                [`.${listItemTextClasses.primary}`]: {
                  fontWeight: '550',
                },
              }}
            >
              <ListItemIcon sx={{ scale: 1.2 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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
