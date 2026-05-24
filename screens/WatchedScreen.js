import React, { useCallback, useState } from 'react';

import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { CONTENT_TYPES, contentTypeLabel, normalizeContentType } from '../constants/contentType';
import { atualizarStatus, listarItens, removerMarcacao } from '../database/db';

import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import CustomButton from '../components/CustomButton';

export default function WatchedScreen() {
  const [assistidos, setAssistidos] = useState([]);

  async function carregar() {
    const resposta = await listarItens('assistido');
    setAssistidos(resposta);
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function voltarParaLista(id) {
    await atualizarStatus(id, 'lista');
    await carregar();
  }

  async function remover(id) {
    await removerMarcacao(id, 'assistido');
    await carregar();
  }

  const filmes = assistidos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.MOVIE);
  const series = assistidos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.TV);
  const secoes = [
    { title: 'Filmes', data: filmes },
    { title: 'Séries', data: series },
  ].filter((secao) => secao.data.length > 0);

  return (
    <View style={styles.container}>
      <Header titulo="Assistidos" subtitulo="O arquivo do que você já terminou e pode remover da lista." />

      <SectionList
        sections={secoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<Text style={styles.vazio}>Quando você marcar algo como visto, ele aparece aqui como assistido.</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.secaoTitulo}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <ContentCard item={item} largura={112} />
            <View style={styles.info}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.detalhe}>
                {contentTypeLabel(item.tipo)}  •  Sua nota {Number(item.nota).toFixed(1)}
              </Text>

              <View style={styles.acoes}>
                <CustomButton
                  texto="Voltar para a lista"
                  onPress={() => voltarParaLista(item.id)}
                  icon={<Ionicons name="bookmark-outline" size={17} color={colors.texto} />}
                />
                <CustomButton
                  texto="Remover"
                  tipo="secundario"
                  onPress={() => remover(item.id)}
                  icon={<Ionicons name="trash-outline" size={17} color={colors.texto} />}
                />
              </View>
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
    marginBottom: 12,
  },
  acoes: {
    gap: 10,
  },
  vazio: {
    color: colors.textoSecundario,
    textAlign: 'center',
    marginTop: 50,
  },
});
