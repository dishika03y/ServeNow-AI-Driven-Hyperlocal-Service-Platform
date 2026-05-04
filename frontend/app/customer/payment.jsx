import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const NAVY = "#081F5C";
const CREAM = "#F7F2EB";
const WHITE = "#FFFFFF";

export default function PaymentScreen() {
  const { service, worker, price } = useLocalSearchParams();

  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // form → processing

  // fake transaction id
  const generateTxn = () => "TXN" + Math.floor(100000 + Math.random() * 900000);

  const handlePay = () => {
    if (!card || !name) {
      Alert.alert("Missing Details", "Please fill all fields");
      return;
    }

    if (card.length < 12) {
      Alert.alert("Invalid Card", "Card number seems incorrect");
      return;
    }

    setLoading(true);
    setStep("processing");

    // 🔥 fake payment gateway delay
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate

      setLoading(false);

      if (success) {
        const txn = generateTxn();

        router.replace({
          pathname: "/customer/booking-success",
          params: {
            serviceName: service,
            worker,
            price,
            txn,
          },
        });
      } else {
        Alert.alert(
          "Payment Failed ❌",
          "Transaction declined by bank. Try again.",
        );
        setStep("form");
      }
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Payment</Text>

      <Text style={styles.sub}>
        {service} • ₹{price}
      </Text>

      {step === "processing" ? (
        <View style={styles.processingBox}>
          <ActivityIndicator size="large" color={NAVY} />
          <Text style={styles.processingText}>
            Processing payment with bank...
          </Text>
          <Text style={styles.small}>Do not close the app</Text>
        </View>
      ) : (
        <>
          <TextInput
            placeholder="Card Number (mock)"
            value={card}
            onChangeText={setCard}
            style={styles.input}
            keyboardType="numeric"
            maxLength={16}
          />

          <TextInput
            placeholder="Card Holder Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <View style={styles.fakeNote}>
            <Text style={styles.fakeNoteText}>
              🔒 This is a secure mock payment gateway
            </Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handlePay}>
            <Text style={styles.btnText}>Pay Securely</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: NAVY,
  },

  sub: {
    marginBottom: 20,
    opacity: 0.6,
    color: NAVY,
  },

  input: {
    borderWidth: 1.2,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: WHITE,
  },

  btn: {
    backgroundColor: NAVY,
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  processingBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: WHITE,
    borderRadius: 16,
  },

  processingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: NAVY,
  },

  small: {
    marginTop: 6,
    fontSize: 11,
    opacity: 0.5,
  },

  fakeNote: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  fakeNoteText: {
    fontSize: 11,
    opacity: 0.5,
    color: NAVY,
  },
});
