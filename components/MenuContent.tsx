import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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

export default function MenuContent() {
  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
    >
      <List>
        {mainListItems.map((item, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={{
              display: 'block',
              // [`& .${listItemButtonClasses.root}`]: {
              //   pt: '12px',
              //   pb: '12px',
              //   pr: '90px',
              //   pl: '30px',
              //   borderTopRightRadius: '60px',
              //   borderBottomRightRadius: '60px',
              // },
              // [`& .${listItemButtonClasses.selected} `]: {
              //   color: '#1081cc',
              // },
            }}
          >
            <ListItemButton selected={index === 0}>
              <ListItemIcon
              // sx={{ color: index === 0 ? '#1081cc' : 'inherit' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <Typography variant='body1'>{item.text}</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
