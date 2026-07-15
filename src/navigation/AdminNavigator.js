import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, TAB_BAR_STYLE } from '../constants/theme';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import ParentDirectoryScreen from '../screens/shared/ParentDirectoryScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import BestStudentsAdminScreen from '../screens/admin/BestStudentsAdminScreen';
import BroadcastScreen from '../screens/authority/BroadcastScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import CalendarScreen from '../screens/parent/CalendarScreen';
import GalleryScreen from '../screens/parent/GalleryScreen';
import PaymentConfirmationsScreen from '../screens/admin/PaymentConfirmationsScreen';
import PickupAlertsScreen from '../screens/shared/PickupAlertsScreen';

const Tab = createBottomTabNavigator();

function makeStack(screens) {
  const S = createNativeStackNavigator();
  return function StackNav() {
    return (
      <S.Navigator screenOptions={{ headerShown: false }}>
        {screens.map(({ name, component }) => (
          <S.Screen key={name} name={name} component={component} />
        ))}
      </S.Navigator>
    );
  };
}

const HomeStackNav = makeStack([
  { name: 'AdminHome', component: AdminHomeScreen },
  { name: 'BestStudentsAdmin', component: BestStudentsAdminScreen },
  { name: 'BroadcastAdmin', component: BroadcastScreen },
  { name: 'ManageParents', component: ParentDirectoryScreen },
  { name: 'Chat', component: ChatScreen },
  { name: 'CalendarAdmin', component: CalendarScreen },
  { name: 'GalleryAdmin', component: GalleryScreen },
  { name: 'PaymentConfirmations', component: PaymentConfirmationsScreen },
  { name: 'PickupAlerts', component: PickupAlertsScreen },
]);

const ParentsStackNav = makeStack([
  { name: 'ParentDirectoryMain', component: ParentDirectoryScreen },
  { name: 'Chat', component: ChatScreen },
]);
const StudentsStackNav = makeStack([{ name: 'StudentsMain', component: BestStudentsAdminScreen }]);
const BroadcastStackNav = makeStack([{ name: 'BroadcastMain', component: BroadcastScreen }]);
const ProfileStackNav = makeStack([
  { name: 'ProfileMain', component: AdminProfileScreen },
  { name: 'NotificationSettings', component: NotificationSettingsScreen },
]);

const TAB_ICONS = {
  Home:      ['home',          'home-outline'],
  Parents:   ['people',        'people-outline'],
  Students:  ['trophy',        'trophy-outline'],
  Broadcast: ['megaphone',     'megaphone-outline'],
  Profile:   ['person',        'person-outline'],
};

export default function AdminNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryMid,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          ...TAB_BAR_STYLE,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, marginTop: 1 },
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = TAB_ICONS[route.name] || ['apps', 'apps-outline'];
          return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNav} />
      <Tab.Screen name="Parents" component={ParentsStackNav} />
      <Tab.Screen name="Students" component={StudentsStackNav} />
      <Tab.Screen name="Broadcast" component={BroadcastStackNav} />
      <Tab.Screen name="Profile" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
