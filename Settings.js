import {Switch, Text, View} from "react-native";
import {StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";


const Settings = ({navigation, theme}) => {

    // When the darkMode useState changes, this function saves darkMode in AsyncStorage
    useEffect(() => {
        (async () => {
            console.log(theme.darkMode);
            try {
                await AsyncStorage.setItem('darkMode', JSON.stringify(theme.darkMode));
            } catch (e) {
                console.log(e);
            }
        })()
    }, [theme.darkMode]);

    // This function handles the Switch, it sets the darkMode to the opposite
    const toggleSwitch = async () => {
        theme.setDarkMode(prevState => !prevState);
    };

    return (
        <View style={theme.darkMode === false ? styles.containerLight : styles.containerDark}>
            <Text style={theme.darkMode === false ? styles.darkText : styles.lightText}>Dark mode:</Text>
            <Switch
                trackColor={{false: '#767577', true: '#faa74d'}}
                thumbColor={theme.darkMode ? '#f27e02' : '#d6d6d6'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={theme.darkMode}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#333232"
    },
    lightText: {
        color: 'white',
    },
    darkText: {
        color: "black",
    }
});

export default Settings;
