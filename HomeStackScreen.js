import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Details from "./Details";
import Home from "./Home";
import List from "./List";

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = ({theme}) => {
    // Sets the background color for the header
    const bgColor = theme.darkMode === true ? '#212121' : '#ffffff';

    return (
        <HomeStack.Navigator>
            <HomeStack.Screen options={{headerShown: false}} name={"HomeScreen"}>
                {(props) => <Home {...props} theme={theme}/>}
            </HomeStack.Screen>
            <HomeStack.Screen options={{headerStyle: {
                    backgroundColor: bgColor,
                }, headerTintColor: theme.darkMode === false ? '#000000' : '#ffffff'}} name={"Details"}>
                {(props) => <Details {...props} theme={theme}/>}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;
