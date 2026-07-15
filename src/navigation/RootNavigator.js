import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import ParentNavigator from './ParentNavigator';
import TeacherNavigator from './TeacherNavigator';
import AuthorityNavigator from './AuthorityNavigator';
import AdminNavigator from './AdminNavigator';
import BirthdayCelebration from '../components/BirthdayCelebration';

const ROLE_NAVIGATORS = {
  student: StudentNavigator,
  parent: ParentNavigator,
  teacher: TeacherNavigator,
  authority: AuthorityNavigator,
  admin: AdminNavigator,
};

export default function RootNavigator() {
  const { user } = useAuth();
  const MainNav = user ? ROLE_NAVIGATORS[user.role] : null;

  return (
    <NavigationContainer>
      {user && MainNav ? <MainNav /> : <AuthNavigator />}
      {user && <BirthdayCelebration />}
    </NavigationContainer>
  );
}
