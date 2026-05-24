import React from 'react';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { appLogo } from '../constants/branding';

import TabRoutes from './TabRoutes';
import FavoritesScreen from '../screens/FavoritesScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import WatchedScreen from '../screens/WatchedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';

const Drawer = createDrawerNavigator();

function DrawerConteudo(props) {
  const inicial = (props.nomeUsuario || 'U').charAt(0).toUpperCase();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>

      <View style={styles.drawerGlow} />

      <View style={styles.logoFaixa}>
        <Image source={appLogo} style={styles.logo} resizeMode="contain" />
      </View>

      <Pressable
        onPress={() => props.navigation.navigate('PerfilDrawer')}
        style={({ pressed }) => [styles.perfil, pressed && styles.pressionado]}
      >

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>

        <Text style={styles.nome}>{props.nomeUsuario}</Text>
        <Text style={styles.frase}>Seu universo pessoal</Text>
      </Pressable>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function drawerIcon(nome) {
  const mapa = {
    InicioDrawer: 'home-outline',
    Favoritos: 'heart-outline',
    MinhaLista: 'bookmark-outline',
    Assistidos: 'checkmark-done-outline',
    Sobre: 'information-circle-outline',
  };

  return mapa[nome] || 'ellipse-outline';
}

export default function DrawerRoutes({ nomeUsuario }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerConteudo {...props} nomeUsuario={nomeUsuario} />}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.fundo,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.texto,
        headerTitleStyle: {
          fontWeight: '800',
        },
        drawerStyle: {
          backgroundColor: colors.card,
          width: 280,
        },
        drawerActiveTintColor: colors.texto,
        drawerInactiveTintColor: colors.textoSecundario,
        drawerActiveBackgroundColor: colors.roxo,
        sceneContainerStyle: {
          backgroundColor: colors.fundo,
        },

        drawerIcon: ({ color, size }) => (
          <Ionicons name={drawerIcon(route.name)} size={size} color={color} />
        ),
      })}
    >

      <Drawer.Screen name="InicioDrawer" options={{ title: 'Início' }}>
        {(props) => <TabRoutes {...props} nomeUsuario={nomeUsuario} />}
      </Drawer.Screen>

      <Drawer.Screen name="Favoritos" component={FavoritesScreen} />
      <Drawer.Screen name="MinhaLista" component={WatchlistScreen} options={{ title: 'Minha Lista' }} />
      <Drawer.Screen name="Assistidos" component={WatchedScreen} />

      <Drawer.Screen
        name="PerfilDrawer"
        options={{
          title: 'Perfil',
          drawerItemStyle: { display: 'none' },
        }}
      >
        {(props) => <ProfileScreen {...props} nomeUsuario={nomeUsuario} />}
      </Drawer.Screen>

      <Drawer.Screen name="Sobre" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: colors.fundo,
  },

  drawerGlow: {
    position: 'absolute',
    top: -80,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.roxo,
    opacity: 0.14,
  },

  logoFaixa: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  logo: {
    width: 86,
    height: 26,
    opacity: 0.92,
  },

  perfil: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
    marginBottom: 10,
    alignItems: 'center',
  },
  pressionado: {
    opacity: 0.72,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.roxo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  avatarTexto: {
    color: colors.texto,
    fontSize: 24,
    fontWeight: '800',
  },
  nome: {
    color: colors.texto,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  frase: {
    color: colors.textoSecundario,
    marginTop: 4,
    textAlign: 'center',
  },
});
