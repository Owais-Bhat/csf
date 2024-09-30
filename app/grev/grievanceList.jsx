import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import urls from "../urls";

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGrievances = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const userToken = await AsyncStorage.getItem("userToken");

      try {
        const response = await axios.get(
          `${urls}/api/v1/grievance/get_user_grievances/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setGrievances(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load grievances.");
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const renderGrievanceItem = ({ item }) => (
    <View style={styles.grievanceItem}>
      <Text style={styles.grievanceTitle}>{item.subject}</Text>
      <Text style={styles.grievanceText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading grievances...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={() => router.push("/tabs/grevience")}>
          <Text style={styles.tryAgainText}>Submit Grievance</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/grevience")}
      >
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Submit New Grievance</Text>
      </TouchableOpacity>

      <FlatList
        data={grievances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGrievanceItem}
        ListEmptyComponent={<Text>No grievances found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  grievanceItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  grievanceTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  grievanceText: {
    fontSize: 14,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  tryAgainText: {
    color: "#007bff",
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GrievanceList;
