import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import MenuContent from './MenuContent';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={toggleDrawer}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
        zIndex: 10,
      }}
    >
      <Stack
        sx={{
          height: '100%',
        }}
      >
        <Stack
          sx={{
            flexGrow: 1,
            mt: 8,
            minWidth: '240px',
          }}
        >
          <MenuContent />
          <Divider />
        </Stack>
      </Stack>
    </Drawer>
  );
}
