import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import Board from "../screens/Board";
import Map from "../screens/Map";
import ChatList from "../screens/ChatList";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Board") iconName = "reader-outline";
          else if (route.name === "Map") iconName = "map-outline";
          else if (route.name === "ChatList")
            iconName = "chatbubble-ellipses-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: "홈" }} />
      <Tab.Screen
        name="Board"
        component={Board}
        options={{ title: "게시판" }}
      />
      <Tab.Screen name="Map" component={Map} options={{ title: "지도" }} />
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{ title: "채팅" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "프로필" }}
      />
    </Tab.Navigator>
  );
}
