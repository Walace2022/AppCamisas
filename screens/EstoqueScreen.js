import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getData, saveData } from '../services/storage';

export default function VisualizarScreen() {
  const [produtos, setProdutos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeMovimentar, setQuantidadeMovimentar] = useState('');

  useFocusEffect(
  useCallback(() => {
    const carregarProdutos = async () => {
      const dados = await getData('produtos');
      setProdutos(dados);
    };
    carregarProdutos();
  }, [])
);


  const carregarProdutos = async () => {
    const lista = await getData('produtos') || [];
    setProdutos(lista);
  };

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidadeMovimentar('');
    setModalVisible(true);
  };

  const movimentarEstoque = async (tipo) => {
    const qtd = parseInt(quantidadeMovimentar);
    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Informe uma quantidade válida.');
      return;
    }

    const novaLista = produtos.map((p) => {
      if (p.id === produtoSelecionado.id) {
        const novaQtd = tipo === 'entrada' ? p.quantidade + qtd : p.quantidade - qtd;
        if (novaQtd < 0) {
          Alert.alert('Estoque insuficiente.');
          return p;
        }
        return { ...p, quantidade: novaQtd };
      }
      return p;
    });

    setProdutos(novaLista);
    await saveData('produtos', novaLista);

    // Registrar movimentação
    const movimentacoes = await getData('movimentacoes') || [];
    movimentacoes.push({
      id: Date.now().toString(),
      tipo,
      produtoId: produtoSelecionado.id,
      produtoNome: produtoSelecionado.nome,
      quantidade: qtd,
      data: new Date().toISOString()
    });
    await saveData('movimentacoes', movimentacoes);

    Alert.alert('Movimentação registrada!');
    setModalVisible(false);
    setProdutoSelecionado(null);
  };

  const removerProduto = () => {
  Alert.alert(
    "Confirmar exclusão",
    `Deseja realmente remover o produto "${produtoSelecionado?.nome}"?`,
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          const novaLista = produtos.filter(p => p.id !== produtoSelecionado.id);
          setProdutos(novaLista);
          await saveData('produtos', novaLista);
          Alert.alert('Produto removido com sucesso!');
          setModalVisible(false);
          setProdutoSelecionado(null);
        }
      }
    ]
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => abrirModal(item)}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Qtd: {item.quantidade}</Text>
            <Text>R$ {item.preco.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto cadastrado.</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{produtoSelecionado?.nome}</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={quantidadeMovimentar}
              onChangeText={setQuantidadeMovimentar}
            />
            <View style={styles.buttonGroup}>
              <Button title="Adicionar" onPress={() => movimentarEstoque('entrada')} />
              <Button title="Remover" color="orange" onPress={() => movimentarEstoque('saida')} />
              <Button title="Excluir" color="red" onPress={removerProduto} />
            </View>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  buttonGroup: {
    gap: 10,
    marginBottom: 12,
  },
});
