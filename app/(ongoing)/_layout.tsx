import { Stack } from 'expo-router';

export default function OngoingLayout() {
  return (
    <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }} />
  );
}
