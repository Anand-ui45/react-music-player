import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";

import { AudioProvider } from "./app/Context/AudioProvider";
import color from "./app/misc/color";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

export default function App() {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
    // </GestureHandlerRootView>
  );
}
