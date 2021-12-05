import './App.css';
import { useEffect, useState } from 'react';
import { Grid, TextField, Button, IconButton, Box } from '@mui/material'

import Player from './Player'
import VideoList from './VideoList'
import AppProvider from './AppProvider';


function App() {
    const [currentVID, setCurrentVID] = useState()
    useEffect(() => {
        document.title = 'YTLooper'
    }, [])

    return (
        <div className="App">
            <AppProvider> 
                <header>
                    <Grid container className='mainContainer'>
                        <Grid item className='sideBar'>
                            <VideoList setVID={setCurrentVID}/>
                        </Grid>
                        <Grid item>
                            <Player VID={currentVID}/>
                        </Grid>
                        {/* { error && 
                            <Grid item sm={12}>
                                <span className='error'>{error}</span>
                            </Grid>
                        } */}
                    </Grid>
                </header>
            </AppProvider>
        </div>
    );
}

export default App;
