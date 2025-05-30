import { fetchUserData } from "@/components/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
import * as ImageManipulator from "expo-image-manipulator";


type PasswordInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  show: boolean;
  toggleShow: () => void;
};
type State = {
  id: string;
  state_name: string;
  state_code: string;
};

const EditProfileScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(" ");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(" ");
  const [selectedState, setSelectedState] = useState(" ");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<State[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=state"
        );

        if (response.data && Array.isArray(response.data.data)) {
          setStates(response.data.data);
        } else {
          console.error("Invalid states response", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };
    fetchStates();
  }, []);

  const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Toast.show({
      type: "error",
      text1: "Permission Required",
      text2: "Permission to access gallery is required!",
      position: "top",
    });
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1, // This affects camera capture more than picker
  });

  if (!result.canceled) {
    const original = result.assets[0];
 
    const compressed = await ImageManipulator.manipulateAsync(
      original.uri,
      [{ resize: { width: 800 } }],  
      {
        compress: 0.7, 
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    setSelectedImage({ ...original, uri: compressed.uri });
  }
};


  const handleSave = async () => {
    if (!firstName || !lastName || !selectedState) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields.",
        text2: "Validation Error",
        position: "top",
      });

      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "New password and confirm password must be the same.",
        position: "top",
      });

      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("reg_id", userData?.reg_id || "");
    formData.append("last_name", lastName);
    formData.append("state_id", selectedState);
    formData.append("old_pass", oldPassword);
    formData.append("new_pass", newPassword);
    formData.append("type", "profileupdate");

    if (selectedImage) {
      const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
      if (!fileInfo.exists) {
        Toast.show({
          type: "error",
          text1: "File Error",
          text2: "Selected image file does not exist.",
          position: "top",
        });

        return;
      }

      formData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.fileName || "profile.jpg",
        type: selectedImage.mimeType || "image/jpeg",
      } as any);
    }

    try {
      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // don't set Content-Type manually for FormData
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        Toast.show({
          type: "success",
          text1: "Profile updated successfully.",
          position: "top",
        });
      } else {
        Toast.show({
          type: "error",
          text1: result.message || "Something went wrong.",
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Profile update error:", error.message || error);
      Toast.show({
        type: "errpr",
        text1: "Unable to update profile.",
        position: "top",
      });
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append("type", "delete_user");
              formData.append("reg_id", userData?.reg_id);
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
              const result = await response.json();

              if (result.status === "success") {
                Toast.show({
                  type: "success",
                  text1: "Account deleted successfully.",
                  position: "top",
                });

                await AsyncStorage.removeItem("userData");
                router.push("/(auth)/login");
              } else {
                Toast.show({
                  type: "error",
                  text1: result.message || "Failed to delete account.",
                  position: "top",
                });
              }
            } catch (error) {
              console.error("Delete account error:", error);
              Toast.show({
                type: "error",
                text1: "Something went wrong while deleting account.",
                position: "top",
              });
            }
          },
        },
      ]
    );
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
          setFirstName(freshUserData?.first_name || "");
          setLastName(freshUserData?.last_name || "");
          setEmail(freshUserData?.email || "");
          setPhone(freshUserData?.contact_no || "");
          setSelectedState(freshUserData?.state_id);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAndFetchUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container2}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingLeft: 10,
            paddingVertical: 15,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.avatarImage}
                />
              ) : (
                <>
                  <Image
                    source={{
                      uri: userData?.profile_image
                        ? userData?.profile_image
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={styles.defaultAvatarImage}
                  />

                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={16} color="#000" />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            style={styles.inputFull}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={false}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value="+91"
              editable={false}
            />
            <TextInput
              style={[styles.input, { flex: 3 }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={false}
            />
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedState}
              onValueChange={(itemValue) => setSelectedState(itemValue)}
            >
              <Picker.Item label="--Select State--" value="" />
              {states.map((st) => (
                <Picker.Item
                  key={st.id}
                  label={st?.state_name}
                  value={st?.id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.sectionHeader}>Change Password</Text>

          <PasswordInput
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            show={showPassword.old}
            toggleShow={() =>
              setShowPassword({ ...showPassword, old: !showPassword.old })
            }
          />
          <PasswordInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            show={showPassword.new}
            toggleShow={() =>
              setShowPassword({ ...showPassword, new: !showPassword.new })
            }
          />
          <PasswordInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            show={showPassword.confirm}
            toggleShow={() =>
              setShowPassword({
                ...showPassword,
                confirm: !showPassword.confirm,
              })
            }
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChangeText,
  show,
  toggleShow,
}) => (
  <View style={styles.passwordContainer}>
    <TextInput
      style={styles.passwordInput}
      placeholder={placeholder}
      secureTextEntry={!show}
      value={value}
      onChangeText={onChangeText}
    />
    <TouchableOpacity onPress={toggleShow}>
      <Ionicons name={show ? "eye-off" : "eye"} size={20} color="gray" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container2: {
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  defaultAvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
    resizeMode: "cover",
  },

  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    marginBottom: 15,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  pickerWrapperFull: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: "#002244",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteText: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default EditProfileScreen;
