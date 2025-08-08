import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Signup from "../screens/Signup";
import IdpwFind from "../screens/IdpwFind";
import Preference from "../screens/Preference";
import MainTabs from "./MainTabs";
import MatchDetail from "../screens/MatchDetail";
import ChatList from "../screens/ChatList";
import ProfileSetup from "../screens/ProfileSetup";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="IdpwFind" component={IdpwFind} />
        <Stack.Screen name="Preference" component={Preference} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="MatchDetail" component={MatchDetail} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
