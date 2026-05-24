import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import SeriesScreen from '../screens/SeriesScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

function icone(nome, focado) {
  const mapa = {
    Inicio: focado ? 'home' : 'home-outline',
    Filmes: focado ? 'film' : 'film-outline',
    Series: focado ? 'tv' : 'tv-outline',
    Buscar: focado ? 'search' : 'search-outline',
  };

  return mapa[nome] || 'ellipse-outline';
}

export default function TabRoutes({ nomeUsuario }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.borda,
          height: 72,
          paddingBottom: 11,
          paddingTop: 8,
          marginHorizontal: 12,
          marginBottom: 10,
          borderRadius: 24,
          position: 'absolute',
          borderWidth: 1,
          borderColor: colors.borda,
        },
        tabBarActiveTintColor: colors.roxo,
        tabBarInactiveTintColor: colors.textoSecundario,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },

        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={icone(route.name, focused)} size={21} color={color} />
        ),
      })}
    >

      <Tab.Screen name="Inicio">
        {(props) => <HomeScreen {...props} nomeUsuario={nomeUsuario} />}
      </Tab.Screen>

      <Tab.Screen name="Filmes" component={MoviesScreen} />

      <Tab.Screen name="Series" component={SeriesScreen} options={{ title: 'Séries' }} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
    </Tab.Navigator>
  );
}
