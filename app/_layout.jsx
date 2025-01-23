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
      const store = await services.getData("login");
      console.log("rr", store);

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
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="onboardingScreen" options={{ title: "ob" }} />
    </Stack>
  );
}
