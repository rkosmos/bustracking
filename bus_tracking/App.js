import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
//SplashScreen.preventAutoHideAsync();

// SCREENS AND NAVIGATION
import { NavigationContainer } from "@react-navigation/native"; // For navigation between screens
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import HomeScreen from "./screens/HomeScreen";
import CustomerArrivalScreen from "./screens/CustomerArrival";
import CustomerDepartureScreen from "./screens/CustomerDeparture";
import LoginScreen from "./screens/LoginScreen";
import ArrivalsDataScreen from "./screens/ArrivalsData";
import DepartureDataScreen from "./screens/DepartureData";
import InsertArrivalsScreen from "./screens/InsertArrivals";
import InsertDeparturesScreen from "./screens/InsertDepartures";
import EditArrivalsScreen from "./screens/EditArrivals";
import EditDeparturesScreen from "./screens/EditDepartures";
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Alatsi-Regular": require("./assets/fonts/Alatsi-Regular.ttf"),
    "Koulen-Regular": require("./assets/fonts/Koulen-Regular.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("./assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Raleway-Regular": require("./assets/fonts/Raleway-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen
          name="CustomerArrival"
          component={CustomerArrivalScreen}
        />
        <Stack.Screen
          name="CustomerDeparture"
          component={CustomerDepartureScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ArrivalsData" component={ArrivalsDataScreen} />
        <Stack.Screen name="DepartureData" component={DepartureDataScreen} />
        <Stack.Screen name="InsertArrivals" component={InsertArrivalsScreen} />
        <Stack.Screen
          name="InsertDepartures"
          component={InsertDeparturesScreen}
        />
        <Stack.Screen name="EditDepartures" component={EditDeparturesScreen} />
        <Stack.Screen name="EditArrivals" component={EditArrivalsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
