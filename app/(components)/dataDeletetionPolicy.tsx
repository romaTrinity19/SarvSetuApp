import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DataDeletionPolicyScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" /> 
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Data Deletion Policy</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionHeader}>1. Introduction</Text>
        <Text style={styles.sectionText}>
          At SARV SETU PRIVATE LIMITED, we value your privacy and are committed to protecting your personal data. This Data Deletion Policy outlines how you can request the deletion of your data and how we handle such requests in compliance with applicable laws and regulations.
        </Text>

        <Text style={styles.sectionHeader}>2. What Personal Data Do We Collect?</Text>
        <Text style={styles.sectionText}>
          We may collect the following types of personal data from our users:
          {"\n\n"}
          - Personal identification information (name, email address, phone number, etc.){"\n"}
          - Usage data (app activity, preferences, etc.){"\n"}
          - Device information (IP address, browser type, operating system, etc.)
        </Text>

        <Text style={styles.sectionHeader}>3. How Long Do We Store Your Data?</Text>
        <Text style={styles.sectionText}>
          We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.
        </Text>

        <Text style={styles.sectionHeader}>4. The Right to Data Deletion</Text>
        <Text style={styles.sectionText}>
          You have the right to request the deletion of your personal data under the following circumstances:
          {"\n\n"}
          - The data is no longer necessary for the purposes it was collected for{" "}
          - You withdraw your consent (where applicable){"\n"}
          - You object to the processing and there are no overriding legitimate grounds{" "}
          - The data has been unlawfully processed
        </Text>

        <Text style={styles.sectionHeader}>5. How to Request Data Deletion</Text>
        <Text style={styles.sectionText}>
          To request the deletion of your personal data, please email us at:
          {"\n\n"}📧 info@sarvsetu.com
        </Text>

        <Text style={styles.sectionHeader}>6. Submit a Request</Text>
        <Text style={styles.sectionText}>
          When submitting a deletion request, please include:
          {"\n\n"}
          - Your full name and contact information{" "}
          - A clear statement that you wish to delete your data{" "}
          - Any specific data or services you wish to be deleted from
        </Text>

        <Text style={styles.sectionHeader}>7. Verification</Text>
        <Text style={styles.sectionText}>
          We may need to verify your identity before processing your request to ensure your data is protected from unauthorized access.
        </Text>

        <Text style={styles.sectionHeader}>8. Processing the Request</Text>
        <Text style={styles.sectionText}>
          Upon verifying your identity, we will respond to your request within 30 days. In certain circumstances, we may need additional time, and we will notify you accordingly.
        </Text>

        <Text style={styles.sectionHeader}>9. Exceptions to Deletion</Text>
        <Text style={styles.sectionText}>
          We may retain certain data despite a deletion request if:
          {"\n\n"}
          - Required by law{" "}
          - Necessary for legal claims, defense, or compliance{" "}
          - Required for financial record-keeping
        </Text>

        <Text style={styles.sectionHeader}>10. How We Safeguard Your Data</Text>
        <Text style={styles.sectionText}>
          We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, disclosure, alteration, and destruction.
        </Text>

        <Text style={styles.sectionHeader}>11. Data Anonymization</Text>
        <Text style={styles.sectionText}>
          In some cases, we may anonymize your data (so it can no longer be associated with you) for research or statistical purposes.
        </Text>

        <Text style={styles.sectionHeader}>12. Impact of Data Deletion</Text>
        <Text style={styles.sectionText}>
          Deleting your data may affect our ability to provide services to you and may result in account termination.
        </Text>

        <Text style={styles.sectionHeader}>13. Changes to This Policy</Text>
        <Text style={styles.sectionText}>
          We may update this Data Deletion Policy from time to time. We encourage you to review it regularly. Changes will be effective once posted on our app or website.
        </Text>

        <Text style={styles.sectionHeader}>14. Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have questions about this policy, contact us at: info@sarvsetu.com
        </Text>

        <Text style={[styles.sectionText, { marginTop: 20 }]}>SARV SETU PRIVATE LIMITED</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default DataDeletionPolicyScreen;
