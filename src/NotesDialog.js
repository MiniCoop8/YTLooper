import React, {Fragment, useState, useEffect,useContext} from "react";
import { Grid, Box } from '@mui/material'
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import TextField from '@mui/material/TextField'
import { PlayerContext } from "./PlayerProvider";
import { useAlert } from 'react-alert'
import { useLocalStorage } from 'usehooks-ts';
import produce from 'immer'

const NotesDialog = (props) => {
    const alert = useAlert()

    const { currentVID, setCurrentVID } = useContext(PlayerContext);
    const [note, setNote] = useState('')
    const [videoData, setVideoData] = useLocalStorage('YTLooper.videoData', {videos: []})


    useEffect(() => {
        setNote((currentVID && currentVID.Notes)? currentVID.Notes ?? '': '')
    }, [props.open])

    const handleCancel = () => {
        props.close();
    };

    const handleOk = () => {
        // setCurrentVID({...currentVID, Notes: note} )
        saveVideo()
        props.close()
    };

    const saveVideo = () => {
        const newVideoData = produce(videoData, draftVideoData => {
            var foundVideo = videoData.videos.filter(v => {
                return v.VID == currentVID.VID
            })[0]
            var videoList = videoData.videos.filter(v => {
                return v.VID != currentVID.VID
            })

            if (foundVideo) {
                foundVideo = {...foundVideo, Notes: note}
                currentVID.Notes = note
            }

            videoList.push(foundVideo)

            draftVideoData.videos = videoList
        })

        setVideoData(newVideoData)

        alert.success('Notes Saved!')
    }


    return (
        <Dialog
            maxWidth="lg"
            open={props.open}
        >
            <DialogTitle style={{paddingBottom: 0}}>
                <Grid container>
                    <Grid item xs={2}>
                        <Box sx={{borderRight: '1px solid #000'}}>
                            Add Notes
                        </Box>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent dividers sx={{paddingTop: '10px'}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '600px'
                        }}>
                            <TextField 
                                onChange={(e) => setNote(e.target.value)} 
                                value={note} 
                                multiline rows={10} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotesDialog