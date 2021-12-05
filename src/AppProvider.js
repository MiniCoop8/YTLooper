import { createContext, useState, useMemo } from 'react';

export const AppContext = createContext({
    player: null,
    currentVID: null,
    setPlayer: () => {}
});

const AppProvider = (props) => {
    const [player, setPlayer] = useState();
    const [currentVID, setCurrentVID] = useState()

    const providerValue = useMemo(() => ({
        player, setPlayer, currentVID, setCurrentVID
    }), [player, currentVID]);

    return(
        <AppContext.Provider value={providerValue}>
            {props.children}
        </AppContext.Provider>
    );
}
export default AppProvider
