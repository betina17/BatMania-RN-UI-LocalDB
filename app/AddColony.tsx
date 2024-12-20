import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native"; // Import Text
import { openDatabase, addColony } from "../database/database";
import { SQLiteDatabase } from "expo-sqlite";
import * as Location from "expo-location";

export default function AddColony({
  onColonyAdded,
}: {
  onColonyAdded: () => void;
}) {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // To handle errors

  const initializeDb = async () => {
    const database = await openDatabase();
    setDb(database);
  };

  const handleAddColony = async () => {
    if (db && description && latitude && longitude) {
      const time = new Date().toString();
      await addColony(
        db,
        time,
        parseFloat(latitude),
        parseFloat(longitude),
        description
      );
      onColonyAdded();
      setDescription("");
      setLatitude("");
      setLongitude("");
    }
  };

  // Request location permission and get the current position
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); // Request permission
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      // Get the current location
      const { coords } = await Location.getCurrentPositionAsync({});
      setLatitude(parseFloat(coords.latitude.toString()).toFixed(5));
      setLongitude(parseFloat(coords.longitude.toString()).toFixed(5));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg("Error getting location: " + error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    initializeDb();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Description"
        placeholderTextColor={"#999999"}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Latitude"
        placeholderTextColor={"#999999"}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Longitude"
        placeholderTextColor={"#999999"}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Get Current Location" onPress={getLocation} />
      {/* Show error message in a Text component */}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <Button title="Add Colony" onPress={handleAddColony} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});
