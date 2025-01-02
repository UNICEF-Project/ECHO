import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

/*
MUST READ:
    - sample checks have been commented below to replicate
    - proper check for phone is not present. The current check only ensures field is not empty
    - the haserrors on line 34 must be replicated for all fields instead of global one
    - The create button will be disabled until all errors are fixed. This needs to be changed
      as it should give a prompt to fix all entries when pressed.
*/

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState(null);

  //sample check
  const [email, setEmail] = useState("");
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [emailError, setEmailError] = useState(null);
  //check ended

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);

  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpassError, setCpassError] = useState(null);

  const [hasErrors, setHasErrors] = useState(true);

  //sample check
  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text) {
      setEmailError("Please enter email address");
      setHasErrors(true);
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email address");
      setHasErrors(true);
    } else {
      setEmailError(null);
      setHasErrors(false);
    }
  };

  const handleNameChange = (text) => {
    setFullName(text);
    if (!text) {
      setNameError("Please enter your name");
      setHasErrors(true);
    } else {
      setNameError(null);
      setHasErrors(false);
    }
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
    if (!text) {
      setPhoneError("Please enter your phone number");
      setHasErrors(true);
    } else {
      setPhoneError(null);
      setHasErrors(false);
    }
  };

  const handlePassChange = (text) => {
    setPassword(text);
    if (!text) {
      setPassError("Please enter your password");
      setHasErrors(true);
    } else {
      setPassError(null);
      setHasErrors(false);
    }
    if (text != confirmPassword && confirmPassword) {
      setCpassError("passwords do not match");
      setHasErrors(true);
    } else if (text == confirmPassword) {
      setCpassError(null);
      setHasErrors(false);
    }
  };

  const handleCpassChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setCpassError("Please re-enter your password");
      setHasErrors(true);
    } else if (text != password) {
      setCpassError("Passwords do not match");
      setHasErrors(true);
    } else {
      setCpassError(null);
      setHasErrors(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
          marginTop: 30,
        }}
      >
        <View style={styles.title}>
          <Text style={styles.title}>Let's Get Started!</Text>
          <Text style={{ marginBottom: 20 }}>
            Create an account to avail all features!
          </Text>
        </View>

        <View style={styles.container}>
          {nameError && (
            <Text style={{ color: "red", paddingHorizontal: 5 }}>
              {nameError}
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={handleNameChange}
          />
          {phoneError && (
            <Text style={{ color: "red", paddingHorizontal: 5 }}>
              {phoneError}
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={handlePhoneChange}
          />

          {emailError && (
            <Text style={{ color: "red", paddingHorizontal: 5 }}>
              {emailError}
            </Text>
          )}
          <TextInput //sample check + line above
            style={styles.input}
            placeholder="Email"
            onChangeText={handleEmailChange}
            value={email}
          />

          {passError && (
            <Text style={{ color: "red", paddingHorizontal: 5 }}>
              {passError}
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={handlePassChange}
            secureTextEntry={true}
            //borderColor = 'red'
          />
          {cpassError && (
            <Text style={{ color: "red", paddingHorizontal: 5 }}>
              {cpassError}
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={handleCpassChange}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.buttonview}>
          <TouchableOpacity style={styles.button} disabled={hasErrors}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    alignItems: "center",
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#0052CF",
    borderWidth: 1,
    marginVertical: 10,
    marginBottom: 20,
    padding: 10,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#AAAAAA",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderWidth: 1.5,
  },
  button: {
    backgroundColor: "#0052CF",
    padding: 15,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonview: {
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70,
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

export default Register;
