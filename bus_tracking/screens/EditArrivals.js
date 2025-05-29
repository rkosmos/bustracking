import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDoc, collection } from "@firebase/firestore";
import { firestoreDB } from "../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function EditArrivalsScreen() {
  const navigation = useNavigation();
  const { id } = useRoute().params;
  const [plateNumber, setPlateNumber] = useState("");
  const [arrivedFrom, setArrivedFrom] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      console.info("getting", id);
      const document = (
        await getDoc(doc(firestoreDB, "bus_arrivals", id))
      ).data();

      setArrivedFrom(document["arrivedFrom"]);
      const date = document["dateTimeArrived"].toDate();
      setDate(date);
      setTime(date);
      setPlateNumber(document["plateNo"]);

      console.info(document);
    })();
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
          EDIT ARRIVALS
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
          style={[styles.textBox, { paddingHorizontal: 0 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: "grey",
              fontFamily: "Alatsi-Regular",
            }}
          >
            {date ? date.toDateString() : "Enter Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
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
            if (!arrivedFrom || !date || !time) {
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

            // Perform the insert operation here
            updateDoc(doc(firestoreDB, "bus_arrivals", id), {
              arrivedFrom: arrivedFrom,
              plateNo: plateNumber,
              dateTimeArrived: dateTimeArrived,
            }).then(() => {
              navigation.navigate("ArrivalsData");
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
  subheader: {
    flexDirection: "row",
    height: 25,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
  subheader_text: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#3E3939",
  },
  entryContainer: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
    marginTop: 10,
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
    fontFamily: "Alatsi-Regular",
  },
  orangeButton: {
    backgroundColor: "#FF9900",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 220,
    marginTop: 20,
  },
});
