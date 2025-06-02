import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
 import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactUs = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = () => {
  //   // Handle submit logic here
  //   console.log({ fullName, email, phone, subject, message });
  // };


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
  formData.append("type", "contact_us");

  try {
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
        text1: "Message sent successfully.",
        position: "top",
      });
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
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



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
              Get in touch with us for support, feedback, or inquiries—just a
              tap away!
            </Text>
          </View>

          <View style={{ padding: 18, backgroundColor: "#fff" }}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
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
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Subject"
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
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
    </SafeAreaView>
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
