import React, {Fragment, useState, useEffect,useContext} from "react";
import { Grid, Link, Box } from '@mui/material'
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField'
import useVideoData from './useVideoData'
import { PlayerContext } from "./PlayerProvider";
import Iframe from 'react-iframe'
import { defaultLoop } from "./functions";

const parse = require('url-parse')



const PreviewVideoDialog = (props) => {
    const [error, setError] = useState(null)
    const { setCurrentVID } = useContext(PlayerContext);
    const [vid, setVID] = useState(null)
    const vidData = useVideoData('vidPreview', vid)
    const [ytData, setYtData] = useState({title: '', author_name: '', author_url: ''})
    const [url, setURL] = useState()

    useEffect(() => {
        setYtData(null)
        setVID(null)
    }, [props.open])

    useEffect(() => {
        if (!vidData.isLoading && vidData.isFetched) {
            if (vidData.data) {
                setYtData(vidData.data)
            }
        }
    }, [vidData.isLoading, vidData.isFetched] )

    const parseValue = (value) => {
        var _url = parse(value, true);
        setURL(_url)

        var v = ''
        if (value.toLowerCase().indexOf('http') > -1) {
            v = _url.query.v
        }
        else {
            v = value
        }

        if (v.match(/^[0-9a-zA-Z_-]{11}$/)) {
            setError(null)
            setVID(v)
        }
        else if (v == null || v == "") {
            setError(null)
        }
        else {
            setError('Invalid Video ID')
        }
    }

    const handleCancel = () => {
        props.close();
    };

    const handleOk = () => {
        setCurrentVID({...defaultLoop, VID: vid, Title: ytData.title} )
        props.close()
    };

    return (
        <Dialog
            maxWidth="lg"
            open={props.open}
        >
            <DialogTitle style={{paddingBottom: 0}}>
                <Grid container>
                    <Grid item xs={2}>
                        <Box sx={{borderRight: '1px solid #000'}}>
                            Add Video
                        </Box>
                    </Grid>
                    <Grid item xs={10}>
                        <Box sx={{marginLeft: '20px'}}>
                            {(ytData && ytData.title)}
                        </Box>
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={10}>
                        <Box sx={{fontSize: '14px', marginLeft: '40px'}}>
                            <Link target='_blank' underline="none" href={(ytData && ytData.author_url)}>{(ytData && ytData.author_name)}</Link>     
                        </Box>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent dividers sx={{paddingTop: '10px'}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{width: '100%', paddingBottom: '10px'}}>
                            <TextField 
                                sx={{width: '100%'}}
                                variant='outlined'
                                label="Video ID or URL" 
                                helperText={error}
                                onChange={evt => parseValue(evt.target.value)}
                                setError={error != null}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '600px'
                        }}>
                            <Iframe url={("https://www.youtube.com/embed/" + vid)}
                                width="600px"
                                height="400px"
                                id="myId"
                                className="myClassname"
                                display="initial"
                                position="relative"/>
                            </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PreviewVideoDialog