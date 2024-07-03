import {StatusBar} from 'expo-status-bar';
import {Alert, Button, FlatList, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons'

const List = ({navigation, theme}) => {
    const [clubData, setClubData] = useState([]);

    // This function fetches the data from the webservice
    useEffect(() => {
        (async () => {
            try {
                console.log(`Hier komt het wel`);
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
            console.log(`fetch werkt niet`);
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

    // This maps all the clubs, so it can be shown in a list
    const showClubs = clubData.map(({id, title, description, latitude, longitude}, index) =>
        <Pressable key={index} onPress={() => navigation.navigate('Details', {
            id: id,
            title: title,
            description: description,
            latitude: latitude,
            longitude: longitude
        })}>
            <View style={styles.list}>
                <Text style={[theme.darkMode === false ? styles.darkText : styles.lightText, styles.listText]}>{title}</Text>
                <Ionicons name={'arrow-forward'} size={20} color={theme.darkMode === false ? 'black' : 'white'}/>
            </View>
        </Pressable>);

    return (
        <SafeAreaView style={theme.darkMode === false ? styles.containerLight : styles.containerDark}>
            <ScrollView>
                <Pressable style={styles.ratingButton} onPress={() => navigation.navigate('Ratings', clubData)}>
                    <Text style={{fontSize: 25, color: 'white'}}>Your ratings</Text>
                    <Ionicons name={'arrow-forward'} size={20} color={'white'}/>
                </Pressable>
                {showClubs}
            </ScrollView>
            <StatusBar style="auto"/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
        paddingHorizontal: 10
    },
    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#333232",
        paddingBottom: 60
    },
    lightText: {
        color: 'white',
    },
    darkText: {
        color: "black",
    },
    list: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f27e02',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10
    },
    listText: {
        fontSize: 20,
    },
    ratingButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f27e02',
        paddingVertical: 10,
        paddingHorizontal: 80,
        marginTop: 20,
    }
});

export default List;
