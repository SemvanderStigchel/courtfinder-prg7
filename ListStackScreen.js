import {createNativeStackNavigator} from "@react-navigation/native-stack";
import List from "./List";
import Details from "./Details";
import Ratings from "./Ratings";

const ListStack = createNativeStackNavigator();

const ListStackScreen = ({theme}) => {
    // Sets the background color for the header
    const bgColor = theme.darkMode === true ? '#212121' : '#ffffff';

    return (
        <ListStack.Navigator>
            <ListStack.Screen options={{headerShown: false}} name={"ListScreen"}>
                {(props) => <List {...props} theme={theme}/>}
            </ListStack.Screen>
            <ListStack.Screen options={{headerStyle: {
                    backgroundColor: bgColor,
                }, headerTintColor: theme.darkMode === false ? '#000000' : '#ffffff'}} name={"Details"}>
                {(props) => <Details {...props} theme={theme}/>}
            </ListStack.Screen>
            <ListStack.Screen options={{headerStyle: {
                    backgroundColor: bgColor,
                }, headerTintColor: theme.darkMode === false ? '#000000' : '#ffffff'}} name={"Ratings"}>
                {(props) => <Ratings {...props} theme={theme}/>}
            </ListStack.Screen>
        </ListStack.Navigator>
    );
}

export default ListStackScreen;
