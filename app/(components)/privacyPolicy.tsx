import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PrivacyPolicyScreen = () => {
  const email = "noreply@adbis.com";

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingLeft: 10,
          paddingVertical: 20,
          borderBottomWidth: 2,
          borderColor: "#eee",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.container2}>
        <Text style={styles.subHeader}>Introduction</Text>
        <Text style={styles.text}>
          We value your privacy and are committed to safeguarding your
          information. This Privacy Policy outlines how we collect, use, and
          protect your data when you use our app, including features for sharing
          posts, earning rewards, participating in referral program, and
          purchasing products in the eCommerce section.
        </Text>

        <Text style={styles.subHeader}>1. Information We Collect</Text>
        <Text style={styles.boldText}>1.1 Personal Information</Text>
        <Text style={styles.text}>We may collect the following:</Text>
        <Text style={styles.listItem}>
          - Name, email address, and phone number during registration.
        </Text>
        <Text style={styles.listItem}>
          - Delivery address and payment details for purchases.
        </Text>

        <Text style={styles.boldText}>1.2 Activity Data</Text>
        <Text style={styles.listItem}>
          - Posts shared to WhatsApp stories and uploaded screenshots.
        </Text>
        <Text style={styles.listItem}>
          - Views and engagement metrics for rewards.
        </Text>
        <Text style={styles.listItem}>
          - Products purchased or referred to others.
        </Text>
        <Text style={styles.listItem}>- Referral program progress.</Text>

        <Text style={styles.boldText}>1.3 Device and Usage Information</Text>
        <Text style={styles.listItem}>
          - Device type, operating system, and IP address.
        </Text>
        <Text style={styles.listItem}>
          - App usage data and browsing behavior.
        </Text>

        <Text style={styles.subHeader}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect for the following purposes:
        </Text>
        <Text style={styles.listItem}>
          - Rewards and Referrals: To track and validate rewards for shared
          posts and referrals.
        </Text>
        <Text style={styles.listItem}>
          - eCommerce Transactions: To process purchases, manage orders, and
          handle delivery.
        </Text>
        <Text style={styles.listItem}>
          - Personalization: To enhance app functionality and tailor content to
          your preferences.
        </Text>
        <Text style={styles.listItem}>
          - Communication: To send updates, promotions, and notifications.
        </Text>
        <Text style={styles.listItem}>
          - Security: To protect against fraudulent activities and ensure app
          security.
        </Text>

        <Text style={styles.subHeader}>3. Sharing Your Information</Text>
        <Text style={styles.text}>
          We do not sell your data. Your information may be shared only under
          these circumstances:
        </Text>
        <Text style={styles.listItem}>
          - Service Providers: With trusted partners for payment processing,
          shipping, or analytics.
        </Text>
        <Text style={styles.listItem}>
          - Legal Requirements: If required to comply with laws or regulations.
        </Text>
        <Text style={styles.listItem}>
          - Referrals: With your consent, referral progress may be visible to
          those in your network.
        </Text>

        <Text style={styles.subHeader}>4. How We Protect Your Data</Text>
        <Text style={styles.text}>
          We use industry-standard encryption and secure servers to protect your
          personal information. Access is restricted to authorized personnel,
          and we regularly review our security practices.
        </Text>

        <Text style={styles.subHeader}>5. Your Rights and Choices</Text>
        <Text style={styles.listItem}>
          - Access and Updates: You can view or update your personal details
          within the app.
        </Text>
        <Text style={styles.listItem}>
          - Opt-Out: Decline promotional messages or restrict data sharing via
          app settings.
        </Text>
        <Text style={styles.listItem}>
          - Account Deletion: Request data deletion or account closure at any
          time.
        </Text>

        <Text style={styles.subHeader}>6. eCommerce Policies</Text>
        <Text style={styles.listItem}>
          - Purchases: When you buy a product, we collect and store necessary
          details to fulfill your order.
        </Text>
        <Text style={styles.listItem}>
          - Referral Earning: Earnings from referred product purchases are
          tracked and displayed in your account.
        </Text>
        <Text style={styles.listItem}>
          - Returns and Refunds: Refer to the app’s Terms of Service for
          detailed policies on product returns and refunds.
        </Text>

        <Text style={styles.subHeader}>7. Third-Party Services</Text>
        <Text style={styles.text}>
          The app may use third-party services for payment processing,
          analytics, or hosting. These providers have their own privacy
          policies, which we encourage you to review.
        </Text>

        <Text style={styles.subHeader}>8. Updates to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy to reflect changes in the app’s
          features or legal requirements. You will be notified of significant
          updates.
        </Text>

        <Text style={styles.subHeader}>9. Contact Us</Text>
        <Text style={styles.text}>
          For questions or concerns, please reach out to us:
        </Text>
        <Text style={styles.email}>Email: {email}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  container2: {
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "600",
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    marginBottom: 6,
  },
  email: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 6,
  },
});

export default PrivacyPolicyScreen;
