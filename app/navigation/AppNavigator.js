import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createStackNavigator } from "@react-navigation/stack";
import PlayListDetails from "../screens/PlayListDetails";
import color from "../misc/color";
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayList" component={PlayList} />
      <Stack.Screen
        name="PlayListDetails"
        component={PlayListDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
function AppNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="headset"
              size={20}
              color={focused ? color.ACTIVE_BG : color.FONT_LIGHT}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="compact-disc"
              size={20}
              color={focused ? color.ACTIVE_BG : color.FONT_LIGHT}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PlayLists"
        component={PlayListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="library-music"
              size={20}
              color={focused ? color.ACTIVE_BG : color.FONT_LIGHT}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;
