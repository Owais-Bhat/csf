import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const defaultProfileImage = require("../../assets/user.png");

const PersonalDetails = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone);
          setAddress(user.address);
          setGender(user.gender);
          setProfileImage(user.profileImage || defaultProfileImage);
          setDob(formatDateToDDMMYYYY(new Date(user.dob)));
          setMaritalStatus(user.maritalStatus || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const formatDateToDDMMYYYY = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${day}/${month}/${year}`;
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      const parsedDob = new Date(dob.split("/").reverse().join("-"));
      const today = new Date();

      if (parsedDob > today) {
        Alert.alert("Error", "Date of birth cannot be in the future.");
        return;
      }

      const updatedUserData = {
        name,
        email,
        phone,
        address,
        gender,
        profileImage:
          profileImage !== defaultProfileImage ? profileImage : null,
        dob: parsedDob.toISOString(),
        maritalStatus,
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      Alert.alert("Success", "Profile updated successfully!");
      router.push("/tabs/profile");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    Animated.timing(fadeAnim, {
      toValue: isEditing ? 1 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const address = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
    setAddress(address);
  };

  const handleDateConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    const today = new Date();

    if (currentDate > today) {
      Alert.alert("Error", "Date of birth cannot be in the future.");
      return;
    }

    setDob(formatDateToDDMMYYYY(currentDate));
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.profileHeader}>
          {isEditing && (
            <TouchableOpacity onPress={handleImagePick}>
              <Image
                source={
                  profileImage && profileImage !== defaultProfileImage
                    ? { uri: profileImage }
                    : defaultProfileImage
                }
                style={styles.profileImage}
              />
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
          {!isEditing && profileImage && (
            <Image
              source={
                profileImage && profileImage !== defaultProfileImage
                  ? { uri: profileImage }
                  : defaultProfileImage
              }
              style={styles.profileImage}
            />
          )}
          <Text style={styles.profileName}>{name}</Text>
        </View>

        <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim }]}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false} // Email is non-editable
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              editable={false} // Phone is non-editable
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                />
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={fetchCurrentLocation}
                >
                  <Text style={styles.buttonText}>Use Current Location</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TextInput
                style={styles.input}
                value={address}
                editable={false}
              />
            )}
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (dd/mm/yyyy)"
                value={dob}
                editable={false} // Prevent manual input
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateConfirm}
              />
            )}
          </View>
          {isEditing && (
            <>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
              <Picker
                selectedValue={maritalStatus}
                style={styles.picker}
                onValueChange={(itemValue) => setMaritalStatus(itemValue)}
              >
                <Picker.Item label="Select Marital Status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Married" value="Married" />
              </Picker>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
  },
  locationButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
  },
});

export default PersonalDetails;
