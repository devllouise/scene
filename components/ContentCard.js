import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { IMG_URL } from '../services/tmdb';
import { appLogo } from '../constants/branding';

export default function ContentCard({ item, onPress, largura = 145 }) {
  const titulo = item.title || item.name || item.titulo;
  const imagem = item.poster_path ? `${IMG_URL}${item.poster_path}` : item.imagem;
  const nota = item.vote_average || item.nota || 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width: largura }, pressed && styles.pressionado]}
    >
      {imagem ? (
        <Image source={{ uri: imagem }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.semImagem]}>
          <Image source={appLogo} style={styles.semImagemLogo} resizeMode="contain" />
        </View>
      )}
      <View style={styles.overlay} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.titulo}>{titulo || 'Sem título'}</Text>
        <Text style={styles.nota}>★ {Number(nota).toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borda,
  },
  pressionado: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  poster: {
    width: '100%',
    height: 215,
    backgroundColor: colors.borda,
  },
  semImagem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  semImagemLogo: {
    width: 86,
    height: 26,
    opacity: 0.72,
  },
  info: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  titulo: {
    color: colors.texto,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 38,
  },
  nota: {
    color: colors.azul,
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
  },
});