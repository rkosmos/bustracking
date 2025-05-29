import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={require("../assets/icon.png")} />
      <Text
        style={{
          fontFamily: "Koulen-Regular",
          fontSize: 30,
          color: "white",
          textAlign: "center",
          marginTop: 0,
        }}
      >
        BUS TRACKING
      </Text>
      <Text
        style={{
          fontFamily: "Raleway-Regular",
          textAlign: "center",
          fontSize: 12,
          color: "white",
          marginTop: 0,
        }}
      >
        Are you a customer or operator?
      </Text>
      <TouchableOpacity
        style={styles.orangeButton}
        onPress={() => navigation.navigate("CustomerArrival")}
      >
        <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
          Customer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.redButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
          Operator
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1731",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 200,
    height: 200,
  },
  orangeButton: {
    backgroundColor: "#E4A648",
    width: 100,
    padding: 10,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  redButton: {
    backgroundColor: "#C64040",
    width: 100,
    padding: 10,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
});
