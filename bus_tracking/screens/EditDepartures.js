import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { firestoreDB } from "../FirebaseConfig";

export default function EditDeparturesScreen() {
  const navigation = useNavigation();
  const { id } = useRoute().params;
  const [plateNumber, setPlateNumber] = useState("");
  const [departTo, setDepartTo] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchArrivalData = async () => {
      try {
        const documentSnapshot = await getDoc(
          doc(firestoreDB, "bus_departures", id)
        );
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          setDepartTo(data.departTo);
          const departDate = data.dateTimeDepart.toDate();
          setDate(departDate);
          setTime(departDate);
          setPlateNumber(data.plateNo);
        } else {
          console.error("Document not found");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchArrivalData();
  }, []);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate !== undefined) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime !== undefined) {
      setTime(selectedTime);
    }
  };

  const townsInBohol = [
    "Alburquerque",
    "Alicia",
    "Anda",
    "Antequera",
    "Baclayon",
    "Balilihan",
    "Batuan",
    "Bien Unido",
    "Bilar",
    "Buenavista",
    "Calape",
    "Candijay",
    "Carmen",
    "Catigbian",
    "Clarin",
    "Corella",
    "Cortes",
    "Dagohoy",
    "Danao",
    "Dauis",
    "Dimiao",
    "Duero",
    "Garcia Hernandez",
    "Getafe",
    "Guindulman",
    "Inabanga",
    "Jagna",
    "Jetafe",
    "Lila",
    "Loay",
    "Loboc",
    "Loon",
    "Mabini",
    "Maribojoc",
    "Panglao",
    "Pilar",
    "Pres. Carlos P. Garcia",
    "Sagbayan",
    "San Isidro",
    "San Miguel",
    "Sevilla",
    "Sierra Bullones",
    "Sikatuna",
    "Tagbilaran City",
    "Talibon",
    "Trinidad",
    "Tubigon",
    "Ubay",
    "Valencia",
  ];

  return (
    <View style={styles.main_container}>
      <View style={styles.header}>
        <Text
          style={{
            fontFamily: "Montserrat-ExtraBold",
            fontSize: 20,
            color: "white",
            marginTop: 0,
            marginLeft: 10,
            letterSpacing: 3,
          }}
        >
          EDIT DEPARTURES
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.textBox}
          placeholder="Enter Plate No."
          value={plateNumber}
          onChange={(ev) => setPlateNumber(ev.nativeEvent.text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={departTo}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setDepartTo(itemValue)}
          >
            <Picker.Item
              label="Select Departure Place"
              value=""
              color="grey"
              style={{ fontFamily: "Alatsi-Regular" }}
            />
            {townsInBohol.map((town) => (
              <Picker.Item key={town} label={town} value={town} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.textBox, { paddingHorizontal: 0 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: "grey", fontFamily: "Alatsi-Regular" }}>
            {date ? date.toDateString() : "Enter Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity
          style={styles.textBox}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: "grey", fontFamily: "Alatsi-Regular" }}>
            {time
              ? time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Enter Time"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display="default"
            is24Hour={true}
            onChange={onTimeChange}
          />
        )}
        <TouchableOpacity
          style={styles.orangeButton}
          onPress={() => {
            if (!departTo || !date || !time || !plateNumber) {
              alert("Please fill out all fields");
              return;
            }

            // Combine date and time into dateTimeArrived
            const dateTimeDepart = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes()
            );

            updateDoc(doc(firestoreDB, "bus_departures", id), {
              departTo: departTo,
              plateNo: plateNumber,
              dateTimeDepart: dateTimeDepart,
            })
              .then(() => {
                navigation.navigate("DepartureData");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          }}
        >
          <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.orangeButton, { backgroundColor: "#6B77DD" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "white", fontFamily: "Alatsi-Regular" }}>
            Back
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    paddingLeft: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#302B2B",
    height: 100,
    justifyContent: "flex-end",
    padding: 10,
  },
  main_container: {
    flex: 1,
    backgroundColor: "#0B1731",
  },
  textBox: {
    height: 40,
    backgroundColor: "white",
    width: 220,
    borderRadius: 20,
    fontFamily: "Alatsi-Regular",
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  pickerContainer: {
    height: 40,
    backgroundColor: "white",
    width: 220,
    borderRadius: 20,
    marginTop: 10,
    justifyContent: "center",
  },
  picker: {
    height: 40,
    width: 220,
    fontFamily: "Alatsi-Regular",
  },
  orangeButton: {
    backgroundColor: "#E4A648",
    width: 220,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 10,
  },
});
