import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ContactUs = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Handle submit logic here
    console.log({ fullName, email, phone, subject, message });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Contact Us</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container1}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <Text style={styles.headerSubtitle}>
            Get in touch with us for support, feedback, or inquiries—just a tap
            away!
          </Text>
        </View>

        <View style={{ padding: 18 , backgroundColor:'#fff'}}>
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  container1: {
    backgroundColor: "#fff",
    paddingBottom:100
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal:14
  },
  backText: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight:'bold'
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
