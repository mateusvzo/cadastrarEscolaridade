import React from 'react';
import { useState, useEffect } from 'react';
import {FlatList, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo } from '@expo/vector-icons';

import { DataTable } from 'react-native-paper';

import { Button } from '../Components/Button';

import { 
  Container, 
  Title, 
  InputContainer, 
  Input,
  SubTitle,
  ContainerList,
  ButtonList,
  TextList,
  Icon,
  Header
} from './styles';


interface CadastroProps {
  id: string;
  escolaridade: string;
}


export default function Home() {
  const [escolaridade, setEscolaridade] = useState('');
  const [codEscolaridade, setCodEscolaridade] = useState('');
  const [arrayEscolaridade, setArrayEscolaridade] = useState<CadastroProps[]>([]);

  useEffect(() => {
    async function loadData() {
      const getData = await AsyncStorage.getItem('@listCadastro');
      return getData !== null ? setArrayEscolaridade(JSON.parse(getData)) : null;
    }

    loadData()
  }, [])

  function handleAddCadastro() {
    const data = {
      id: codEscolaridade,
      escolaridade: escolaridade,
    }
    if (escolaridade != '' && codEscolaridade != ''){
    setArrayEscolaridade([...arrayEscolaridade, data])
    setEscolaridade('')
    setCodEscolaridade('')
    } else {
      alert("Preencha os campos em branco")
    }
  }

  function handleRemoveCadastro(id: string) {
    setArrayEscolaridade(cadastro => cadastro.filter( c => c.id !== id))
  }

  useEffect(() => {
    async function saveData() {
      await AsyncStorage.setItem('@listCadastro', JSON.stringify(arrayEscolaridade));
    }

    saveData();
  }, [escolaridade])

  return (
    <Container>
      <Header>
        <Icon name="app-registration"/>
        <Title>CADASTRO ESCOLARIDADE</Title>
      </Header>

      <InputContainer>
        <Input 
          placeholder="Digite sua Escolaridade"
          placeholderTextColor= '#555'
          value={escolaridade}
          onChangeText={setEscolaridade}
        />
        <Input 
          placeholder="Digite o código"
          placeholderTextColor= '#555'
          value={codEscolaridade}
          onChangeText={setCodEscolaridade}
        />

        <Button title= "Cadastrar" onPress={handleAddCadastro} />
      </InputContainer>

      <SubTitle>Lista de Cadastrados</SubTitle>

        <DataTable style={styles.container}>
          <DataTable.Header style={styles.header}>
            <DataTable.Title>
              <Text style={styles.title}>Código</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.title}>Escolaridade</Text>
            </DataTable.Title>
            <DataTable.Title style={{marginLeft: 12}}>
              <Text style={styles.title}>Excluir</Text>
            </DataTable.Title>
          </DataTable.Header>

          <FlatList 
            showsVerticalScrollIndicator={false}
            data={arrayEscolaridade}
            keyExtractor={ item => item.id}
            renderItem={({ item }) => (
              <ContainerList>
                  <DataTable.Row>
                    <DataTable.Cell>{item.id}</DataTable.Cell>
                    <DataTable.Cell>{item.escolaridade}</DataTable.Cell>
                    <DataTable.Cell>
                      <ButtonList  onPress={() => handleRemoveCadastro(item.id)}>
                        <Text>
                          <Entypo name="trash" size={24} color="black" />
                        </Text>
                      </ButtonList>
                      </DataTable.Cell>
                  </DataTable.Row>
              </ContainerList>
            )}
          />
        </DataTable>

    </Container>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
  },
  header: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textLine: {
    marginLeft: 50
  }
})