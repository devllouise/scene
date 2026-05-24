import React, { useCallback, useState } from 'react';

import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { appLogo } from '../constants/branding';
import { contarItens } from '../database/db';

export default function ProfileScreen({ navigation, nomeUsuario }) {
  const [stats, setStats] = useState({
    salvos: 0,
    filmes: 0,
    series: 0,
    favoritos: 0,
  });

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const resposta = await contarItens();
        setStats(resposta);
      }

      carregar();
    }, [])
  );

  function abrirTela(nomeTela) {
    const parent = navigation.getParent();
    const drawerNavigation = parent?.getState?.().routeNames?.includes(nomeTela)
      ? parent
      : navigation;

    drawerNavigation.navigate(nomeTela);
  }

  const totalAssistidos = stats.filmes + stats.series;
  const inicial = (nomeUsuario || 'U').charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.faixaLogo}>
        <Image source={appLogo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.cartaoResumo}>
        <View style={styles.topo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{inicial}</Text>
          </View>

          <View style={styles.identidade}>
            <Text style={styles.nome}>{nomeUsuario || 'Usuário'}</Text>
          </View>
        </View>

        <View style={styles.resumoLinha}>
          <ResumoItem valor={stats.salvos} label="Na lista" />
          <ResumoItem valor={stats.favoritos} label="Favoritos" />
          <ResumoItem valor={totalAssistidos} label="Assistidos" />
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Atalhos do seu catálogo</Text>

      <View style={styles.lista}>
        <Atalho
          icone="bookmark-outline"
          titulo="Minha Lista"
          descricao="Tudo que você separou para ver mais tarde"
          onPress={() => abrirTela('MinhaLista')}
        />

        <Atalho
          icone="heart-outline"
          titulo="Favoritos"
          descricao="Os títulos que mais ganharam seu carinho"
          onPress={() => abrirTela('Favoritos')}
        />

        <Atalho
          icone="checkmark-done-outline"
          titulo="Assistidos"
          descricao="O que já foi visto e pode sair da lista"
          onPress={() => abrirTela('Assistidos')}
        />
      </View>
    </ScrollView>
  );
}

function ResumoItem({ valor, label }) {
  return (
    <View style={styles.resumoItem}>
      <Text style={styles.resumoValor}>{valor}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function Atalho({ icone, titulo, descricao, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.atalho, pressed && styles.pressionado]}>
      <View style={styles.atalhoIcone}>
        <Ionicons name={icone} size={22} color={colors.texto} />
      </View>

      <View style={styles.atalhoTexto}>
        <Text style={styles.atalhoTitulo}>{titulo}</Text>
        <Text style={styles.atalhoDescricao}>{descricao}</Text>
      </View>

      <View style={styles.atalhoMeta}>
        <Ionicons name="chevron-forward" size={18} color={colors.textoSecundario} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 36,
  },
  faixaLogo: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
    paddingVertical: 4,
    opacity: 0.9,
  },
  cartaoResumo: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borda,
    padding: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  logo: {
    width: 74,
    height: 22,
  },
  topo: {
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.roxo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarTexto: {
    color: colors.texto,
    fontSize: 30,
    fontWeight: '900',
  },
  identidade: {
    alignItems: 'center',
  },
  nome: {
    color: colors.texto,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 18,
  },
  resumoItem: {
    flex: 1,
    backgroundColor: colors.fundoSecundario,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  resumoValor: {
    color: colors.texto,
    fontSize: 22,
    fontWeight: '900',
  },
  resumoLabel: {
    color: colors.textoSecundario,
    fontSize: 13,
    marginTop: 4,
  },
  secaoTitulo: {
    color: colors.texto,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  lista: {
    gap: 12,
  },
  atalho: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borda,
    padding: 14,
  },
  atalhoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.fundoSecundario,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  atalhoTexto: {
    flex: 1,
  },
  atalhoTitulo: {
    color: colors.texto,
    fontSize: 17,
    fontWeight: '800',
  },
  atalhoDescricao: {
    color: colors.textoSecundario,
    marginTop: 4,
    lineHeight: 19,
  },
  atalhoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pressionado: {
    opacity: 0.75,
  },
});
