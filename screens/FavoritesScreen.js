import React, { useCallback, useState } from 'react';

import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { CONTENT_TYPES, contentTypeLabel, normalizeContentType } from '../constants/contentType';
import { listarItens, removerMarcacao } from '../database/db';

import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import CustomButton from '../components/CustomButton';

export default function FavoritesScreen() {
  const [favoritos, setFavoritos] = useState([]);

  // useFocusEffect: roda toda vez que a tela recebe foco (não apenas na montagem). Garante que a lista atualize ao voltar de outra tela após adicionar/remover um item
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const resposta = await listarItens('favorito'); // Filtra apenas favoritos no banco
        setFavoritos(resposta);
      }

      carregar();
    }, [])
  );

  // Remove apenas a marcacao de favorito e recarrega a lista em seguida
  async function remover(id) {
    await removerMarcacao(id, 'favorito');
    const resposta = await listarItens('favorito');
    setFavoritos(resposta);
  }

  const filmes = favoritos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.MOVIE);
  const series = favoritos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.TV);
  const secoes = [
    { title: 'Filmes', data: filmes },
    { title: 'Séries', data: series },
  ].filter((secao) => secao.data.length > 0);

  return (
    <View style={styles.container}>
      <Header titulo="Favoritos" subtitulo="Os títulos que ganharam lugar fixo no seu catálogo." />

      <SectionList
        sections={secoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<Text style={styles.vazio}>Ainda não há títulos com lugar especial no seu catálogo.</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.secaoTitulo}>{section.title}</Text>}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <ContentCard item={item} largura={112} />
            <View style={styles.info}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.detalhe}>{contentTypeLabel(item.tipo)}  •  ★ {Number(item.nota).toFixed(1)}</Text>
              <CustomButton
                texto="Remover"
                tipo="secundario"
                onPress={() => remover(item.id)}
                icon={<Ionicons name="trash-outline" size={17} color={colors.texto} />}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  lista: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 34,
  },
  secaoTitulo: {
    color: colors.texto,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 10,
  },
  linha: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borda,
    padding: 12,
    marginBottom: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 14,
  },
  titulo: {
    color: colors.texto,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  detalhe: {
    color: colors.textoSecundario,
    marginBottom: 14,
  },
  vazio: {
    color: colors.textoSecundario,
    textAlign: 'center',
    marginTop: 50,
  },
});
