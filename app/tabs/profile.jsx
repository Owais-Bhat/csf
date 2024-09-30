import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// Default profile image
const DEFAULT_PROFILE_IMAGE = require("../../assets/user.png");

const MenuItem = ({ icon, text, onPress, style }) => (
  <TouchableOpacity style={[styles.menuItem, style]} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon} size={18} color="#808080" />
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward-outline" size={30} color="#808080" />
  </TouchableOpacity>
);

const Profile = () => {
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [name, setName] = useState("John Doe");
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setName(user.name || "John Doe");
        setProfileImage(
          user.profileImage ? { uri: user.profileImage } : DEFAULT_PROFILE_IMAGE
        );
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      router.replace("/auth/sign_in");
    } catch (error) {
      console.error("Failed to logout:", error);
      Alert.alert("Error", "Failed to logout.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 5 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
        </View>
        <View style={styles.profileHeader}>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={styles.profileName}>{name}</Text>
        </View>

        {/* Menu Items with individual styles */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="time-outline"
            text="History"
            onPress={() => router.push("/history")}
            style={styles.historyItem} // Individual style
          />
          <MenuItem
            icon="person-outline"
            text="Personal Details"
            onPress={() => router.push("/screen/personaldetails")}
            style={styles.personalDetailsItem} // Individual style
          />
          <MenuItem
            icon="location-outline"
            text="Address"
            onPress={() => router.push("/address")}
            style={styles.addressItem} // Individual style
          />
          <MenuItem
            icon="card-outline"
            text="Payment Method"
            onPress={() => router.push("/payment-method")}
            style={styles.paymentMethodItem} // Individual style
          />
          <MenuItem
            icon="information-circle-outline"
            text="About"
            onPress={() => router.push("/about")}
            style={styles.aboutItem} // Individual style
          />
          <MenuItem
            icon="help-circle-outline"
            text="Help"
            onPress={() => router.push("/help")}
            style={styles.helpItem} // Individual style
          />
          <MenuItem
            icon="log-out-outline"
            text="Log out"
            onPress={handleLogout}
            style={styles.logoutItem} // Individual style
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuContainer: {
    marginTop: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  menuIconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
  },
  menuText: {
    flex: 1,
    fontSize: 20,
    marginLeft: 10,
    color: "#000",
  },
  // Individual styles for each menu item
  historyItem: {
    backgroundColor: "#fff",
  },
  personalDetailsItem: {
    backgroundColor: "#fff",
  },
  addressItem: {
    backgroundColor: "#fff",
  },
  paymentMethodItem: {
    backgroundColor: "#fff",
  },
  aboutItem: {
    backgroundColor: "#fff",
  },
  helpItem: {
    backgroundColor: "#fff",
  },
  logoutItem: {
    backgroundColor: "#fff",
  },
});

export default Profile;
