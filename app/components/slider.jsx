import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
} from "react-native";
import axios from "axios";
import urls from "../urls"; // Ensure this points to your API URL

const { screenWidth } = Dimensions.get("window");

const Slider = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch all slider images from the API
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/slider/get-slider`);
        console.log("Slider Images Response:", response.data);
        if (Array.isArray(response.data.sliderData)) {
          setSliderImages(response.data.sliderData); // Access the sliderData array
        } else {
          console.error("Expected an array of images");
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  const fetchSingleSliderImage = async (id) => {
    try {
      const response = await axios.get(
        `${urls}/api/v1/slider/get-slider/${id}`
      ); // Adjust API call to get single image details
      console.log("Single Slider Image Response:", response.data);
      setSelectedImage(response.data); // Assuming response.data contains the selected image details
      setModalVisible(true); // Show modal with the selected image
    } catch (error) {
      console.error("Error fetching single slider image:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={sliderImages}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchSingleSliderImage(item._id)}>
            <Image
              source={{ uri: `${urls}/api/v1/slider/get-slider/${item._id}` }} // Ensure correct image URL
              style={styles.sliderImage}
              onError={(e) =>
                console.error("Image load error", e.nativeEvent.error)
              } // Handle image load errors
            />
            {/* Uncomment to show image details */}
            {/* <View style={styles.imageDetails}>
              <Text style={styles.imageTitle}>{item.title}</Text>
              <Text style={styles.imageDescription}>{item.des}</Text>
            </View> */}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()} // Assuming each image has a unique _id
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      {/* Modal for displaying single slider image */}
      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedImage.title}</Text>
            <Image
              source={{ uri: selectedImage.imageUrl }} // Use the appropriate field from your API response
              style={styles.modalImage}
              onError={(e) =>
                console.error("Modal Image load error", e.nativeEvent.error)
              } // Handle image load errors
            />
            <Text style={styles.modalDescription}>{selectedImage.des}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    maxWidth: screenWidth,
    height: 300,
    marginBottom: -90,
    padding: 10.5,
  },
  sliderImage: {
    width: 372, // Adjust width to fit your design
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imageDetails: {
    padding: 10,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageDescription: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Slider;
