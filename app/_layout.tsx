import {SplashScreen, Stack} from "expo-router";
import { useFonts} from 'expo-font';
import { useEffect } from "react";

import './globals.css';
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";

Sentry.init({
  dsn: 'https://f6a63a7f4f3f8f1b57ed573cdfa6bc77@o4510082195390464.ingest.us.sentry.io/4510082970615808',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});



export default Sentry.wrap(function RootLayout() {
    const { isLoading, fetchAuthenticatedUser } = useAuthStore ();

    const [fontsLoaded, error] = useFonts({
        "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
        "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
        "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
        "Quicksand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
        "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
    });

    useEffect(() => {
        if(error) throw error;
        if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    useEffect(() => {
         fetchAuthenticatedUser()
    }, []);

    if(!fontsLoaded || isLoading) return null;


  return <Stack screenOptions={{ headerShown: false }} />;
});