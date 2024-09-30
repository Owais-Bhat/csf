import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import urls from "../urls";
import { SafeAreaView } from "react-native-safe-area-context";
import Mic from "react-native-vector-icons/Feather";
import Search from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

// Placeholder image for missing blog photos
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x200";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter(); // For navigation

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/blogs/get_all`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogSelect = (blog) => {
    router.push(`/blog/${blog.slug}`);
  };

  // Render blog list view
  return (
    <SafeAreaView style={stylesBlogList.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
          Blogs
        </Text>
      </View>
      <View style={stylesBlogList.searchContainer}>
        <Search name="search" size={24} style={stylesBlogList.searchIcon} />
        <TextInput
          style={stylesBlogList.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={() => alert("Mic functionality disabled")} // Placeholder for mic button
          style={stylesBlogList.speechIconContainer}
        >
          <Mic name="mic" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={blogs}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleBlogSelect(item)}
            style={stylesBlogList.card}
          >
            <Image
              source={{
                uri: `${urls}/api/v1/blogs/singlePhoto/${item._id}`,
              }}
              style={stylesBlogList.image}
              defaultSource={{ uri: PLACEHOLDER_IMAGE }} // Fallback for loading issues
            />
            <Text style={stylesBlogList.title}>{item.heading}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    </SafeAreaView>
  );
};

// Styles for the blog list view
const stylesBlogList = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#E9C137",
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#e8fffd",
    marginBottom: 20,
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

export default Blog;
