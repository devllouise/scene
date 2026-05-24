import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function SearchBar({ valor, onChangeText, onSubmit }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={19} color={colors.textoSecundario} />
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Busque filmes, séries e universos..."
        placeholderTextColor={colors.textoSecundario}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borda,
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    color: colors.texto,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
