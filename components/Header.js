import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { appLogo } from '../constants/branding';

export default function Header({ titulo, subtitulo }) {
  return (
    <View style={styles.container}>
      <Image source={appLogo} style={styles.marca} resizeMode="contain" />
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  marca: {
    width: 100,
    height: 50,
    marginBottom: 14,
  },
  titulo: {
    color: colors.texto,
    fontSize: 27,
    fontWeight: '700',
  },
  subtitulo: {
    color: colors.textoSecundario,
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
});
