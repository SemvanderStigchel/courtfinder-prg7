import {NavigationContainer} from "@react-navigation/native";
import Tabs from "./Tabs";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const App = () => {
    // This stores the theme which I pass down through the whole application
    const [darkMode, setDarkMode] = useState(false);

    // This function gets the stored theme and puts it in the useState
    useEffect(() => {
        (async () => {
            try {
                const theme = JSON.parse(await AsyncStorage.getItem('darkMode'));
                if (theme === null) {
                    setDarkMode(false);
                } else {
                    setDarkMode(theme);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    return (
        <NavigationContainer>
            <Tabs theme={{darkMode, setDarkMode}}/>
        </NavigationContainer>
    );
}

export default App;
