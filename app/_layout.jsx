import { Stack, useRouter } from "expo-router";
import services from "../utils/services";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    checkUserAuth();
  }, []);

  const router = useRouter();
  const checkUserAuth = async () => {
    try {
      const reset = await services.storeData("login", "false");
      const result = await services.getData("login");
      console.log("User authenticated status:", result);
      if (result !== "true") {
        console.log("User not authenticated, redirecting to login");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error checking user authentication:", error.message);
    }
  };
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboardingScreen" />
      <Stack.Screen name="SetupScreen" />
    </Stack>
  );
}
