import React, { forwardRef, Fragment, useEffect, useState, useContext } from 'react';
import { IconButton, Tooltip, Popover, Typography, Menu, MenuItem, Box, Link, Grid, TextField } from '@mui/material'
import { TreeView } from '@mui/lab'
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsIcon from '@mui/icons-material/Settings';
import LoopIcon from '@mui/icons-material/Loop';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { secondsToHms, defaultLoop } from './functions';
import FileImporter from './FileImporter';

import { useLocalStorage } from 'usehooks-ts';
import PreviewVideoDialog from './PreviewVideoDialog';
import AppInfo from './AppInfo';
import { PlayerContext } from './PlayerProvider';
import loopIcon from './LoopIconLight.png'

import StyledTreeItem from './StyledTreeItem'

const TopNav = (props) => {
    const { setCurrentVID, player } = useContext(PlayerContext);
    const [openDialog, setOpenDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [videoData, setVideoData] = useLocalStorage('YTLooper.videoData', {videos: []})
    const [videoListAnchor, setVideoListAnchor] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [vid, setVid] = useState(null)
    const open = Boolean(videoListAnchor);
    const menuOpen = Boolean(menuAnchor);
    
    const closeDialog = () => {
        setOpenDialog(false)
    } 
    const closeInfoDialog = () => {
        setOpenInfoDialog(false)
    }

    const selectVideo = (video) => {
        if (video.loops.length == 0) {
            setCurrentVID({
                ...defaultLoop,
                VID: video.VID, 
                Title: 'From Extension'
            })
            setVideoListAnchor(null)
        }
    }

    
    const importLoops = (text) => {
        setVideoData(JSON.parse(text))
    };

    useEffect(() => {
        if (videoData && videoData.videos.length > 0) {
            setVid(videoData.videos[0].VID)
        }
    }, [videoData])

    return (
        <Fragment>
            <AppBar position="static">
                <Toolbar variant="dense" className="mainToolbar">
                <IconButton className='menuIcon'
                    onClick={(evt) => { setMenuAnchor(evt.target)}}
                >
                    <MenuIcon/>
                </IconButton>
                    <Typography variant="h4">YT L <img src={loopIcon} style={{width: '42px', verticalAlign: 'bottom', paddingRight: '2px', marginLeft: '-5px'}} />per</Typography> 
                    <div className='appIcons'>
                        <Tooltip title='Manage Loops'>
                            <IconButton variant="contained" className='navIcon' onClick={(evt) => { setVideoListAnchor(evt.target)}}>
                                <BookmarkIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>
            <PreviewVideoDialog
                open={openDialog}
                close={closeDialog}
            />
            <AppInfo
                open={openInfoDialog}
                close={closeInfoDialog}
            />
            <Popover
                id="videoListID"
                className="videoListPopover"
                open={open}
                anchorEl={videoListAnchor}
                onClose={() => { setVideoListAnchor(null) }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{marginLeft: '20px'}}>
                            <TextField variant='standard' label='Search'/>
                            <Tooltip title='Export Loops'>
                                <Box sx={{verticalAlign: 'middle', display: 'inline' }}>
                                    <Link underline="none" color='inherit'
                                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                            JSON.stringify(videoData)
                                        )}`}
                                        download="YTLooperConfig.json">
                                            <FileDownloadIcon/>
                                    </Link>
                                </Box>
                            </Tooltip> 
                            <Tooltip title='Import Loops'>
                                <FileImporter handleText={(text) => importLoops(text)} />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        { videoData.videos.length > 0 &&
                            <TreeView
                                // aria-label="gmail"
                                defaultExpanded={["3"]}
                                defaultCollapseIcon={<ArrowDropDownIcon />}
                                defaultExpandIcon={<ArrowRightIcon />}
                                defaultEndIcon={<div style={{ width: 24 }} />}
                                sx={{
                                    height: 300,
                                    flexGrow: 1,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    paddingRight: "10px"
                                }}
                            >
                                {videoData.videos.map((video, index) => (
                                    <StyledTreeItem
                                        key={video.VID}
                                        nodeId={video.VID}
                                        labelText={video.Title}
                                        labelIcon={MusicVideoIcon}
                                        color="#1a73e8"
                                        bgColor="#e8f0fe"
                                        onClick={() => selectVideo(video)}
                                    >
                                        {video.loops.map((loop, index) => (
                                            <StyledTreeItem
                                                key={loop.ID}
                                                nodeId={loop.ID}
                                                labelText={
                                                    (loop.Desc || '') +
                                                    ' - A(' +  secondsToHms(loop.A) +')' +
                                                    ' ' +
                                                    'B(' +  secondsToHms(loop.B) +')'
                                                }
                                                labelIcon={LoopIcon}
                                                color="#1a73e8"
                                                bgColor="#e8f0fe"
                                                onClick={() => {
                                                    setCurrentVID({VID: video.VID, Title: video.Title, loop: loop})
                                                    setVideoListAnchor(null)
                                                }}
                                            />
                                        ))}
                                    </StyledTreeItem>
                                ))}
                            </TreeView>
                        }
                        { videoData.videos.length == 0 && <Typography sx={{ p: 2 }}>No Videos Saved</Typography>}
                    </Grid>
                </Grid>
            </Popover>
            <Menu
                id="menu"
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={() => { setMenuAnchor(null)}}
            >
                <MenuItem onClick={(evt) => {
                        setOpenDialog(true);
                        setMenuAnchor(null)
                    }}
                >
                    <Box sx={{ marginRight: '10px' }}>
                        <PreviewIcon/>
                    </Box>Open Video
                </MenuItem>
                <MenuItem>
                    <Box sx={{ marginRight: '10px' }}>
                        <SettingsIcon/>
                    </Box>Preferences
                </MenuItem>
                <MenuItem onClick={() => {
                        setOpenInfoDialog(true)
                        setMenuAnchor(null)
                    }}>
                    <Box sx={{marginRight: '10px'}}>
                        <InfoIcon/>
                    </Box>About
                </MenuItem>
            </Menu>
        </Fragment>
    );
}

export default forwardRef(TopNav)