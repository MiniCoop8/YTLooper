import React,{ useEffect, useState, useContext } from 'react';
import { Box, Button, IconButton, Slider, Grid, Tooltip, TextField, Typography } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import LoopIcon from '@mui/icons-material/Loop';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import YouTube from '@u-wave/react-youtube';
import { useInterval } from 'usehooks-ts';
import { useAlert } from 'react-alert'
import { secondsToHms } from './functions'
import { PlayerContext } from './PlayerProvider';
import { useLocalStorage } from 'usehooks-ts';
import produce from 'immer'
import uniqid from 'uniqid'
import { defaultLoop } from './functions';
import useConfimDialog from './useConfirmDialog';

const Player = (props) => {
    const { player, setPlayer, currentVID, setCurrentVID } = useContext(PlayerContext);
    const alert = useAlert()
    const [videoData, setVideoData] = useLocalStorage('YTLooper.videoData', {videos: []})
    const [currentPosition, setCurrentPosition] = useState(0)
    const [positionMarkers, setPositionMarkers] = useState([])
    const [range, setRange] = useState([0, 0])
    const [rangeMarks, setRangeMarks] = useState([])
    const [playerWidth] = useState(820)
    const [showPlay, setShowPlay] = useState(true)
    const [max, setMax] = useState(0)
    const [loopDesc, setLoopDesc] = useState('')
    const [loopEnabled, setLoopEnabled] = useState(true)
    const { ShowConfirm, CloseConfirm, ConfirmDialog } = useConfimDialog()
    const [loopLocked, setLoopLocked] = useState(false)

    const ShowDeleteLoopConfirm = () => {
        ShowConfirm({
            Title: "Remove loop?",
            Message: "Do you want to remove this loop?",
            Labels: ['Remove', 'Cancel'],
            OnCancel: () => console.log('Confirm Canceled'),
            OnConfirm: () => removeLoop()
        })
    }

    const ShowDeleteVideoConfirm = () => {
        ShowConfirm({
            Title: "Remove video?",
            Message: "Do you want to remove this video?",
            Labels: ['Remove', 'Cancel'],
            OnCancel: () => console.log('Confirm Canceled'),
            OnConfirm: () => removeVideo()
        })
    }

    const ShowNewLoopConfirm = () => {
        ShowConfirm({
            Title: "Create New Loop?",
            Message: "Do you want to create a new loop, the current loop will be reset to default values?",
            Labels: ['Reset Loop', 'Cancel'],
            OnCancel: () => console.log('Confirm Canceled'),
            OnConfirm: () => newLoop()
        })
    }

    const rateChange = (evt) => {
        player.setPlaybackRate(evt.target.value)
    }

    const sliderChange = (evt, newValue) => {
        setRange(newValue)
    }

    const setA = () => {
        if (player) {
            var newRange = [...range]
            newRange[0] = player.getCurrentTime()
            setRange(newRange)
        }
    }

    const setB = () => {
        var newRange = [...range]
        newRange[1] = player.getCurrentTime()
        setRange(newRange)
    }

    const saveVideo = () => {
        const newVideoData = produce(videoData, draftVideoData => {
            var foundVideo = videoData.videos.filter(v => {
                return v.VID == currentVID.VID
            })[0]
            var videoList = videoData.videos.filter(v => {
                return v.VID != currentVID.VID
            })

            if (!foundVideo) {
                foundVideo = {
                    VID: currentVID.VID,
                    Title: currentVID.Title,
                    loops: []
                }
            }

            var loopID = currentVID.loop.ID ?? uniqid()
            var loop = {
                ID: loopID, 
                'A': range[0], 
                'B': range[1], 
                'Desc': loopDesc, 
                Speed: player.getPlaybackRate() ,
                Locked: loopLocked
            }

            var loops = foundVideo.loops.filter(l => l.ID != loopID)
            loops.push(loop)

            foundVideo.loops = loops

            videoList.push(foundVideo)

            draftVideoData.videos = videoList
        })

        setVideoData(newVideoData)

        alert.success('Loop Saved!')
    }

    const newLoop = () => {
        setCurrentVID({...defaultLoop, VID: currentVID.VID, Title: currentVID.Title} )
        CloseConfirm()
    }

    const removeLoop = () => {
        const newVideoData = produce(videoData, draftVideoData => {
            var foundVideo = videoData.videos.filter(v => {
                return v.VID == currentVID.VID
            })[0]
            var videoList = videoData.videos.filter(v => {
                return v.VID != currentVID.VID
            })
            var newLoops = foundVideo.loops.filter(l => {
                return l.ID != currentVID.loop.ID
            })
            foundVideo.loops = newLoops
            videoList.push(foundVideo)

            draftVideoData.videos = videoList
        })

        setVideoData(newVideoData)

        setRange([0, max])
        alert.success('Loop Removed!')
        CloseConfirm()
    }

    const removeVideo = () => {
        const newVideoData = produce(videoData, draftVideoData => {
            var videoList = videoData.videos.filter(v => {
                return v.VID != currentVID.VID
            })

            draftVideoData.videos = videoList
        })

        setVideoData(newVideoData)

        alert.success('Video Removed!')
        CloseConfirm()
    }

    const onReady = (evt) => {
        setPlayer(evt.target)

        const urlSearchParams = new URLSearchParams(window.location.search.substr(window.location.search.indexOf('?')));
        const params = Object.fromEntries(urlSearchParams.entries());
    
        if (params.v) {
            setCurrentVID({
                ...defaultLoop,
                VID: params.v, 
                Title: 'From Extension'
            })
        }
    }

    const setPosition = () => {
        if (player && [1,3].includes(player.getPlayerState())) {
            var currentTime = player.getCurrentTime()
            setCurrentPosition(currentTime)

            if (loopEnabled) {
                if (range[1] != null && currentTime > range[1]) {
                    player.seekTo(range[0])
                }
            }
        }
    }

    const backToA = () => {
        player.seekTo(range[0])
    }

    useInterval(setPosition, 250)

    useEffect(() => {
        if (currentVID) {
            setLoopDesc(currentVID.loop.Desc)
            setRange([currentVID.loop.A, currentVID.loop.B])
            setLoopLocked(currentVID.loop.Locked)

            if (currentVID.loop.A != null) {
                setCurrentPosition(currentVID.loop.A)
                player.seekTo(currentVID.loop.A)

                player.setPlaybackRate(currentVID.loop.Speed || 1)
            }
        }
    }, [currentVID])

    useEffect(() => {
        if (range) {
            if (range[1] == 0) {
                setRangeMarks([])
            }
            else {
                setRangeMarks([
                    {
                        value: range[0],
                        label: 'A'
                        // label: 'A(' +  secondsToHms(range[0]) +')'
                    },
                    {
                        value: range[1],
                        label: 'B'
                        // label: 'B(' + secondsToHms(range[1]) + ')'
                    }
                ])
            }
        }
    }, [range])

    useEffect(() => {
        if (max && range[1] == null) {
            setRange([0, max])
        }
    }, [max])

    useEffect(() => {
        if (currentPosition) {
            setPositionMarkers([{
                value: currentPosition,
                label: secondsToHms(currentPosition)
            }])
        }
    }, [currentPosition])

    return (
        <Box>
            <Box width={playerWidth}>
                <YouTube
                    video={(currentVID && currentVID.VID)? currentVID.VID : null} // defaults -> null
                    onReady={onReady}  
                    onPlaying={() => setShowPlay(false)} 
                    onPause={() => setShowPlay(true)} 
                    onEnd={() => setShowPlay(true)} 
                    onError={() => setShowPlay(true)} 
                    // onStateChange={stateChanged} 
                    onCued={() => setMax(player.getDuration())}
                    autoplay={false}
                    showCaptions={false}
                    controls={true}
                    showRelatedVideos={false}
                    modestbranding={true}
                    annotations={false}
                    startSeconds={range[0]}
                    endSeconds={max}
                    height={playerWidth/1.641}
                    width={playerWidth}
                />
                <Slider 
                    size='medium'
                    className='positionSlider'
                    value={currentPosition}
                    step={0.01}
                    max={max}
                    // onChange={sliderChange}
                    track={false}
                    marks={positionMarkers}
                />
            </Box>
            <Box className=''>
                <Grid container item>
                    <Slider 
                        size='small'
                        className='videoSlider'
                        value={range}
                        step={1}
                        max={max}
                        disabled={currentVID == null}        
                        disableSwap={true}                
                        onChange={sliderChange}
                        marks={rangeMarks}
                    />
                </Grid> 
                <Grid container item>
                    <Box sx={{ display: 'inline-flex', width: '100%' }}>
                        <Grid item className='controlButton loopButton'>
                            <Tooltip title='Mark start of Loop'>
                                <Button onClick={() => { setA() }} disabled={loopLocked}>A</Button>
                            </Tooltip>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title='Back to A'>
                                <IconButton onClick={backToA}>
                                    <ArrowCircleLeftIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        { (showPlay?
                            <Grid item className='controlButton'>
                                <Tooltip title='Play'>
                                    <IconButton onClick={() => player.playVideo()}>
                                        <PlayCircleIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            :
                            <Grid item className='controlButton'>
                                <Tooltip title='Pause'>
                                    <IconButton onClick={() => player.pauseVideo()}>
                                        <PauseCircleIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}
                        <Grid item className='controlButton'>
                            { !loopEnabled &&
                                <Tooltip title='Enable Loop'>
                                    <span>    
                                        <IconButton disabled={currentVID == null} onClick={() => setLoopEnabled(true)}>
                                            <LoopIcon/>
                                        </IconButton>
                                    </span>    
                                </Tooltip>
                            }
                            { loopEnabled &&
                                <Tooltip title='Cancel Loop'>
                                    <span>    
                                        <IconButton disabled={currentVID == null} onClick={() => setLoopEnabled(false)}>
                                            <CancelPresentationIcon/>
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            }
                        </Grid>
                        <Grid item className='controlButton loopButton'>
                            <Tooltip title='Mark end of Loop'>
                                <Button onClick={() => { setB() }} disabled={loopLocked}>B</Button>
                            </Tooltip>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title={(loopLocked)? 'Unlock Loop' : 'Lock Loop'}>
                                <span>    
                                    <IconButton disabled={currentVID == null} onClick={() => setLoopLocked(!loopLocked)}>
                                        { loopLocked && <LockIcon/> }
                                        { !loopLocked && <LockOpenIcon/> }
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Grid item> 
                            <Box sx={{ width: 150, paddingLeft: '20px', paddingRight: '20px' }}>
                                <Slider
                                    value={(player)? player.getPlaybackRate() : 1}
                                    min={.5}
                                    step={.05}
                                    max={2}
                                    onChange={rateChange}
                                    disabled={currentVID == null}
                                    aria-labelledby="non-linear-slider"
                                />
                                <Typography id="non-linear-slider" gutterBottom>
                                    {(player)? player.getPlaybackRate() : 1}x
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item>
                            <TextField 
                                sx={{width: '265px', marginRight: '5px'}}
                                label="Loop Description" 
                                variant='standard'
                                disabled={currentVID == null}
                                onChange={evt => setLoopDesc(evt.target.value)}
                                value={loopDesc}
                            />
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title={(currentVID)? 'Save Loop' : 'Save Video'}>
                                <span>    
                                    <IconButton disabled={currentVID == null} onClick={saveVideo}>
                                        <SaveIcon/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title='Remove Loop'>
                                <span>
                                    <IconButton disabled={currentVID == null} onClick={() => ShowDeleteLoopConfirm()}>
                                        <RemoveCircleOutlineIcon/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title='Remove Video'>
                                <span>
                                    <IconButton disabled={currentVID == null} onClick={() => ShowDeleteVideoConfirm()}>
                                        <RemoveCircleIcon/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Tooltip title='Reset Loop'>
                                <span>
                                    <IconButton disabled={currentVID == null} onClick={() => ShowNewLoopConfirm()}>
                                        <ClearIcon/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
            {<ConfirmDialog/>}
        </Box>
    )
}

export default Player

