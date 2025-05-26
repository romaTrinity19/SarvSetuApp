import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const OtpScreen = () => {
  const { otp, role, regId, firstName, lastName, password, email, phone } =
    useLocalSearchParams();
  const [otpInput, setOtpInput] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);
  

  // useEffect(() => {
  //   if (otp && typeof otp === "string") {
  //     const digits = otp.split("").slice(0, 6);
  //     setOtpInput(digits);
       
  //   }
  // }, [otp]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otpInput];
      newOtp[index] = text;
      setOtpInput(newOtp);

      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOtp = [...otpInput];
      newOtp[index] = "";
      setOtpInput(newOtp);
    }
  };
console.log('regIddddddddd', regId)

  // const handleSubmit = async () => {
  //   const enteredOtp = otpInput.join("");

  //   if (enteredOtp !== otp) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Invalid OTP",
  //       text2: "Please enter the correct OTP.",
  //       position: "top",
  //     });
  //     return;
  //   }

  //   try {
  //     const normalizedRole = Array.isArray(role) ? role[0] : role;
 
  //     router.push("/(main)/Home");
  //   } catch (error) {
  //     console.log("Error saving role:", error);
  //   }
  // };

const handleSubmit = async () => {
  if (loading) return; // Prevent double submission
    setLoading(true);
  const enteredOtp = otpInput.join("");

  if (enteredOtp !== otp) {
    Toast.show({
      type: "error",
      text1: "Invalid OTP",
      text2: "Please enter the correct OTP.",
      position: "top",
    });
    return;
  }

  try {
    const response = await axios.post(
      "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
      {
        type: "update_verification",
        reg_id: regId, // Make sure regId is a string or number
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("RAW response:", response);
    console.log("Parsed response.data:", response.data);

    if (response.data && response.data.status === "success") {

      const userData = {
        regId,
        role,
        firstName,
        lastName,
        email,
        phone,
        password,
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      Toast.show({
        type: "success",
        text1: "Verification Successful",
        text2: response.data.message || "User Registered Successfully",
        position: "top",
      });
      router.push("/(auth)/login");
    } else {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: response.data.message || "Please try again.",
        position: "top",
      });
    }
  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: error?.response?.data?.message || "Please try again.",
      position: "top",
    });
  }finally {
    setLoading(false); // Reset loading regardless of outcome
  }
};



  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={styles.subtitle}>
        OTP sent to your WhatsApp and Email.
        </Text>
        <View style={styles.otpContainer}>
          {otpInput.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: TextInput | null) => {
                inputs.current[index] = ref;
              }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              autoFocus={index === 0}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
           {loading ? <ActivityIndicator size="large" color="#fff" />: <Text style={styles.buttonText}>Verify</Text> }  
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
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
