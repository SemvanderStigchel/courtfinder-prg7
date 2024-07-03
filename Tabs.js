import Ionicons from '@expo/vector-icons/Ionicons'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ListStackScreen from "./ListStackScreen";
import HomeStackScreen from "./HomeStackScreen";
import Settings from "./Settings";

const Tab = createBottomTabNavigator();
const Tabs = ({theme}) => {
    // This sets the background color for the tab bar
    const bgColor = theme.darkMode === true ? '#212121' : '#ffffff';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'List') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#f27e02',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    height: 60,
                    paddingHorizontal: 5,
                    paddingTop: 0,
                    backgroundColor: bgColor,
                    position: 'absolute',
                    borderTopWidth: 0,
                }
            })}
        >
            <Tab.Screen options={{headerShown: false}} name={"Home"}>
                {(props) => <HomeStackScreen {...props} theme={theme}/>}
            </Tab.Screen>
            <Tab.Screen options={{headerShown: false}} name={"List"}>
                {(props) => <ListStackScreen {...props} theme={theme}/>}
            </Tab.Screen>
            <Tab.Screen options={{headerShown: false}} name={"Settings"}>
                {(props) => <Settings {...props} theme={theme}/>}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default Tabs;
