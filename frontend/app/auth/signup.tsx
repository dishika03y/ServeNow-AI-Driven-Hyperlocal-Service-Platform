import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import InputField from "../../src/components/ui/InputField";
import API from "@/src/api/api";

export default function SignupScreen() {

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {

    if (!fullName || !phone || !email || !password || !city || !pincode) {
      setError("All fields required");
      return;
    }

    try {

      setError("");

      console.log("Signup request sending...");

      const response = await API.post("/auth/register", {
        fullName,
        phone,
        email,
        password,
        city,
        pincode,
      });

      console.log("Signup Success:", response.data);

    } catch (err: any) {

      console.log("Signup Error:", err?.response?.data);

      setError(
        err?.response?.data?.detail ||
        "Signup failed"
      );
    }
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <InputField placeholder="Full Name" value={fullName} onChangeText={setFullName}/>
        <InputField placeholder="Phone Number" value={phone} onChangeText={setPhone}/>
        <InputField placeholder="Email" value={email} onChangeText={setEmail}/>
        <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
        <InputField placeholder="City" value={city} onChangeText={setCity}/>
        <InputField placeholder="Pincode" value={pincode} onChangeText={setPincode}/>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    padding:20,
    backgroundColor:"#E0F2FE"
  },
  card:{
    backgroundColor:"#fff",
    padding:24,
    borderRadius:20,
    elevation:6
  },
  title:{
    fontSize:22,
    fontWeight:"700",
    marginBottom:20
  },
  button:{
    backgroundColor:"#0A2540",
    padding:16,
    borderRadius:14,
    marginTop:10
  },
  buttonText:{
    color:"#fff",
    textAlign:"center"
  },
  error:{
    color:"red",
    marginTop:10
  }
});