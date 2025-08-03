import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Register from "../screens/Register";
import IdpwFind from "../screens/IdpwFind";
import Preference from "../screens/Preference";
import MainTabs from "./MainTabs";
import MatchDetail from "../screens/MatchDetail";
import ChatList from "../screens/ChatList";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="IdpwFind" component={IdpwFind} />
        <Stack.Screen name="Preference" component={Preference} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="MatchDetail" component={MatchDetail} />
        <Stack.Screen name="ChatList" component={ChatList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
