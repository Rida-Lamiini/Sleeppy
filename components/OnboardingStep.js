import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const OnboardingStep = ({ step, onboardingData, setOnboardingData }) => {
  switch (step.type) {
    case "text":
      return (
        <TextInput
          style={styles.input}
          placeholder={step.placeholder}
          placeholderTextColor="#666"
          onChangeText={(text) =>
            setOnboardingData({ ...onboardingData, [step.id]: text })
          }
        />
      );
    case "multi-select":
      return (
        <View>
          {step.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                const selectedOptions = onboardingData[step.id] || [];
                if (selectedOptions.includes(option)) {
                  setOnboardingData({
                    ...onboardingData,
                    [step.id]: selectedOptions.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setOnboardingData({
                    ...onboardingData,
                    [step.id]: [...selectedOptions, option],
                  });
                }
              }}
            >
              <Text style={styles.optionText}>
                {onboardingData[step.id]?.includes(option) ? "✓ " : ""}
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#2a2b2e",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#2a2b2e",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OnboardingStep;
