import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const TermsOfUseScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
       <StatusBar barStyle="dark-content" backgroundColor="#fff" />  
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Terms Of Use</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.updatedText}>Last updated on 12/12/2023 at 11:11:03</Text>

        <Text style={styles.paragraph}>
          These Terms and Conditions, along with privacy policy (collectively, the "Terms") constitute a binding agreement...
        </Text>

        <Text style={styles.paragraph}>
          governed by and between ACORE TECHNOLOGY Services (called, “Website Owner” or "we" or "our" or "us") and you.
        </Text>

        <Text style={styles.paragraph}>
          “You” and “your” (or “user”) shall relate to your use, access and/or registration of our services, including this application/website (collectively, “Services”).
        </Text>

        <Text style={styles.paragraph}>
          By using our website and availing the Services, the Terms are immediately accepted by you.
        </Text>

        <Text style={styles.paragraph}>
          (including the Privacy Policy). We reserve the right to modify these Terms at any time without notice.
        </Text>

        <Text style={styles.paragraph}>
          By engaging our services, it is your responsibility to periodically review these Terms to stay informed of updates.
        </Text>

        <Text style={styles.paragraph}>
          The use of this website or availing of our Services indicates your acceptance of these Terms.
        </Text>

        <Text style={styles.paragraph}>
          To access some of the Services, you agree to provide basic information during registration.
        </Text>

        <Text style={styles.paragraph}>
          You are responsible for all actions taken through the use of your registered account.
        </Text>

        <Text style={styles.paragraph}>
          Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness...
        </Text>

        <Text style={styles.paragraph}>
          performance, completeness or suitability of the information and materials offered on this website...
        </Text>

        <Text style={styles.paragraph}>
          or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors...
        </Text>

        <Text style={styles.paragraph}>
          and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
        </Text>

        <Text style={styles.paragraph}>
          Your use of our Services are at your sole risk and we do not claim its distribution. You must use it for non-derogatory reasons and ensure respect for intellectual property.
        </Text>

        <Text style={styles.paragraph}>
          The contents of the Website and the Services are proprietary to Us. You shall not misuse any content or copy unless permitted legally or in writing...
        </Text>

        <Text style={styles.paragraph}>
          from Us, or through written contracts.
        </Text>

        <Text style={styles.paragraph}>
          You acknowledge that unauthorized use of the Website or the Services may lead to action against you...
        </Text>

        <Text style={styles.paragraph}>
          as per the laws or regulations in force.
        </Text>

        <Text style={styles.paragraph}>
          You agree to pay the charges associated with availing the Services.
        </Text>

        <Text style={styles.paragraph}>
          You agree not to use the website and or Services for any purpose that is unlawful. Illegal facilitation is liable for action, in relation to local laws that might apply to you.
        </Text>

        <Text style={styles.paragraph}>
          You agree and acknowledge that website and the Services may contain links to other third-party websites.
        </Text>

        <Text style={styles.paragraph}>
          We disclaim the privacy links; you will be governed by the terms of use, privacy policy and such other policies of such third-party websites.
        </Text>

        <Text style={styles.paragraph}>
          You undertake that upon registering, creating and logging into the Services, you are legally binding and accountable contract with the use of the Services.
        </Text>

        <Text style={styles.paragraph}>
          You shall be entitled to claim a refund at the present rate only in case of service inability to provide the Service. The timeline of the refund shall be settled according to our discretion.
        </Text>

        <Text style={styles.paragraph}>
          Services are provided as written in the application, based on your declared plans registration. In case you need a raise ticket with regard to refund please write to us at our contact page or support.
        </Text>

        <Text style={styles.paragraph}>
          Notwithstanding anything contained in the Terms the parties shall not be liable for any failure...
        </Text>

        <Text style={styles.paragraph}>
          performance or delay/absence that arises from performance as prevented or delayed by a force majeure event.
        </Text>

        <Text style={styles.paragraph}>
          These Terms and any dispute or claim including if it is non-contractual, shall be governed and construed...
        </Text>

        <Text style={styles.paragraph}>
          in accordance with the laws of India.
        </Text>

        <Text style={styles.paragraph}>
          All disputes arising out of these Terms will be subject to the exclusive jurisdiction of the courts in Nashik, Maharashtra India.
        </Text>

        <Text style={styles.paragraph}>
          All concerns or communication relating to the Terms must be communicated to us using contact information provided on the website.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingTop:35
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  updatedText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#000",
    marginBottom: 12,
    lineHeight: 20,
  },
});

export default TermsOfUseScreen;
