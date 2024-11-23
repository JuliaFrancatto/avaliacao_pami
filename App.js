import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function App() {
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    const buscarEndereco = async () => {
        if (cep.length < 8) {
            Alert.alert('Erro', 'CEP inválido!');
            return;
        }
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                Alert.alert('Erro', 'CEP não encontrado!');
            } else {
                const { logradouro, bairro, localidade, uf } = response.data;
                setEndereco(`${logradouro}, ${bairro}, ${localidade} - ${uf}`);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao buscar o endereço!');
        }
    };

    const limparCampos = () => {
        setCpf('');
        setNome('');
        setIdade('');
        setCep('');
        setEndereco('');
    };

    const cadastrarUsuario = async () => {
        if (!cpf || !nome || !idade || !cep || !endereco) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        try {
            await axios.post('http://172.16.7.4:3000/usuarios', {
                cpf,
                nome,
                idade,
                cep,
                endereco,
            });
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
            limparCampos();
            listarUsuarios(); // Atualizar a lista após cadastro
        } catch (error) {
            Alert.alert('Erro', 'Falha ao cadastrar usuário!');
        }
    };

    const listarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://172.16.7.4:3000/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os usuários!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Usuários</Text>
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={setCpf}
                    placeholderTextColor="#ddd"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#ddd"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Idade"
                    value={idade}
                    onChangeText={setIdade}
                    keyboardType="numeric"
                    placeholderTextColor="#ddd"
                />
                <TextInput
                    style={styles.input}
                    placeholder="CEP"
                    value={cep}
                    onChangeText={setCep}
                    onBlur={buscarEndereco}
                    placeholderTextColor="#ddd"
                />
                <TextInput
                    style={[styles.input, { height: Math.max(50, endereco.length * 1.5) }]}
                    placeholder="Endereço"
                    value={endereco}
                    editable={false}
                    multiline
                    placeholderTextColor="#ddd"
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Cadastrar"
                        onPress={cadastrarUsuario}
                        color="#7a5f9b"
                    />
                </View>
            </View>

            <Text style={styles.title}>Lista de Usuários</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item.cpf.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Text style={styles.text}><Text style={styles.bold}>CPF:</Text> {item.cpf}</Text>
                            <Text style={styles.text}><Text style={styles.bold}>Nome:</Text> {item.nome}</Text>
                            <Text style={styles.text}><Text style={styles.bold}>Idade:</Text> {item.idade}</Text>
                            <Text style={styles.text}><Text style={styles.bold}>CEP:</Text> {item.cep}</Text>
                            <Text style={styles.text}><Text style={styles.bold}>Endereço:</Text> {item.endereco}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado!</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#907cc1',
        padding: 30,
    },
    card: {
        width: '100%',
        backgroundColor: '#402f5a',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        minHeight: 50,
        backgroundColor: '#644ba0',
        borderRadius: 8,
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    buttonContainer: {
        marginTop: 20,
    },
    userItem: {
        backgroundColor: '#644ba0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#fff',
    },
    bold: {
        fontWeight: 'bold',
    },
    empty: {
        fontSize: 16,
        color: '#ddd',
        textAlign: 'center',
        marginTop: 20,
    },
});
