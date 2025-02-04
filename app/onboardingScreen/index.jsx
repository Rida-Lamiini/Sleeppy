import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../utils/supabaseClient";
import { onboardingSteps } from "../../utils/onboardingSteps";
import OnboardingStep from "../../components/OnboardingStep";

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [session, setSession] = useState(null);

  // Fetch the user session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        Alert.alert(
          "Error",
          "Unable to fetch user session. Please log in again."
        );
        router.replace("/login"); // Redirect to login if session is missing
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, []);

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveOnboardingData();
    }
  };

  const handleSaveOnboardingData = async () => {
    if (!session) {
      Alert.alert("Error", "No user session found. Please log in again.");
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      // Transform the onboardingData object to match the table schema
      const transformedData = {
        name: onboardingData["1"], // Map "1" to "name"
        goals: onboardingData["2"], // Map "2" to "goals"
        challenges: onboardingData["3"], // Map "3" to "challenges"
        sleep_knowledge: onboardingData["4"], // Map "4" to "sleep_knowledge"
      };

      // Log the transformed data before saving
      console.log("Transformed Onboarding Data:", transformedData);

      // Save onboarding data to Supabase
      const { error } = await supabase
        .from("user_profiles")
        .insert([{ user_id: session.user.id, ...transformedData }]);

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Onboarding completed successfully!");
      router.replace("/"); // Redirect to home screen after onboarding
    } catch (error) {
      console.error("Error saving onboarding data:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backText}>Return</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Let's get to know you better</Text>
      </View>

      {/* Onboarding Form */}
      <ScrollView style={styles.form}>
        <Text style={styles.stepQuestion}>
          {onboardingSteps[currentStep].question}
        </Text>
        <OnboardingStep
          step={onboardingSteps[currentStep]}
          onboardingData={onboardingData}
          setOnboardingData={setOnboardingData}
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1b1e",
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  backText: {
    color: "#fff",
    marginLeft: 5,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  form: {
    flex: 1,
  },
  stepQuestion: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
