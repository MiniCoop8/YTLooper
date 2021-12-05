import { useState, useEffect, useContext, Fragment } from 'react'
import { Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import axios from 'axios';

import { AppContext } from './AppProvider'
import { Typography } from '@mui/material';

// import { secondsToHms } from './functions'


const VideoItem = (props) => {
    const { player, setCurrentVID } = useContext(AppContext)
    const [title, setTitle] = useState()
    const [videoInfo, setVideoInfo] = useState({
        title: '',
        thumbnail_url: ''
    })

    const getVideoData = () => {
        var url = 'https://www.youtube.com/watch?v=' + props.video.VID;
        axios.get('https://noembed.com/embed', {
            crossDomain: true,
            params:{
                    format: 'json', 
                    url: url
                } 
        }).then(res => { 
            setTitle(res.data.title)
            setVideoInfo(res.data)
        }).catch(error => {
            console.log('error', error);
        })
    }

    useEffect(() => {
        getVideoData()
    }, [props.video])

    return (
        <Fragment>
            <ListItem component='div' key={props.video.VID} className='itemRow'>
                <Grid container>
                    <Grid item>
                        <ListItemText className='itemText'
                            primary={<Typography type="body2" style={{ fontSize: 14 }}>{title}</Typography>}
                            // secondary={<Typography type="body2" style={{ fontSize: 12 }}>{props.video.VID}</Typography>}
                        />
                    </Grid>
                    <Grid item className='buttonRow'>
                        <IconButton className='itemButton' onClick={() => props.delete(props.video.VID)}>
                            <DeleteForeverIcon/>
                        </IconButton>
                        <IconButton className='itemButton' onClick={() => setCurrentVID(props.video.VID)}>
                            <PlayArrowIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </ListItem>
        </Fragment>
    )
}

export default VideoItem

//<Box style={{width: 50, height: 25}}>
//<img src={videoInfo.thumbnail_url}/>
//</Box>
