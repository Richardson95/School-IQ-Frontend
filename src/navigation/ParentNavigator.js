import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, TAB_BAR_STYLE } from '../constants/theme';

import ParentHomeScreen from '../screens/parent/ParentHomeScreen';
import WeeklyReportsScreen from '../screens/parent/WeeklyReportsScreen';
import IncidentMessagesScreen from '../screens/parent/IncidentMessagesScreen';
import CalendarScreen from '../screens/parent/CalendarScreen';
import AttendanceScreen from '../screens/parent/AttendanceScreen';
import ReportCardScreen from '../screens/parent/ReportCardScreen';
import FeeTrackerScreen from '../screens/parent/FeeTrackerScreen';
import MakePaymentScreen from '../screens/parent/MakePaymentScreen';
import PracticeCbtScreen from '../screens/parent/PracticeCbtScreen';
import ThirdPartyPickupScreen from '../screens/parent/ThirdPartyPickupScreen';
import GalleryScreen from '../screens/parent/GalleryScreen';
import HealthLogScreen from '../screens/parent/HealthLogScreen';
import ParentProfileScreen from '../screens/parent/ParentProfileScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import PrivacySecurityScreen from '../screens/parent/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';
import TermsPrivacyScreen from '../screens/parent/TermsPrivacyScreen';

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
  { name: 'ParentHome', component: ParentHomeScreen },
  { name: 'Attendance', component: AttendanceScreen },
  { name: 'ReportCard', component: ReportCardScreen },
  { name: 'FeeTracker', component: FeeTrackerScreen },
  { name: 'MakePayment', component: MakePaymentScreen },
  { name: 'Gallery', component: GalleryScreen },
  { name: 'HealthLog', component: HealthLogScreen },
  { name: 'PracticeCbt', component: PracticeCbtScreen },
  { name: 'ThirdPartyPickup', component: ThirdPartyPickupScreen },
]);

const ReportsStackNav = makeStack([
  { name: 'WeeklyReports', component: WeeklyReportsScreen },
  { name: 'IncidentMessages', component: IncidentMessagesScreen },
]);

const CalendarStackNav = makeStack([{ name: 'CalendarMain', component: CalendarScreen }]);
const ProfileStackNav = makeStack([
  { name: 'ProfileMain', component: ParentProfileScreen },
  { name: 'EditProfile', component: EditProfileScreen },
  { name: 'NotificationSettings', component: NotificationSettingsScreen },
  { name: 'PrivacySecurity', component: PrivacySecurityScreen },
  { name: 'HelpSupport', component: HelpSupportScreen },
  { name: 'TermsPrivacy', component: TermsPrivacyScreen },
]);

const TAB_ICONS = {
  Home:     ['home',           'home-outline'],
  Reports:  ['document-text',  'document-text-outline'],
  Calendar: ['calendar',       'calendar-outline'],
  Profile:  ['person',         'person-outline'],
};

export default function ParentNavigator() {
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
      <Tab.Screen name="Reports" component={ReportsStackNav} />
      <Tab.Screen name="Calendar" component={CalendarStackNav} />
      <Tab.Screen name="Profile" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
