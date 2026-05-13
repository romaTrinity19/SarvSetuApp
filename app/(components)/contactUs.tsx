import { fetchUserData } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ProtectedRoute from "./ProtectedRoute";

const ContactUs = () => {
  const [userData, setUserData] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadImage, setUploadImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickQrImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Permission Required",
        text2: "Gallery access required!",
        position: "top",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const original = result.assets[0];

      const compressed = await ImageManipulator.manipulateAsync(
        original.uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      setUploadImage({ ...original, uri: compressed.uri });
    }
  };

  useEffect(() => {
    const loadAndFetchUser = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    loadAndFetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !subject || !message) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields.",
        position: "top",
      });
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid email address.",
        position: "top",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("contact", phone);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("reg_id", userData?.reg_id || "");
    formData.append("type", "contact_us");
    if (uploadImage) {
      const fileUri = uploadImage.uri;
      const fileName =
        uploadImage.fileName || fileUri.split("/").pop() || "upload_image.jpg";

      const file: any = {
        uri: fileUri,
        type: uploadImage.mimeType || "image/jpeg",
        name: fileName,
      };

      formData.append("image", file);
    }

    try {
      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        Toast.show({
          type: "success",
          text1: "Message sent successfully.",
          position: "top",
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setUploadImage(null);
      } else {
        Toast.show({
          type: "error",
          text1: result.message || "Failed to send message.",
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      Toast.show({
        type: "error",
        text1: "Unable to send message. Please try again later.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData) {
      setFullName(
        `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      );
      setEmail(userData.email || "");
      setPhone(userData.contact_no || "");
    }
  }, [userData]);
  return (
    <ProtectedRoute>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust as needed
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.backText}>Contact Us</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container1}>
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Contact Us</Text>
                <Text style={styles.headerSubtitle}>
                  Get in touch with us for support, feedback, or inquiries—just
                  a tap away!
                </Text>
              </View>

              <View style={{ padding: 18, backgroundColor: "#fff" }}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                  placeholderTextColor="#555"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputBox}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={styles.code}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone Number"
                    placeholderTextColor="#555"
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Subject"
                  placeholderTextColor="#555"
                />

                <Text style={styles.label}>Upload Image</Text>

                <View style={{ alignItems: "center", marginBottom: 15 }}>
                  <TouchableOpacity
                    onPress={pickQrImage}
                    style={{
                      width: 150,
                      height: 150,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    {uploadImage ? (
                      <Image
                        source={{ uri: uploadImage.uri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <Ionicons
                          name="cloud-upload-outline"
                          size={40}
                          color="#888"
                        />
                        <Text
                          style={{ fontSize: 12, marginTop: 5, color: "#555" }}
                        >
                          Upload Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Message"
                  placeholderTextColor="#555"
                  multiline
                />

                <TouchableOpacity
                  style={[styles.submitButton, loading && { opacity: 0.7 }]}
                  onPress={handleSubmit}
                  disabled={loading} // disable while loading
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  container1: {
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 14,
  },
  backText: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight: "bold",
  },
  headerBox: {
    backgroundColor: "#002f5f",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 15,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    color: "black",
  },
  phoneInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  code: {
    fontSize: 16,
    marginRight: 6,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: "#002f5f",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ContactUs;
