import React, { createContext, useState, useMemo } from 'react';

export const PlayerContext = createContext({
    player: null,
    currentVID: {
        VID: null,
        Title: '',
        loops: []
    },
    setPlayer: () => {}
});

const AppProvider = (props) => {
    const [player, setPlayer] = useState();
    const [currentVID, setCurrentVID] = useState()

    const providerValue = useMemo(() => ({
        player, setPlayer, currentVID, setCurrentVID
    }), [player, currentVID]);

    return(
        <PlayerContext.Provider value={providerValue}>
            {props.children}
        </PlayerContext.Provider>
    );
}
export default AppProvider
