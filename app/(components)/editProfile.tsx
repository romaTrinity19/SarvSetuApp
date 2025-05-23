import { Feather, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
type PasswordInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  show: boolean;
  toggleShow: () => void;
};
const EditProfileScreen = () => {
  const [firstName, setFirstName] = useState("roma");
  const [lastName, setLastName] = useState("Chakradhari");
  const [email, setEmail] = useState("romachakradhari123@gmail.com");
  const [phone, setPhone] = useState("7999559862");
  const [selectedState, setSelectedState] = useState("Chhattisgarh");
  const [selectedDistrict, setSelectedDistrict] = useState("Gariaband");
  const [selectedTaluka, setSelectedTaluka] = useState("Chhura");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container2}>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center',gap:5 , paddingLeft:10, paddingVertical:15 }}>
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
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <>
                <Text style={styles.avatarText}>
                  {firstName.charAt(0).toUpperCase()}
                  {lastName.charAt(0).toUpperCase()}
                </Text>
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
          />
        </View>

        <View style={styles.row}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedState}
              onValueChange={setSelectedState}
            >
              <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <Picker.Item label="Gariaband" value="Gariaband" />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerWrapperFull}>
          <Picker
            selectedValue={selectedTaluka}
            onValueChange={setSelectedTaluka}
          >
            <Picker.Item label="Chhura" value="Chhura" />
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
            setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
          }
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingTop: 30,
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
    padding: 10,
    fontSize: 14,
  },
  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
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
