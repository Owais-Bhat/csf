import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Use Expo Router
import urls from "../urls";

const { width } = Dimensions.get("window");

const Grevience = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];
  const router = useRouter(); // Using Expo Router

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    else if (phone.length !== 10) newErrors.phone = "Phone must be 10 digits";
    if (!address) newErrors.address = "Address is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      if (images.length + newImages.length <= 10) {
        setImages([...images, ...newImages]);
      } else {
        setErrors({ global: "You can only upload up to 10 images." });
      }
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      if (images.length < 10) {
        setImages([...images, result.assets[0].uri]);
      } else {
        setErrors({ global: "You can only upload up to 10 images." });
      }
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userId = await AsyncStorage.getItem("userId");
    const userToken = await AsyncStorage.getItem("userToken");

    console.log("Grievance submitted successfully");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", phone);
      formData.append("subject", address);
      formData.append("text", description);
      formData.append("userId", userId);

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      await axios.post(`${urls}/api/v1/grievance/create_grievance`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      // router.push("/grievanceList"); // Navigate to the grievance list after submission
    } catch (error) {
      console.error("Error submitting grievance:", error);
      setErrors({ global: "Failed to submit grievance. Please try again." });
    }
  };

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <Text style={styles.header}>Submit Grievance</Text>

          <TextInput
            style={[styles.input, styles.inputShadow]}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#aaa"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, styles.inputShadow]}
            placeholder="Phone Number"
            value={phone}
            onChangeText={(text) => {
              if (text.length <= 10) setPhone(text);
            }}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TextInput
            style={[styles.input, styles.inputShadow]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#aaa"
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          <TextInput
            style={[
              styles.input,
              styles.inputShadow,
              { textAlignVertical: "top" },
            ]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholderTextColor="#aaa"
            numberOfLines={5}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity onPress={pickImages} style={styles.imageButton}>
              <Icon name="image" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={captureImage} style={styles.imageButton}>
              <Icon name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="x" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {errors.global && (
            <Text style={styles.errorText}>{errors.global}</Text>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 50,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 2,
    borderRadius: 50,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Grevience;
