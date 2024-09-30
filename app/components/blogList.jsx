import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import urls from "../urls";
import { AntDesign } from "@expo/vector-icons"; // For icons
import { Share } from "react-native"; // Import Share for sharing functionality
import AsyncStorage from "@react-native-async-storage/async-storage"; // For saving likes persistently

const { width: screenWidth } = Dimensions.get("window");

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]); // State to store liked blogs
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/blogs/get_all`);
        setBlogs(response.data);
        // Load liked blogs from AsyncStorage when component mounts
        const storedLikes = await AsyncStorage.getItem("likedBlogs");
        if (storedLikes) {
          setLikedBlogs(JSON.parse(storedLikes));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogSelect = (blog) => {
    router.push(`/blog/${blog.slug}`);
  };

  const handleLike = async (blog) => {
    let updatedLikes;
    if (likedBlogs.includes(blog._id)) {
      // If blog is already liked, remove it from the liked list
      updatedLikes = likedBlogs.filter((id) => id !== blog._id);
    } else {
      // Otherwise, add it to the liked list
      updatedLikes = [...likedBlogs, blog._id];
    }

    setLikedBlogs(updatedLikes);
    await AsyncStorage.setItem("likedBlogs", JSON.stringify(updatedLikes));
  };

  const handleShare = async (blog) => {
    try {
      await Share.share({
        message: `Check out this blog: ${blog.heading}\nRead more at: ${urls}/blog/${blog.slug}`,
      });
    } catch (error) {
      Alert.alert("Error sharing blog", error.message);
    }
  };

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBlogSelect(item)}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `${urls}/api/v1/blogs/singlePhoto/${item._id}` || "", // Fallback for undefined photos
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.cardContent}>
          {/* Author Container with Image and Text */}
          <View style={styles.authorContainer}>
            <Image
              source={require("../../assets/founder.png")}
              style={styles.profileImage}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.staticTitle}>Chandan Singh Foundation</Text>
              <Text style={styles.subtitle}>Founder</Text>
            </View>
          </View>

          {/* Blog Content */}
          <View style={styles.textContainer}>
            <Text style={styles.blogTitle}>{item.heading}</Text>
            <Text style={styles.description}>
              {item.mainContent?.substring(0, 70)}...
            </Text>
          </View>

          {/* Like and Share Icons */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => handleLike(item)}
              style={styles.likeButton}
            >
              {/* Change the like icon color based on whether the blog is liked */}
              <AntDesign
                name={likedBlogs.includes(item._id) ? "like1" : "like2"}
                size={24}
                color={likedBlogs.includes(item._id) ? "blue" : "black"} // Blue if liked
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare(item)}
              style={{ marginLeft: 10 }}
            >
              <AntDesign name="sharealt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item._id.toString()}
        horizontal // Makes the list horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E9C137",
    borderRadius: 10,
    overflow: "hidden",
    width: screenWidth - 20,
    height: 230,
    position: "relative",
    marginBottom: 60,
    marginRight: 10,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    borderRadius: 10,
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  textWrapper: {
    flexDirection: "column",
  },
  staticTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "black",
    marginTop: 5,
  },
  textContainer: {
    paddingLeft: 10,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "black",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BlogList;
