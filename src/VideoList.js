import React, { forwardRef, Fragment, useState } from 'react';
import { IconButton, List, TextField, Grid } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import produce from 'immer'

import { useLocalStorage } from 'usehooks-ts';
import VideoItem from './VideoItem';
import { Box } from '@mui/system';

const VideoList = (props) => {
    const [vid, setVid] = useState('')
    const [error, setError] = useState(null)
    const [title, setTitle] = useState('')
    const [videoData, setVideoData] = useLocalStorage('YTLooper.videoData', {
        videos: [
            // {
            //     VID: 'qs9KVyJnKIU',
            //     Loops: [
            //         {
            //             A: 5,
            //             B: 60
            //             Description: 'loop over hard part'
            //         }
            //     ]
            // },
        ]
    })

    const setVideo = (value) => {
        if (value.match(/^[0-9a-zA-Z_-]{11}$/)) {
            setVid(value)
            setError(null)
            props.setVID(value)
        }
        else if (value == null || value == "") {
            setError(null)
        }
        else {
            setError('Invalid Video ID')
        }
    }

    const addVideo = () => {
        var newList = produce(videoData, draft => {
            draft.videos.push({VID: vid})
        })
        setVideoData(newList)
    }

    const deleteVideo = (VID)=> {
        var newList = produce(videoData, draft => {
            draft.videos = draft.videos.filter(v => v.VID != VID)
        })
        setVideoData(newList)
    }

    return (
        <Fragment>
            <Grid container>
                <Grid item xs={10}>
                    <TextField 
                        variant='standard'
                        label="Video ID or URL" 
                        helperText={error}
                        onBlur={evt => setVideo(evt.target.value)}
                        // setError={error != null}
                    />
                </Grid>
                <Grid item xs={2}>
                <IconButton onClick={evt => {addVideo()}} style={{paddingTop: 17}}>
                    <AddCircleIcon/>
                </IconButton>
                </Grid>
                <Grid item>
                    <List>
                    { videoData.videos.map((video, index) => {
                        return <VideoItem video={video} delete={deleteVideo}/>
                    })}
                    </List>
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default forwardRef(VideoList)