import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsInbox, BsMailbox } from 'react-icons/bs';
import { BiMenu } from 'react-icons/bi';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_STATUS, statesColours } from "../constants/constants";
import { useClerk } from "@clerk/clerk-react";
import Tooltip from "../components/common/ToolTip";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaExclamation, FaSignOutAlt } from "react-icons/fa";
import { setUser } from "../redux/auth/auth";
import { setTutor } from "../redux/tutor/tutorData";
import { setStudent } from "../redux/student/studentData";
import { moment } from '../config/moment'
import educationVideo from '../assets/videos/education.mp4'
import collabVideo from '../assets/videos/collaboration.mp4'
import feedbackVideo from '../assets/videos/feedback.mp4'
import introVideo from '../assets/videos/intro.mp4'
import motivateVideo from '../assets/videos/motivation.mp4'
import calenderVideo from '../assets/videos/calender.mp4'
import facultiesVideo from '../assets/videos/faculties.mp4'
import setupVideo from '../assets/videos/setup.mp4'
import marketplaceVideo from '../assets/videos/marketplace.mp4'
import { PiVideoBold } from "react-icons/pi";

import TabInfoVideoToast from "../components/common/TabInfoVideoToast";
import Avatar from "../components/common/Avatar";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({children}) {

    const {tutor}=useSelector(state=>state.tutor)
    const tabs = [
        { url: "/tutor/intro", name: "Introduction", video: introVideo },
        { url: "/tutor/setup", name: "Setup", video: setupVideo },
        { url: "/tutor/education", name: "Education", video: educationVideo },
        { url: "/tutor/rates", name: "Motivate", video: motivateVideo },
        { url: "/tutor/accounting", name: "Accounting", },
        { url: "/tutor/subjects", name: "Subjects", video: facultiesVideo },
        { url: "/tutor/scheduling", name: "Scheduling", video: calenderVideo },
        { url: "/tutor/feedback", name: "Feedback", video: feedbackVideo },
        { url: "/tutor/my-students", name: "My students" },
        { url: "/tutor/term-of-use", name: "Terms Of Use" },
        { url: "/tutor/chat", name: "Message Board", },
        { url: "/tutor/market-place", name: "Market place", video: marketplaceVideo },
        { url: "/tutor/agency", name: "Agency" },
        { url: "/collab", name: "Collaboration", common: true, video: collabVideo },
        { url: `/tutor/tutor-profile/${tutor.AcademyId}`, name: "Profile", },
      ];
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{background:"linear-gradient(195deg, #42424a, #191919)"}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <BiMenu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
           <img width={200} height={50}  alt='' src={`${process.env.REACT_APP_BASE_URL}/logo1.png`}/>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer  variant="permanent" open={open}>
        <DrawerHeader  sx={{color:"white",background:"linear-gradient(195deg, #42424a, #191919)", boxShadow:"0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)"}}>
        <img alt="" src={`${process.env.REACT_APP_BASE_URL}/favicon.png`} width={50} height={"55"} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <FaChevronRight color='white' /> : <FaChevronLeft color='white' />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{color:"white",background:"linear-gradient(195deg, #42424a, #191919)", boxShadow:"0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)"}}>
          {tabs.map(({name:text, url}, index) => (
            <ListItem
            onClick={()=>navigate(url)}
            sx={{ borderRadius:"8px" ,":hover":{background:"rgba(255, 255, 255, 0.2)"}}} key={text} disablePadding>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <BsInbox color='white' /> : <BsMailbox color='white' />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <Divider /> */}
        {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <BsInbox /> : <BsMailbox />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
       {children}
      </Box>
    </Box>
  );
}
