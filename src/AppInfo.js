import React, { Fragment, useState } from 'react'
import { Typography, MenuItem, Box, Dialog, DialogTitle, 
         DialogContent, DialogActions, Grid, Button, Link  
} from '@mui/material'
import githubIcon from './GitHub_Logo_White.png'
import InfoIcon from '@mui/icons-material/Info';

const AppInfo = (props) => {
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            props.close()
        }
    }
  
    return (
        <Dialog
            maxWidth="md"
            open={props.open}
            disable
        >
            <DialogTitle style={{paddingBottom: 0}}>
                <Box sx={{marginRight: '10px', display: 'inline'}}>
                    <InfoIcon/>
                </Box>About
            </DialogTitle>
            <DialogContent dividers>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h7'>This is the content for . </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Link target='_blank' underline="none" href='https://github.com/MiniCoop8/YTLooper'>
                            <img src={githubIcon} style={{width: '50px'}} />
                        </Link>     
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
export default AppInfo