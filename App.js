import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { FeesProvider } from './src/context/FeesContext';
import { CbtProvider } from './src/context/CbtContext';
import { PickupProvider } from './src/context/PickupContext';
import { AssignmentsProvider } from './src/context/AssignmentsContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FeesProvider>
          <CbtProvider>
            <PickupProvider>
              <AssignmentsProvider>
                <RootNavigator />
              </AssignmentsProvider>
            </PickupProvider>
          </CbtProvider>
        </FeesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
