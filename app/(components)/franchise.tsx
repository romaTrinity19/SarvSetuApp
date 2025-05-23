import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
  const [selectedState, setSelectedState] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Become A Frenchise</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            placeholder="Last Name"
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          keyboardType="email-address"
        />

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
            style={[styles.input, { flex: 1, marginLeft: 8, marginTop: 10 }]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
          >
            <Picker.Item label="--Select State--" value="" />
            <Picker.Item label="Maharashtra" value="MH" />
            <Picker.Item label="Delhi" value="DL" />
            <Picker.Item label="Karnataka" value="KA" />
            <Picker.Item label="Tamil Nadu" value="TN" />
          </Picker>
        </View>

        <TextInput placeholder="Referral Code" style={styles.input} />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Set Password"
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

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Confirm Password"
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

        <TouchableOpacity style={styles.signUpButton} onPress={()=>router.push('/(auth)/otp')}>
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
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#002B5B",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: -30,
    marginBottom: 30,
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
    paddingLeft:5
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
