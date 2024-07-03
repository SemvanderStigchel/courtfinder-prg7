import {Alert, Button, Pressable, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import mapDark from './map-styles/mapDark.json'
import mapLight from './map-styles/mapLight.json'
import {log} from "expo/build/devtools/logger";

const Home = ({navigation, route, theme}) => {
    const [clubData, setClubData] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    // This sets the map style according to the theme
    const mapStyle = theme.darkMode === false ? mapLight : mapDark;

    // This requests access to the users location and then watches it
    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.watchPositionAsync(
                {accuracy: Location.Accuracy.Highest, distanceInterval: 10},
                (location) => setLocation(location.coords));
        })();
    }, []);

    // This function fetches the data from the webservice
    useEffect(() => {
        (async () => {
            try {
                const answer = await fetch('https://stud.hosted.hr.nl/1058693/tennisclubs-webservice.json?', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                const data = await answer.json();
                setClubData(data);
                await setStorage();
            } catch (e) {
                console.log(e);
                await getStorage();
            }
        })();
    }, []);

    // If the fetch call succeeded, this function puts the data in Asyncstorage
    const setStorage = async () => {
        try {
            await AsyncStorage.setItem('clubData', JSON.stringify(clubData));
        } catch (e) {
            console.log(e);
        }
    }

    // If the fetch call was not successful, this function gets the data from the Asyncstorage
    const getStorage = async () => {
        try {
            const asyncStorageData = JSON.parse(await AsyncStorage.getItem('clubData'));
            if (asyncStorageData !== null) {
                setClubData(asyncStorageData);
            } else {
                setClubData([]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // This maps all the clubs to markers with the correct latitude and longitude
    const showMarkers = clubData.map(({id, title, description, latitude, longitude}, index) =>
        <Marker key={index} onPress={() => navigation.navigate('Details', {
            id: id,
            title: title,
            description: description,
            latitude: latitude,
            longitude: longitude
        })} coordinate={{latitude: latitude, longitude: longitude}} title={title}/>
    );

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={{
                latitude: 51.92608100515504,
                longitude: 4.506825717373305,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
            }} customMapStyle={mapStyle}>
                {showMarkers}
                {/*This places the user marker on the user location*/}
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Your Location"
                        pinColor={'navy'}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
});

export default Home;
