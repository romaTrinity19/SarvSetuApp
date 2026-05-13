import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
// import CountryPicker, {
//   Country,
//   CountryCode,
// } from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type State = {
  id: string;
  state_name: string;
  state_code: string;
};

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [referralloading, setReferralLoading] = useState(false);
  // const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  // const [country, setCountry] = useState<Country | null>(null);
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [referral, setReferral] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [states, setStates] = useState<State[]>([]);
  const [subDistrict, setSubDistrict] = useState<any[]>([]);
  const [district, setDistrict] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [referralName, setReferralName] = useState("");
  const checkReferral = async (code: string) => {
    if (!code) {
      setIsValid(null);
      return;
    }
    try {
      setReferralLoading(true);
      const response = await fetch(
        `https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=check_referral`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ reg_code: code }),
        },
      );
      const data = await response.json();
      if (data.status === "success") {
        setIsValid(true);
        setReferralName(data.referral_name);
      } else {
        setIsValid(false);
        setReferralName("");
      }
    } catch (err) {
      console.error("Referral check error:", err);
      setIsValid(false);
    } finally {
      setReferralLoading(false);
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=state",
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

  const handleSignUp = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);
    if (
      !firstName ||
      !email ||
      !phone ||
      !selectedState ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill out all required fields.",
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          contact_no: phone,
          state_id: selectedState,
          district_id: selectedDistrict,
          subdis_id: selectedSubDistrict,
          referral_code: referral,
          password: password,
          role: "user",
          type: "registration",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;

      if (data.status === "success") {
        router.push({
          pathname: "/(auth)/otp",
          params: {
            email: email,
            otp: data.otp,
            role: "user",
            regId: data.data.reg_id,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            password: password,
            selectedState,
          },
        });
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;

        // 👇 SAME AS LOGIN FLOW
        if (data?.is_verified === 0) {
          Toast.show({
            type: "info",
            text1: "Account not verified",
            text2: "OTP sent. Please verify your account.",
            position: "top",
          });

          router.push({
            pathname: "/(auth)/otp",
            params: {
              otp: data.otp,
              regId: data.reg_id,
              contact_no: data.contact_no,
              email: email,
              firstName,
              lastName,
              password,
              selectedState,
            },
          });
          return;
        }

        // other errors
        Toast.show({
          type: "error",
          text1: data?.message || "Registration failed",
          position: "top",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Network error",
          text2: "Please try again later",
          position: "top",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (referral) {
        checkReferral(referral);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [referral]);

  const handleStateChange = async (stateId: string) => {
    setSelectedState(stateId);
    setSelectedDistrict("");
    setSelectedSubDistrict("");
    setDistrict([]);
    setSubDistrict([]);

    try {
      const response = await axios.get(
        `https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=district&state_id=${stateId}`,
      );

      if (response.data && Array.isArray(response.data.data)) {
        setDistrict(response.data.data);
      }
    } catch (error) {
      console.error("District fetch error:", error);
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedSubDistrict("");
    setSubDistrict([]);

    try {
      const response = await axios.get(
        `https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=sub_district&district_id=${districtId}`,
      );

      if (response.data && Array.isArray(response.data.data)) {
        setSubDistrict(response.data.data);
      }
    } catch (error) {
      console.error("Sub-district fetch error:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust as needed
      >
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
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  First Name <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor="#555"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer2}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor="#555"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                />
              </View>
            </View>
            {/* Email */}
            <Text style={styles.label}>
              Email Address <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <Text style={styles.label}>
              Phone Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.phoneRow}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text>+91</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#555"
                value={phone}
                onChangeText={(text) => {
                  // 🔥 only numbers + max 10 digits
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setPhone(cleaned.slice(0, 10));
                }}
                style={[
                  styles.input,
                  { flex: 1, marginLeft: 8, marginTop: 10, color: "black" },
                ]}
                keyboardType="numeric"
              />
            </View>
            {/* State Picker */}
            <Text style={styles.label}>
              State <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedState}
                // onValueChange={(itemValue) => setSelectedState(itemValue)}
                onValueChange={(itemValue) => handleStateChange(itemValue)}
              >
                <Picker.Item label="--Select State--" value="" />
                {states.map((st) => (
                  <Picker.Item
                    key={st.id}
                    label={st?.state_name}
                    value={st?.id}
                    color="black"
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>District</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDistrict}
                //onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                onValueChange={(itemValue) => handleDistrictChange(itemValue)}
              >
                <Picker.Item label="--Select District--" value="" />
                {district.map((st) => (
                  <Picker.Item
                    key={st.district_id}
                    label={st?.district_name}
                    value={st?.district_id}
                    color="black"
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Sub-district</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSubDistrict}
                onValueChange={(itemValue) => setSelectedSubDistrict(itemValue)}
              >
                <Picker.Item label="--Select Sub-district--" value="" />
                {subDistrict.map((st) => (
                  <Picker.Item
                    key={st.subdis_id}
                    label={st?.subdis_name}
                    value={st?.subdis_id}
                    color="black"
                  />
                ))}
              </Picker>
            </View>
            {/* Referral */}
            <Text>Referral Code</Text>
            <TextInput
              placeholder="Referral Code"
              placeholderTextColor="#555"
              value={referral}
              onChangeText={(text) => {
                setReferral(text.toUpperCase()); // 🔥 auto uppercase
                setIsValid(null);
              }}
              onBlur={() => checkReferral(referral)}
              style={styles.input}
            />
            {referralloading && (
              <Text style={{ color: "#999", marginBottom: 10 }}>
                Checking...
              </Text>
            )}
            {isValid === true && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "green" }}>Valid Code</Text>

                <Text
                  style={{ color: "#002B5B", fontWeight: "600", marginTop: 3 }}
                >
                  Referred By: {referralName}
                </Text>
              </View>
            )}
            {isValid === false && (
              <Text style={{ color: "red", marginBottom: 20 }}>
                Invalid Code
              </Text>
            )}
            {/* Password */}
            <Text>
              Password <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.passwordBox}>
              <TextInput
                placeholder="Set Password"
                placeholderTextColor="#555"
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
            <Text>
              Confirm Password <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.passwordBox}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#555"
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
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Text style={styles.signUpText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.footerText}>
              By signing up, agree to the{" "}
              <Text
                style={styles.link}
                onPress={() => router.push("/(components)/termsOfUse")}
              >
                Terms Of Use
              </Text>{" "}
              and{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  router.push("/(components)/dataDeletetionPolicy")
                }
              >
                Data Deletion Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#002B5B",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    //marginTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 10,
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
    fontSize: 20,
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
    color: "black",
  },
  inputContainer: {
    flex: 1,
    marginRight: 4,
  },
  inputContainer2: {
    flex: 1,
    marginLeft: 4,
  },

  label: {
    marginBottom: 5,
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
