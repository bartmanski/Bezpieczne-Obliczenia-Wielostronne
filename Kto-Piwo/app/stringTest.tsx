import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert
} from "react-native";
import { fetchStrings, addString } from "../api/stringsApi";

export default function StringsScreen() {
  const [strings, setStrings] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchStrings();
      setStrings(data);
    } catch (err) {
      Alert.alert("Error", String(err));
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async () => {
    if (!input.trim()) return;

    try {
      await addString(input.trim());
      setInput("");
      await load();
    } catch (err) {
      Alert.alert("Error", String(err));
    }
  };

  useEffect(() => {
  load(); // initial load

  const interval = setInterval(() => {
    load();
  }, 5000); // every 5 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
      <Text style={{ fontSize: 22, marginBottom: 10, color: "#fff" }}>
        Shared Strings
      </Text>

      {loading && (
        <Text style={{ color: "#aaa" }}>Loading...</Text>
      )}

      <FlatList
        data={strings}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text
            style={{
              fontSize: 16,
              paddingVertical: 4,
              color: "#fff"
            }}
          >
            • {item}
          </Text>
        )}
      />

      <TextInput
        placeholder="Add new string..."
        placeholderTextColor="#888"
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          borderColor: "#555",
          padding: 10,
          marginVertical: 10,
          borderRadius: 6,
          color: "#fff"
        }}
      />

      <Button title="Add" onPress={onAdd} />
    </View>
  );
}
