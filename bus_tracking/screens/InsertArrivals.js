import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { firestoreDB } from "../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function InsertArrivalsScreen() {
  const navigation = useNavigation();
  const [arrivedFrom, setArrivedFrom] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
        <Text style={styles.header_text}>INSERT ARRIVALS</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.textBox}
          value={plateNumber}
          placeholder="Enter Plate No."
          onChange={(ev) => setPlateNumber(ev.nativeEvent.text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={arrivedFrom}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setArrivedFrom(itemValue)}
          >
            <Picker.Item
              label="Select Arrival Place"
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
          style={styles.textBox}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.placeholder_text}>
            {date ? date.toDateString() : "Enter Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity
          style={styles.textBox}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.placeholder_text}>
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
            if (!arrivedFrom || !date || !time || !plateNumber) {
              alert("Please fill out all fields");
              return;
            }

            // Combine date and time into dateTimeArrived
            const dateTimeArrived = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes()
            );

            addDoc(collection(firestoreDB, "bus_arrivals"), {
              arrivedFrom: arrivedFrom,
              plateNo: plateNumber,
              dateTimeArrived: dateTimeArrived,
            }).then(() => {
              navigation.navigate("ArrivalsData");
            });
          }}
        >
          <Text style={styles.button_text}>Insert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.orangeButton, { backgroundColor: "#6B77DD" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.button_text}>Back</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0B1731",
  },
  header: {
    backgroundColor: "#302B2B",
    height: 100,
    justifyContent: "flex-end",
    padding: 10,
  },
  header_text: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 20,
    color: "white",
    marginTop: 0,
    marginLeft: 10,
    letterSpacing: 3,
  },
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    paddingLeft: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
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
  button_text: {
    color: "white",
    fontFamily: "Alatsi-Regular",
  },
  placeholder_text: {
    color: "grey",
    fontFamily: "Alatsi-Regular",
  },
});
