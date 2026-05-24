import React, { useState } from 'react';

import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { appLogo } from '../constants/branding';

import CustomButton from '../components/CustomButton';

// Recebe o nome inicial, o callback de entrada e o callback de pular
export default function OnboardingScreen({ nomeUsuario, onEntrar, onPular }) {
  const [passo, setPasso] = useState(1);  // Controla qual etapa do onboarding exibir
  const [nome, setNome] = useState(nomeUsuario || ''); // Nome digitado pelo usuário

  // ── PASSO 1: tela de boas-vindas ────────────────────────────────────────────
  if (passo === 1) {
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Elementos decorativos de fundo */}
        <View style={styles.glowMaior} />
        <View style={styles.glowMenor} />
        <View style={styles.anel} />
        <View style={styles.estrelaGrande} />
        <View style={styles.estrelaMedia} />
        <View style={styles.estrelaPequenaUm} />
        <View style={styles.estrelaPequenaDois} />
        <View style={styles.estrelaPequenaTres} />

        {/* Card central com ícone, logo e tagline do app */}
        <View style={styles.banner}>
          <Image source={appLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.bannerTexto}>Seu universo de entretenimento</Text>
        </View>

        {/* Botões de ação: avançar ou pular o onboarding */}
        <View style={styles.acoes}>
          <CustomButton texto="Começar" onPress={() => setPasso(2)} />
          <Pressable onPress={onPular} style={styles.pular}>
            <Text style={styles.pularTexto}>Entrar sem configurar</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // ── PASSO 2: tela de nome do usuário ────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.nomeWrap} showsVerticalScrollIndicator={false}>
        <View style={styles.glow} />

        <View style={styles.cardNome}>
          <View style={styles.topoNome}>
            <Pressable onPress={() => setPasso(1)} style={styles.voltar}>
              <Ionicons name="arrow-back" size={24} color={colors.texto} />
            </Pressable>
          </View>

          <Text style={styles.titulo}>Como podemos te chamar?</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.textoSecundario}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="done"
            blurOnSubmit
            autoFocus
            onSubmitEditing={() => onEntrar(nome.trim())}
          />

          {/* trim() remove espaços extras antes de passar o nome para o App.js */}
          <View style={styles.acao}>
            <CustomButton texto="Entrar no Scene" onPress={() => onEntrar(nome.trim())} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    padding: 24,
    justifyContent: 'center',
  },
  nomeWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Brilhos principais do fundo espacial
  glowMaior: {
    position: 'absolute',
    top: 70,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.roxo,
    opacity: 0.14,
  },

  glowMenor: {
    position: 'absolute',
    top: 160,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.azul,
    opacity: 0.08,
  },

  anel: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: colors.texto,
    opacity: 0.05,
    transform: [{ rotate: '12deg' }],
  },
  estrelaGrande: {
    position: 'absolute',
    top: 112,
    right: 60,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.azul,
    opacity: 0.8,
  },
  estrelaMedia: {
    position: 'absolute',
    top: 220,
    left: 52,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.texto,
    opacity: 0.55,
  },
  estrelaPequenaUm: {
    position: 'absolute',
    top: 250,
    right: 132,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.roxo,
    opacity: 0.8,
  },
  estrelaPequenaDois: {
    position: 'absolute',
    bottom: 188,
    left: 86,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.texto,
    opacity: 0.35,
  },
  estrelaPequenaTres: {
    position: 'absolute',
    bottom: 132,
    right: 78,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.azul,
    opacity: 0.7,
  },

  // Card da tela de boas-vindas
  banner: {
    minHeight: 130,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borda,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  logo: {
    width: 180,
    height: 54,
  },
  bannerTexto: {
    color: colors.texto,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 22,
  },
  acoes: {
    marginTop: 22,
    gap: 14,
  },
  pular: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  pularTexto: {
    color: colors.textoSecundario,
    fontWeight: '700',
  },
  cardNome: {
    backgroundColor: colors.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.borda,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  topoNome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  titulo: {
    color: colors.texto,
    fontSize: 29,
    fontWeight: '700',
  },
  label: {
    color: colors.textoSecundario,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 8,
  },
  acao: {
    marginTop: 18,
  },
  voltar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: colors.fundoSecundario,
  },
  // Campo de entrada de texto estilizado
  input: {
    backgroundColor: colors.card,
    color: colors.texto,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borda,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
  },
});
