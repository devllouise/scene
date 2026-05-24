import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import OnboardingScreen from './screens/OnboardingScreen';
import DrawerRoutes from './routes/DrawerRoutes';
import DetailsScreen from './screens/DetailsScreen';
import { criarTabela } from './database/db';

const Stack = createNativeStackNavigator();

export default function App() {
  const [entrou, setEntrou] = useState(false);

  const [nomeUsuario, setNomeUsuario] = useState(' ');

  useEffect(() => {
    criarTabela().catch((erro) => {
      console.log('Erro ao criar tabela', erro);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!entrou ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  nomeUsuario={nomeUsuario}
                  onEntrar={(nome) => {
                    setNomeUsuario(nome || 'Usuário');
                    setEntrou(true);
                  }}
                  onPular={() => {
                    setNomeUsuario('Usuário');
                    setEntrou(true);
                  }}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Principal">
                {(props) => (
                  <DrawerRoutes {...props} nomeUsuario={nomeUsuario} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Detalhes" component={DetailsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
