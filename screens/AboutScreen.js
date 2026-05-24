import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import { colors } from '../constants/colors';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header
        titulo="Scene"
        subtitulo="Seu universo de entretenimento."
      />

      <View style={styles.card}>
        <Text style={styles.titulo}>Ideia do projeto</Text>
        <Text style={styles.texto}>
          O Scene nasceu para ser o lugar onde você encontra o que quer ver,
          guarda o que ficou para depois e marca o que já entrou para a sua
          coleção.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Recursos usados</Text>
        <Text style={styles.texto}>
          O app combina React Native, Expo, navegação por Drawer e Tabs, a API do
          TMDB e um banco local SQLite para salvar sua organização.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Identidade</Text>
        <Text style={styles.texto}>
          A estética mistura cinema, streaming e uma atmosfera espacial minimalista,
          com fundo escuro, pôsteres grandes e brilho roxo bem discreto.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  titulo: {
    color: colors.texto,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  texto: {
    color: colors.textoSecundario,
    fontSize: 15,
    lineHeight: 23,
  },
});
