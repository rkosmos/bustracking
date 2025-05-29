import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigation.navigate("ArrivalsData");
  //     }
  //   });
  //   return unsubscribe;
  // }, []);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email";
      case "auth/user-disabled":
        return "User account is disabled";
      case "auth/user-not-found":
        return "User not found";
      case "auth/invalid-credential":
        return "Incorrect password";
      default:
        return "Sign in failed";
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, username, password);
      alert("Sign in successful.");
      navigation.navigate("ArrivalsData");
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

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
        LOGIN
      </Text>
      <TextInput
        value={username}
        style={styles.textBox}
        placeholder="Email Address"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        value={password}
        style={styles.textBox}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.orangeButton} onPress={signIn}>
        <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
          Login
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171719",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 200,
    height: 200,
    borderRadius: 40,
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
  textBox: {
    height: 40,
    backgroundColor: "#D9D9D9",
    width: 200,
    borderRadius: 20,
    fontFamily: "Alatsi-Regular",
    padding: 10,
    marginTop: 20,
    textAlign: "center",
  },
});
