import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [country, setCountry] = useState<Country | null>(null);
  //const [selectedState, setSelectedState] = useState(null);
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
  // ✅ Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [role, setRole] = useState("");
  const [referral, setReferral] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !selectedState ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing Fields", "Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    // ✅ Prepare form data
    const formData = {
      firstName,
      lastName,
      email,
      phone: `+${country?.callingCode?.[0] || "91"}${phone}`,
      state: selectedState,
      role,
      referral,
      password,
    };

    // ✅ Navigate with data
    router.push({
      pathname: "/(auth)/otp",
      params: formData,
    });
  };
  return (
   <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create an Account</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.subText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.link2}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        {/* First and Last Name */}
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        {/* Email */}
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Country Code + Phone */}
        <View style={styles.phoneRow}>
          <View style={styles.flagBox}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withEmoji
              onSelect={(country: Country) => {
                setCountryCode(country.cca2);
                setCountry(country);
              }}
            />
            <Text style={styles.phoneCode}>
              +{country?.callingCode?.[0] || "91"}
            </Text>
          </View>
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={[styles.input, { flex: 1, marginLeft: 8, marginTop: 10 }]}
            keyboardType="numeric"
          />
        </View>

        {/* State Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
          >
            <Picker.Item label="--Select State--" value="" />
            {indianStates.map((st, idx) => (
              <Picker.Item key={idx} label={st} value={st} />
            ))}
          </Picker>
        </View>

        {/* Role Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="--Select Role--" value="" />
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Vendor" value="vendor" />
          </Picker>
        </View>

        {/* Referral */}
        <TextInput
          placeholder="Referral Code"
          value={referral}
          onChangeText={setReferral}
          style={styles.input}
        />

        {/* Password */}
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Set Password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm(!showConfirm)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showConfirm ? "eye-off" : "eye"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By signing up, agree to the{" "}
          <Text style={styles.link}>Terms Of Use</Text> and{" "}
          <Text style={styles.link}>Data Deletion Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#002B5B",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subText: {
    color: "#eee",
  },
  link: {
    color: "#1877F2",
    fontWeight: "500",
  },
  link2: {
    color: "#fff",
    fontWeight: "500",
    textDecorationLine: "underline",
    paddingLeft: 5,
  },
  form: {
    padding: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  flagBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  flag: {
    fontSize: 20,
    marginRight: 4,
  },
  phoneCode: {
    fontSize: 16,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  signUpButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signUpText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: "#666",
    fontSize: 13,
  },
});

export default SignUpScreen;
