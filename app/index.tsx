import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import ColonyList from "./ColonyList";
import AddColony from "./AddColony";

export default function App() {
  const [showAddColony, setShowAddColony] = useState(false);

  return (
    <View style={styles.container}>
      {showAddColony ? (
        <AddColony onColonyAdded={() => setShowAddColony(false)} />
      ) : (
        <ColonyList />
      )}
      <Button
        title={showAddColony ? "View Colonies" : "Add Colony"}
        onPress={() => setShowAddColony(!showAddColony)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "95%" },
});
