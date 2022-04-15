import './App.css';
import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, IconButton, Box } from '@mui/material'

import Player from './Player'
import TopNav from './TopNav'
import AppProvider from './PlayerProvider';


function App() {
    useEffect(() => {
        document.title = 'YT Looper'
    }, [])

    return (
        <div className="App">
            <AppProvider> 
                <header>
                    <Grid container className='mainContainer'>
                        <Grid item xs={12}>
                            <TopNav/>
                        </Grid>
                        <Grid item xs={12}>
                            <Player/>
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
