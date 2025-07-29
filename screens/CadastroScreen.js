import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { getData, saveData } from '../services/storage';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');

  const cadastrarProduto = async () => {
    if (!nome || !quantidade || !preco) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    const qtd = parseInt(quantidade);
    const valor = parseFloat(preco);

    if (isNaN(qtd) || qtd < 0) {
      Alert.alert("Quantidade deve ser um número válido.");
      return;
    }

    if (isNaN(valor) || valor <= 0) {
      Alert.alert("Preço deve ser um número válido e maior que zero.");
      return;
    }

    const novoProduto = {
      id: Date.now().toString(),
      nome,
      quantidade: qtd,
      preco: valor
    };

    try {
      const produtos = await getData('produtos') || [];
      produtos.push(novoProduto);
      await saveData('produtos', produtos);

      const movimentacoes = await getData('movimentacoes') || [];
      movimentacoes.push({
        id: Date.now().toString(),
        tipo: 'entrada',
        produtoId: novoProduto.id,
        produtoNome: novoProduto.nome,
        quantidade: qtd,
        data: new Date().toISOString()
      });
      await saveData('movimentacoes', movimentacoes);

      Alert.alert("Produto cadastrado com sucesso");

      setNome('');
      setQuantidade('');
      setPreco('');
    } catch (error) {
      Alert.alert("Erro ao salvar dados", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Item</Text>
      <TextInput style={styles.input} placeholder="Nome do Produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <TextInput  style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <Button title="Cadastrar" onPress={cadastrarProduto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});