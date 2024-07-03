import {
    Alert,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import MapView, {Marker} from "react-native-maps";
import mapDark from './map-styles/mapDark.json'
import mapLight from './map-styles/mapLight.json'
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Details = ({navigation, route, theme}) => {
    // This gets all the props from the route
    const {id, title, description, latitude, longitude} = route.params;
    // This sets the map style according to the theme
    const mapStyle = theme.darkMode === false ? mapLight : mapDark;
    const [ratings, setRatings] = useState([]);
    const [rating, setRating] = useState('');
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    // This gets the ratings from Asyncstorage and puts them in the useState
    useEffect(() => {
        (async () => {
            let ratingData = JSON.parse(await AsyncStorage.getItem('ratings'));
            if (ratingData !== null) {
                setRatings(ratingData);
                const thisItem = ratingData.find(item => item.id === id);
                if (thisItem !== undefined) {
                    setRating(thisItem.rating);
                }
            } else {
                console.log(`RatingData leeg`);
            }
        })()
    }, []);

    // When ratings gets changed, it saves the ratings to Asyncstorage
    useEffect(() => {
        (async () => {
            if (ratings !== []) {
                await saveRating()
            }
        })()
    }, [ratings]);

    // This lets the app know if the keyboard is shown or not
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // This adds a new rating to the ratings array
    const addRating = () => {
        if (rating === '') {
            Alert.alert(`No rating`, `Your rating input came back empty.`);
            return
        }
        const clubRating = ratings.find(item => item.id === id);
        if (clubRating === undefined) {
            setRatings([...ratings, {
                "id": id,
                "title": title,
                "rating": rating
            }]);
            Alert.alert(`Rating saved`, `Your rating has been saved, you can look at all your ratings at the ratings page.`);
        } else {
            changeRating();
        }
    }

    // This changes the rating of an already existing rating
    const changeRating = () => {
        const ratingIndex = ratings.findIndex(item => item.id === id);
        let newRating = [...ratings];
        newRating[ratingIndex] = {
            "id": id,
            "title": title,
            "rating": rating
        }
        setRatings(newRating);
        Alert.alert(`Rating saved`, `Your rating has been saved, you can look at all your ratings at the ratings page.`);
    }

    // This saves the ratings array to Asyncstorage
    const saveRating = async () => {
        try {
            console.log(`Saving ratings`);
            console.log(ratings);
            await AsyncStorage.setItem('ratings', JSON.stringify(ratings));
        } catch (e) {
            console.log(e);
            Alert.alert(`Error`, `An error has occurred`);
        }
    }

    // This removes an existing rating
    const removeRating = () => {
        const ratingIndex = ratings.findIndex(item => item.id === id);
        let newRatingArray = [...ratings];
        newRatingArray.splice(ratingIndex, 1);
        console.log(newRatingArray);
        setRatings(newRatingArray);
        Alert.alert(`Rating removed`, `Your rating for this club has been removed.`);
    }

    return (
        <View style={theme.darkMode === false ? styles.containerLight : styles.containerDark}>
                <KeyboardAvoidingView behavior={"height"} style={styles.information}>
                    <Text
                        style={[styles.title, theme.darkMode === false ? styles.darkText : styles.lightText]}>{title}</Text>
                    <Text style={theme.darkMode === false ? styles.darkText : styles.lightText}>{description}</Text>
                    <TextInput
                        onChangeText={setRating}
                        value={rating}
                        placeholder={"0"}
                        keyboardType={"number-pad"}
                        keyboardAppearance={theme.darkMode === false ? 'light' : 'dark'}
                        style={styles.ratingInput}
                        maxLength={2}
                    />
                    <View style={{flexDirection: 'row'}}>
                        <Pressable style={styles.ratingButton} onPress={addRating}>
                            <Text
                                style={styles.lightText}>{ratings.find(item => item.id === id) === undefined ? 'Add rating' : 'Update rating'}</Text>
                        </Pressable>
                        {ratings.find(item => item.id === id) !== undefined ?
                            <Pressable style={styles.ratingButton} onPress={removeRating}>
                                <Text style={styles.lightText}>Remove
                                    rating</Text>
                            </Pressable> : <></>}
                    </View>
                </KeyboardAvoidingView>
                <MapView style={[styles.map, keyboardStatus === true ? {display: 'none'} : {}]} region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }} customMapStyle={mapStyle}>
                    <Marker coordinate={{latitude: latitude, longitude: longitude}}></Marker>
                </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#333232",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    information: {
        width: '100%',
        height: '30%',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '70%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    lightText: {
        color: 'white',
    },
    darkText: {
        color: "black",
    },
    ratingButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f27e02',
        marginRight: 20
    },
    ratingInput: {
        padding: 10,
        backgroundColor: 'white',
        borderStyle: 'solid',
        marginVertical: 10,
        width: '15%',
        borderWidth: 1,
        borderColor: 'black',
    }
});

export default Details;
