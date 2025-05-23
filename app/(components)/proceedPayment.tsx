import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OrderConfirmation() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Order Confirmation</Text>
      
      <Ionicons name="checkmark-circle" size={80} color="green" style={styles.icon} />

      <Text style={styles.thankYou}>Thank you for your order</Text>
      <Text style={styles.subtext}>
        We'll get started on that right away. Feel free to reach for returns, questions, or feedback
      </Text>
      <Text style={styles.orderNumber}>Your order number is <Text style={styles.bold}>#100001071</Text></Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.link}>2 Items</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={{display:'flex', flexDirection:'row', alignItems:'center',}}>
             <Ionicons name="home-outline" size={18} />
        <Text style={styles.textBold}> roma Chakradhari</Text>
        </View>
        <Text style={styles.text}>vtv, rfr, Devbhog, Gariaband, Chhattisgarh, India - 493992</Text>
        <Text style={styles.text}>+91 7999559862</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Payment Method</Text>
          <Text style={styles.text}>Cash on Delivery</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Subtotal</Text>
          <Text style={styles.text}>₹ 1397.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Shipping Cost</Text>
          <Text style={styles.text}>Free</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.textBold, styles.total]}>Total</Text>
          <Text style={[styles.textBold, styles.total]}>₹ 1397.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonPrimary}  onPress={()=>router.push('/(components)/orderDetails')}>
        <Text style={styles.buttonText}>View Order Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={()=>router.push('/(main)/Product')}>
        <Text style={styles.buttonTextSecondary}>Back To Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical:40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    alignSelf: 'center',
  },
  thankYou: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  subtext: {
    textAlign: 'center',
    color: '#777',
    marginTop: 6,
    marginHorizontal: 10,
  },
  orderNumber: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  link: {
    color: 'gray',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  textBold: {
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  total: {
    fontSize: 15,
  },
  buttonPrimary: {
    backgroundColor: '#002f6c',
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#000',
    fontWeight: '600',
  },
});
