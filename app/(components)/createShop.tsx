import { fetchUserData } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";


const SimpleFormScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [payout, setPayout] = useState("");
  const [validUpto, setValidUpto] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const regId = parsedUser?.reg_id;
        const freshUserData = await fetchUserData(regId);
        setUserData(freshUserData || parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1, // this only affects the camera, not picker
  });

  if (!result.canceled) {
    const selectedImage = result.assets[0];
    const compressed = await ImageManipulator.manipulateAsync(
      selectedImage.uri,
      [{ resize: { width: 800 } }], 
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } 
    );

    setImage(compressed.uri);  
  }
};


  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep picker open on iOS
    if (selectedDate) {
      setValidUpto(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!image || !payout || !validUpto) {
      Toast.show({
        type: "error",
        text1: "Incomplete Form",
        text2: "Please fill all fields and upload an image.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        Toast.show({
          type: "error",
          text1: "File Error",
          text2: "Selected image file does not exist.",
        });
        return;
      }
      const filename = image.split("/").pop();

      const formData = new FormData();
      formData.append("payamt", payout);
      formData.append("valid_upto", validUpto.toISOString().split("T")[0]);
      formData.append("type", "saveadd");
      formData.append("reg_id", userData?.reg_id.toString());
      formData.append("image", {
        uri: image,
        name: filename || "ad_image.jpg",
        type: "image/jpeg",
      } as any);

      // Optional: If you need to send user ID or token
      // formData.append("vendor_id", userData?.reg_id);

      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php", // 🔁 Replace with your actual endpoint
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );
      const text = await response.text();
      const result = JSON.parse(text);

      if (response.ok && result.status === "success") {
        Toast.show({
          type: "success",
          text1: "Ad Created",
          text2: "Your ad has been submitted successfully.",
        });
        router.replace("/(components)/vendorAdsData");
      } else {
        Toast.show({
          type: "error",
          text1: "Server Error",
          text2: result?.message || "Failed to create ad.",
        });
      }
    } catch (error) {
      console.error("Ad creation error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to submit ad. Please try again.",
      });
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FA" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.heading}> Create a New Ad</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>📷 Upload Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Choose Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.mainImage} />}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>💰 Payout (₹)</Text>
          <TextInput
            value={payout}
            onChangeText={setPayout}
            style={styles.input}
            placeholder="Enter payout amount"
             placeholderTextColor="#555"
            keyboardType="numeric"
          />

          <Text style={[styles.label, { marginTop: 16 }]}>📅 Valid Until</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: "#333" }}>
              {validUpto
                ? `${validUpto.getDate().toString().padStart(2, "0")}/${(
                    validUpto.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}/${validUpto.getFullYear()}`
                : ""}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={validUpto}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, submitting && { opacity: 0.6 }]}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Create Ad</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY = "#002B5B";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#FAFAFA",
    color:'black'
  },
  imageButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default SimpleFormScreen;
