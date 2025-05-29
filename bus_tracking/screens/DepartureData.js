import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { firestoreDB } from "../FirebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Function to perform Boyer-Moore string search
function boyerMooreSearch(text, pattern) {
  const patternLength = pattern.length;
  const textLength = text.length;
  if (patternLength === 0) return 0;

  // Create the bad character skip table
  const skip = {};
  for (let i = 0; i < patternLength - 1; i++) {
    skip[pattern[i]] = patternLength - i - 1;
  }

  let i = patternLength - 1;
  while (i < textLength) {
    let match = true;
    for (let j = patternLength - 1; j >= 0; j--) {
      if (text[i - (patternLength - 1 - j)] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) return i - (patternLength - 1);
    const skipValue = skip[text[i]];
    i += skipValue || patternLength;
  }
  return -1;
}

export default function DepartureDataScreen() {
  // const [busDepartures, setBusDepartures] = useState([]);
  // const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
  // const navigation = useNavigation();

  // const fetchBusDepartures = async () => {
  //   try {
  //     const querySnapshot = await getDocs(
  //       collection(firestoreDB, "bus_departures")
  //     );
  //     const departures = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // Bucket sort logic
  //     const bucketSortByDate = (departures) => {
  //       const groupedByDate = {};

  //       // Group departures by date
  //       departures.forEach((departure) => {
  //         const date = new Date(
  //           departure.dateTimeDepart.seconds * 1000
  //         ).toLocaleDateString();
  //         if (!groupedByDate[date]) {
  //           groupedByDate[date] = [];
  //         }
  //         groupedByDate[date].push(departure);
  //       });

  //       // Collect sorted departures by date
  //       const sortedDepartures = [];
  //       Object.keys(groupedByDate)
  //         .sort()
  //         .forEach((date) => {
  //           sortedDepartures.push(...groupedByDate[date]);
  //         });

  //       return sortedDepartures;
  //     };

  //     const sortedDepartures = bucketSortByDate(departures);
  //     setBusDepartures(sortedDepartures);
  //   } catch (error) {
  //     console.error("Error fetching bus departures: ", error);
  //   }
  // };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     fetchBusDepartures();
  //   });
  const [busDepartures, setBusDepartures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  // Function to fetch bus arrivals from Firestore
  const fetchBusDepartures = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(firestoreDB, "bus_departures")
      );
      const departures = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort arrivals by dateTimeArrived (assuming it's a timestamp)
      departures.sort((a, b) => {
        const dateA = new Date(a.dateTimeDepart.seconds * 1000);
        const dateB = new Date(b.dateTimeDepart.seconds * 1000);

        // Compare dates first
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // If dates are the same, compare times
        if (dateA.getTime() === dateB.getTime()) {
          const timeA = dateA.getTime();
          const timeB = dateB.getTime();
          if (timeA > timeB) return -1;
          if (timeA < timeB) return 1;
        }

        return 0;
      });

      setBusDepartures(departures);
    } catch (error) {
      console.error("Error fetching bus arrivals: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBusDepartures();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (departureId) => {
    Alert.alert(
      "Delete Entry",
      "Do you want to continue to DELETE it?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestoreDB, "bus_departures", departureId));
              setBusDepartures((prevDepartures) =>
                prevDepartures.filter(
                  (departure) => departure.id !== departureId
                )
              );
            } catch (error) {
              console.error("Error deleting document: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSearch = () => {
    const filteredDepartures = busDepartures.filter(
      (departure) =>
        boyerMooreSearch(
          departure.plateNo.toLowerCase(),
          searchQuery.toLowerCase()
        ) !== -1
    );
    return filteredDepartures;
  };

  const groupDeparturesByDate = (departures) => {
    return departures.reduce((acc, departure) => {
      const date = new Date(
        departure.dateTimeDepart.seconds * 1000
      ).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(departure);
      return acc;
    }, {});
  };

  const departuresToDisplay = searchQuery ? handleSearch() : busDepartures;
  const groupedDepartures = groupDeparturesByDate(departuresToDisplay);

  return (
    <View style={styles.main_container}>
      <View style={styles.header}>
        <View style={styles.headersub}>
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: 20,
              color: "white",
              marginTop: 0,
            }}
          >
            DEPARTURES DATA
          </Text>
          <TouchableOpacity
            style={styles.orangeButton}
            onPress={() => navigation.navigate("InsertDepartures")}
          >
            <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
              Insert
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headersub}>
          <TextInput
            style={styles.textBox}
            placeholder="Search Plate Number"
            value={searchQuery} // Bind value to searchQuery state
            onChangeText={(text) => setSearchQuery(text)} // Update searchQuery state on text change
          ></TextInput>
          <TouchableOpacity
            style={[
              styles.orangeButton,
              { backgroundColor: "#E27756", marginTop: 7 },
            ]}
            onPress={() => {
              // Force re-render to apply search filter
              setSearchQuery(searchQuery);
            }}
          >
            <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.subheader}>
        <Text style={styles.subheader_text}>BUS</Text>
        <Text style={styles.subheader_text}>DEPARTED</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(groupedDepartures).map((date) => (
          <View key={date} style={[styles.container, { flex: 0 }]}>
            <View style={styles.dateIndicator}>
              <Text style={[styles.subheader_text, { color: "white" }]}>
                {date}
              </Text>
            </View>
            {groupedDepartures[date].map((departure) => (
              <View key={departure.id} style={styles.entryContainer}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      color: "#3E3939",
                    }}
                  >
                    {departure.plateNo}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: "#3E3939",
                      fontSize: 10,
                    }}
                  >
                    TO {departure.departTo}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: "#3E3939",
                      fontSize: 12,
                      textAlign: "right",
                    }}
                  >
                    {new Date(
                      departure.dateTimeDepart.seconds * 1000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditDepartures", {
                        id: departure.id,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#3E3939",
                        fontSize: 12,
                        textAlign: "right",
                      }}
                    >
                      EDIT
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(departure.id)}>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#7B3232",
                        fontSize: 12,
                        textAlign: "right",
                      }}
                    >
                      DELETE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
        <StatusBar style="auto" />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerEntry}
          onPress={() => navigation.navigate("ArrivalsData")}
        >
          <Ionicons
            name="bus"
            size={32}
            color="black"
            style={{ marginLeft: 10 }}
          />
          <Text
            style={{
              fontFamily: "Montserrat-Medium",
              fontSize: 12,
              marginTop: 0,
              marginLeft: 10,
              color: "black",
            }}
          >
            Arrivals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerEntry}>
          <Ionicons
            name="bus-outline"
            size={32}
            color="#E4A648"
            style={{ marginLeft: 10 }}
          />
          <Text
            style={{
              fontFamily: "Montserrat-Medium",
              fontSize: 12,
              marginTop: 0,
              marginLeft: 10,
              color: "#E4A648",
            }}
          >
            Departures
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#302B2B",
    height: 125,
    padding: 10,
    flexDirection: "column",
    paddingTop: 50,
  },
  headersub: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  main_container: {
    flex: 1,
    backgroundColor: "#0B1731",
  },
  subheader: {
    flexDirection: "row",
    height: 25,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
  },
  subheader_text: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#3E3939",
    flex: 1,
  },
  entryContainer: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  footer: {
    backgroundColor: "#D9D9D9",
    height: 70,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  footerEntry: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orangeButton: {
    backgroundColor: "#E4A648",
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  textBox: {
    height: 30,
    backgroundColor: "#D9D9D9",
    width: 220,
    borderRadius: 10,
    fontFamily: "Alatsi-Regular",
    marginTop: 5,
    textAlign: "center",
  },
  dateIndicator: {
    flexDirection: "row",
    backgroundColor: "#554F4F",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 20,
    height: 30,
    marginBottom: 0,
  },
});
