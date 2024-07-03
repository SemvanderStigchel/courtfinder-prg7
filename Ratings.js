import {FlatList, Pressable, ScrollView, Switch, Text, View} from "react-native";
import {StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";


const Ratings = ({navigation, theme, route}) => {
    const [clubData, setClubData] = useState(route.params);
    const [ratings, setRatings] = useState([]);

    // This function gets the ratings from Asyncstorage and puts them in the useState
    useEffect(() => {
        (async () => {
            try {
                let ratingData = JSON.parse(await AsyncStorage.getItem('ratings'));
                if (ratingData !== null) {
                    setRatings(ratingData);
                } else {
                    console.log(`RatingData leeg`);
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, []);

    // This maps all the rated clubs
    const showRatings = ratings.map(({id, title, rating}, index) =>
        <View key={index} style={styles.listItem}>
            <Text style={[styles.lightText, {fontSize: 25}]}>{title}</Text>
            <Text style={[styles.lightText, {fontSize: 20}]}>Rating: {rating}</Text>
            <Pressable style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                const clubIndex = clubData.findIndex(item => item.id === id);

                navigation.navigate('Details', {
                    id: clubData[clubIndex].id,
                    title: clubData[clubIndex].title,
                    description: clubData[clubIndex].description,
                    latitude: clubData[clubIndex].latitude,
                    longitude: clubData[clubIndex].longitude
                })
            }}>
                <Text style={[styles.lightText, {fontSize: 20}]}>Details</Text>
                <Ionicons name={'arrow-forward'} size={20} color={'white'}/>
            </Pressable>
        </View>
    );

    return (
        <ScrollView>
            <View style={theme.darkMode === false ? styles.containerLight : styles.containerDark}>
                {showRatings}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 60
    },
    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#333232",
        paddingTop: 20
    },
    lightText: {
        color: 'white',
    },
    darkText: {
        color: "black",
    },
    listItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#f27e02',
        marginBottom: 20,
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '95%',
    },
});

export default Ratings;
