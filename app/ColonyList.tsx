import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  openDatabase,
  getColonies,
  deleteColony,
  updateColony,
} from "../database/database";
import { SQLiteDatabase } from "expo-sqlite";

export default function ColonyList() {
  const [colonies, setColonies] = useState<any[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDescription, setEditingDescription] = useState(""); // New state for editing description
  const [editingColonyId, setEditingColonyId] = useState<number | null>(null); // Store the ID of the colony being edited

  useEffect(() => {
    const initializeDb = async () => {
      const database = await openDatabase();
      setDb(database);
      loadColonies(database);
    };
    initializeDb();
  }, []);

  const loadColonies = async (database: SQLiteDatabase) => {
    const data = await getColonies(database);
    setColonies(data);
  };

  const handleDelete = async (id: number) => {
    if (db) {
      await deleteColony(db, id);
      loadColonies(db);
    }
  };

  // Open the modal with the current description of the colony
  const handleEdit = (colonyId: number, currentDescription: string) => {
    setEditingColonyId(colonyId);
    setEditingDescription(currentDescription);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    // Trim the description to remove leading/trailing spaces and check if it's not empty
    const trimmedDescription = editingDescription.trim();

    if (db && trimmedDescription !== "") {
      try {
        // Update the colony with the new description
        await updateColony(db, editingColonyId!, trimmedDescription);
        loadColonies(db); // Reload colonies after updating
        setIsModalVisible(false); // Close the modal after saving
      } catch (error) {
        console.error("Error updating colony:", error);
      }
    } else {
      console.error("Description cannot be empty");
      alert("Description cannot be empty"); // You can display a user-friendly alert
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={colonies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.colonyItem}>
            <Text style={styles.text}>Description: {item.description}</Text>
            <Text style={styles.text}>Time: {item.time}</Text>
            <Text style={styles.text}>
              Lat: {item.latitude}, Long: {item.longitude}
            </Text>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
            <Button
              title="Edit Description"
              onPress={() => handleEdit(item.id, item.description)}
            />
          </View>
        )}
      />

      {/* Modal for editing the description */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Description</Text>
          <TextInput
            value={editingDescription}
            onChangeText={setEditingDescription}
            style={styles.input}
          />
          <Button title="Save" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  colonyItem: { padding: 10, borderBottomWidth: 1, marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    width: "80%",
  },
});
