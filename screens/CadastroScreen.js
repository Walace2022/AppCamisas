import { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { addProduto, addMovimentacao } from '../services/storage';

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

  try {
    
    const produtoId = await addProduto({
      nome,
      quantidade: qtd,
      preco: valor
    });

    
    await addMovimentacao({
      tipo: 'entrada',
      produtoId,
      produtoNome: nome,
      quantidade: qtd
    });

    Alert.alert("Produto cadastrado com sucesso");

    
    setNome('');
    setQuantidade('');
    setPreco('');
  } catch (error) {
    Alert.alert("Erro ao salvar no Firebase", error.message);
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