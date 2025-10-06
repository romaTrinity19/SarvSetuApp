import { fetchUserData } from "@/components/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ProtectedRoute from "./ProtectedRoute";
//import { useDocumentStore } from '../store/useDocumentStore';

const UploadDocumentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const { adID } = useLocalSearchParams();
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);

  const openPicker = async (mode: "camera" | "gallery") => {
    setModalVisible(false);

    const result = await (mode === "camera"
      ? ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        }));

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      // Compress and resize the image
      const compressed = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(compressed.uri);
      // setDocument(type as string, compressed.uri); // Uncomment if needed
    }
  };

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const regId = parsedUser?.reg_id;
        const freshUserData = await fetchUserData(regId);
        setUserData(freshUserData || parsedUser);

        const key = `uploadDone_${regId}_${
          Array.isArray(adID) ? adID[0] : adID
        }`;
        const uploaded = await AsyncStorage.getItem(key);
        if (uploaded === "true") {
          setAlreadyUploaded(true);
        }
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
  const handleSubmit = async () => {
    if (submitting) return;

    if (!image || !userData?.reg_id) {
      Toast.show({
        type: "error",
        text1: "Incomplete Form",
        text2: "Please upload an image and ensure user is logged in.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const filename = image.split("/").pop();
      const formData = new FormData();
      formData.append("type", "savestatus");
      formData.append("ads_id", Array.isArray(adID) ? adID[0] : adID || "");
      formData.append("reg_id", userData.reg_id.toString());
      formData.append("image", {
        uri: image,
        name: filename || "upload.jpg",
        type: "image/jpeg",
      } as any);

      console.log("formData", formData);

      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid server response");
      }

      if (response.ok && result.status === "success") {
        const key = `uploadDone_${userData.reg_id}_${
          Array.isArray(adID) ? adID[0] : adID
        }`;
        await AsyncStorage.setItem(key, "true");
        Toast.show({
          type: "success",
          text1: "Upload Successful",
          text2: "Your image has been submitted successfully.",
        });
        router.replace("/(main)/Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: result?.message || "Something went wrong. Try again.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to upload. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Upload ScreenShot</Text>
          </View>

          {/* Text */}
          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.heading}>
              Upload Screenshot of WhatsApp status for Verification
            </Text>
            <Text style={styles.subText}>
              Please upload a Screenshot of WhatsApp status to verify your
              status .
            </Text>
            <Text style={styles.subText}>
              In your status must have at least 50 Views .
            </Text>

            <Text style={styles.subLabel}>Upload ScreenShot</Text>

            {/* Upload Card */}
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={() => setModalVisible(true)}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Feather name="upload" size={30} color="#8c28eb" />
                  <Text style={styles.uploadText}>
                    Choose a image and upload here
                  </Text>
                  <Text style={styles.formatText}>JPEG, PNG</Text>
                  <View style={styles.browseBtn}>
                    <Text style={styles.browseText}>Browse Image</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Upload Button */}
            <TouchableOpacity
              style={[
                styles.uploadButton,
                (submitting || alreadyUploaded) && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={submitting || alreadyUploaded}
            >
              <Text style={styles.uploadButtonText}>
                {alreadyUploaded
                  ? "Already Uploaded"
                  : submitting
                  ? "Uploading..."
                  : "Upload Document"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                {/* Cross Icon */}
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Please Select</Text>
                <View style={styles.modalOptions}>
                  <TouchableOpacity
                    style={styles.optionBtn}
                    onPress={() => openPicker("camera")}
                  >
                    <Ionicons name="camera-outline" size={24} color="#000" />
                    <Text>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionBtn}
                    onPress={() => openPicker("gallery")}
                  >
                    <Ionicons name="images-outline" size={24} color="#000" />
                    <Text>Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default UploadDocumentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", marginLeft: 5 },
  heading: { fontSize: 23, fontWeight: "600", marginTop: 20 },
  subText: { fontSize: 15, color: "#555", marginTop: 8 },
  subLabel: { fontWeight: "600", marginTop: 30, marginBottom: 8, fontSize: 18 },
  uploadCard: {
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 25,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },

  uploadText: {
    fontSize: 14,
    marginTop: 10,
    color: "#000",
    fontWeight: "bold",
  },
  formatText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
    fontWeight: "bold",
    marginTop: 6,
  },
  browseBtn: {
    backgroundColor: "#e0bfff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  browseText: { fontSize: 12, color: "#8c28eb" },
  uploadButton: {
    backgroundColor: "#002B5B",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  uploadButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  uploadedImage: { width: "100%", height: 180, borderRadius: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#f6f0fc",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 80,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionBtn: {
    alignItems: "center",
  },
});
