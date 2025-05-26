import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateShopScreen = () => {
  const router = useRouter();

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const pickMainImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setMainImage(result.assets[0].uri);
    }
  };

  const pickOtherImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setOtherImages(selectedUris);
    }
  };

  const handleSubmit = async () => {
    const shopData = {
      id: Date.now().toString(),
      name: title,
      price: 0,
      originalPrice: 0,
      image: { uri: mainImage || "" },
      images: otherImages,
      phoneNumber: callNumber,
      website,
      whatsappNumber: whatsapp,
    };

    const existing = await AsyncStorage.getItem("shops");
    const shops = existing ? JSON.parse(existing) : [];
    shops.push(shopData);
    await AsyncStorage.setItem("shops", JSON.stringify(shops));

    router.push("/(main)/Product");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>  
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Shop</Text>

      <Text style={styles.label}>Main Image</Text>
      <TouchableOpacity onPress={pickMainImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Pick Main Image</Text>
      </TouchableOpacity>
      {mainImage && (
        <Image source={{ uri: mainImage }} style={styles.mainImage} />
      )}

      <Text style={styles.label}>Other Images</Text>
      <TouchableOpacity onPress={pickOtherImages} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Pick Other Images</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {otherImages.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.otherImage} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Shop Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Enter shop title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        placeholder="Write a short description"
        multiline
      />

      <Text style={styles.label}>Call Number</Text>
      <TextInput
        value={callNumber}
        onChangeText={setCallNumber}
        keyboardType="phone-pad"
        style={styles.input}
        placeholder="Enter contact number"
      />

      <Text style={styles.label}>Website</Text>
      <TextInput
        value={website}
        onChangeText={setWebsite}
        style={styles.input}
        placeholder="https://example.com"
      />

      <Text style={styles.label}>WhatsApp Contact</Text>
      <TextInput
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
        style={styles.input}
        placeholder="Enter WhatsApp number"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create Shop</Text>
      </TouchableOpacity>
    </ScrollView>
     </SafeAreaView>
  );
};

const PRIMARY = "#002B5B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    color: PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  imageButton: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  otherImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
    marginBottom:100
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateShopScreen;
