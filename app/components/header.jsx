import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Mic from "react-native-vector-icons/Feather";
import Search from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultProfileImage = require("../../assets/user.png");

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setProfileImage(user.profileImage || defaultProfileImage);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };

    loadProfileImage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Logo */}
        <Image source={require("../../assets/logo.png")} style={styles.logo} />

        {/* Clickable Profile Image */}
        <TouchableOpacity onPress={() => router.push("/tabs/profile")}>
          <Image
            source={
              profileImage && profileImage !== defaultProfileImage
                ? { uri: profileImage }
                : defaultProfileImage
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search name="search" size={24} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={() => alert("Mic functionality disabled")}
          style={styles.speechIconContainer}
        >
          <Mic name="mic" size={24} color={isListening ? "red" : "black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "lightgray",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  speechIconContainer: {
    padding: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default Header;
