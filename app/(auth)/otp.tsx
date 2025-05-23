import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const OtpScreen = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async () => {
  const enteredOtp = otp.join("");
  console.log("Entered OTP:", enteredOtp);

  try {
  const normalizedRole = Array.isArray(role) ? role[0] : role;
    await AsyncStorage.setItem("userRole", normalizedRole);
    router.push("/(main)/Home");
  } catch (error) {
    console.log("Error saving role:", error);
  }
};

   const {
    firstName,
    lastName,
    email,
    phone,
    state,
    role,
    referral,
    password,
  } = useLocalSearchParams();
  console.log(firstName,
    lastName,
    email,
    phone,
    state,
    role,
    referral,
    password,)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={styles.subtitle}>
          A 6-digit verification code was sent to your phone.
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    backgroundColor: "#002B5B",
    paddingBottom: 40,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resendText: {
    textAlign: "center",
    marginTop: 20,
    color: "#1877F2",
    fontWeight: "500",
  },
});
