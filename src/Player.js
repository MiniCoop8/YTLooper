import React,{ useEffect, useState, useContext } from 'react';
import { Box, Button, IconButton, Slider, Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import LoopIcon from '@mui/icons-material/Loop';

import YouTube from 'react-youtube';
import { useInterval } from 'usehooks-ts';

import { secondsToHms } from './functions'
import { AppContext } from './AppProvider';

const Player = (props) => {
    const { player, setPlayer, currentVID } = useContext(AppContext);

    const [currentPosition, setCurrentPosition] = useState(0)
    const [positionMarkers, setPositionMarkers] = useState([])
    const [range, setRange] = useState([0, 100])
    const [rangeMarks, setRangeMarks] = useState([])
    const [playerWidth, setPlayerWidth] = useState(640)
    const [showPlay, setShowPlay] = useState(true)
    const [max, setMax] = useState(100)

    const opts = {
        height: playerWidth/1.641,
        width: playerWidth,
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            enablejsapi: 1,
            controls: 0,
            disablekb: 1, // set to 1 to dsable keboard controls
            iv_load_policy: 3,
            modestbranding: 1,
            fs:1
        },
    };

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

    const stateChanged = (evt) => {
        console.log('State: ' + evt.data)
        switch (evt.data) {
            case -1:
                setRange([0, player.getDuration()])
                setMax(player.getDuration())
                setCurrentPosition(0)
                break
            case 5:
                player.playVideo()
                break
            default:
                break
        }

    }

    const onReady = (evt) => {
        setPlayer(evt.target)
    }

    const setPostion = () => {
        setCurrentPosition(player.getCurrentTime())
    }

    useInterval(setPostion, 500)

    useEffect(() => {
        if (range) {
            setRangeMarks([
                {
                    value: range[0],
                    label: 'A(' +  secondsToHms(range[0]) +')'
                },
                {
                    value: range[1],
                    label: 'B(' + secondsToHms(range[1]) + ')'
                }
            ])
        }
    }, [range])

    useEffect(() => {
        if (currentPosition) {
            setPositionMarkers([{
                value: currentPosition,
                label: secondsToHms(currentPosition)
            }])
        }
    }, [currentPosition])

    return (
        // <Grid container item>
        <Box>
            <Box width={playerWidth}>
                <YouTube
                    videoId={currentVID} // defaults -> null
                    // id={string} // defaults -> null
                    // className={string} // defaults -> null
                    // containerClassName={string} // defaults -> ''
                    opts={opts} // defaults -> {}
                    onReady={onReady} // defaults -> noop
                    onPlay={() => setShowPlay(false)} // defaults -> noop
                    onPause={() => setShowPlay(true)} // defaults -> noop
                    onEnd={() => setShowPlay(true)} // defaults -> noop
                    onError={() => setShowPlay(true)} // defaults -> noop
                    onStateChange={stateChanged} // defaults -> noop
                    // onPlaybackRateChange={func} // defaults -> noop
                    // onPlaybackQualityChange={func} // defaults -> noop
                />
                <Slider 
                    size='large'
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
                        step={0.01}
                        max={max}
                        onChange={sliderChange}
                        marks={rangeMarks}
                    />
                </Grid> 
                <Grid container item>
                    <Box sx={{ display: 'inline-flex', width: '100%' }}>
                        <Grid item className='controlButton'>
                            <Button onClick={() => { setA() }}>A</Button>
                        </Grid>
                        <Grid item className='controlButton'>
                            <IconButton>
                                <ArrowBackIosIcon/>
                            </IconButton>
                        </Grid>
                        { (showPlay?
                            <Grid item className='controlButton'>
                                <IconButton onClick={() => player.playVideo()}>
                                    <PlayCircleIcon/>
                                </IconButton>
                            </Grid>
                            :
                            <Grid item className='controlButton'>
                                <IconButton onClick={() => player.pauseVideo()}>
                                    <PauseCircleIcon/>
                                </IconButton>
                            </Grid>
                        )}
                        <Grid item className='controlButton'>
                            <IconButton disabled={true}>
                                <LoopIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item className='controlButton'>
                            <Button onClick={() => { setB() }}>B</Button>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </Box>
    )
}

export default Player


// -1 (unstarted)
// 0 (ended)
// 1 (playing)
// 2 (paused)
// 3 (buffering)
// 5 (video cued).
// When the player first loads a video, it will broadcast an unstarted (-1) event. When a video is cued and ready to play, the player will broadcast a video cued (5) event. In your code, you can specify the integer values or you can use one of the following namespaced variables:
// YT.PlayerState.ENDED
// YT.PlayerState.PLAYING
// YT.PlayerState.PAUSED
// YT.PlayerState.BUFFERING
// YT.PlayerState.CUED