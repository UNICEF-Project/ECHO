import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
          marginTop: 30,
        }}
      >
        <View style={{ alignItems: "center", padding: 50, marginBottom: 50 }}>
          <Text>area for image</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={{ marginBottom: 10 }}>
            Login to your existing account
          </Text>
          <View style={styles.input}>
              <Icon name="email-outline" size={20} color="#900" />
              <TextInput
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialLoginButton}>
              <Text style={styles.socialLoginButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLoginButton}>
              <Text style={styles.socialLoginButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0052CF",
    padding: 10,
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#AAAAAA",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderWidth: 1.5,
  },
  forgotPasswordText: {
    textAlign: "right",
    marginBottom: 10,
    color: "black",
    marginLeft: 150,
  },
  loginButton: {
    backgroundColor: "#800000",
    padding: 15,
    borderRadius: 30,
    width: "50%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
  },
  socialLoginContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
  socialLoginButton: {
    backgroundColor: "#ddd",
    width: "40%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  socialLoginButtonText: {
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: "black",
  },
  signupText: {
    color: "#0052CF",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginPage;
