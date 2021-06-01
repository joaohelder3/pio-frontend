import {StatusBar} from 'expo-status-bar';
import React from 'react';
import { Text, StyleSheet, View, Image, TextInput, Button, ToastAndroid, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import axios from 'axios';
import Logo from './assets/logo02.png';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class NewUser extends React.Component {

  state = { 
    usuarioAtual: { 
      usuario: "",
      email: "",
      senha: "",
      nome: "",
    }
  }

  atualizarTexto(txt, campo) { 
    const novoState = {...this.state};
    novoState[campo] = txt;
    this.setState(novoState);
  }

  adicionar() { 
    axios.post('https://kui-pizza.herokuapp.com/cadastro/adicionar', this.state.usuarioAtual)
    .then( (resposta)=> {
      if (resposta.status === 200) { 
        ToastAndroid.show("O usuario foi gravado com sucesso", ToastAndroid.LONG);
        //alert("O usuario foi gravado com sucesso");
      } else { 
        ToastAndroid.show("Erro ao gravar o usuario", ToastAndroid.LONG);
        //alert("Erro ao gravar o usuario");
      }
    })
    .catch( (err) => {
      ToastAndroid.show("Houve um erro no servidor ao gravar o usuario", ToastAndroid.LONG);
      //alert("Houve um erro no servidor ao gravar o usuario");
    })
  }

  inputChange(texto, campo) { 
    const novoState = {...this.state};
    novoState.usuarioAtual[campo] = texto;
    this.setState(novoState);
  }

  render(){
    return (
      <View style={styles.container}>
        <Image style={styles.imageCadastro} source={Logo}/>
        <View style={styles.loginView}>
          <TextInput style={styles.cadastro} placeholder='Insira seu usuario...' 
            value={props.usuario.usuario} onChangeText={(txt)=>{props.mudarTexto(txt, 'usuario')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu email...' 
            value={props.usuario.email} onChangeText={(txt)=>{props.mudarTexto(txt, 'email')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu senha...' returnKeyType="go"
            secureTextEntry autoCorrect={false} value={props.usuario.senha} 
            onChangeText={(txt)=>{props.mudarTexto(txt, 'senha')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu nome...' 
            value={props.usuario.nome} onChangeText={(txt)=>{props.mudarTexto(txt, 'nome')}}/>
          <View style={styles.button}>
            <Button color="#006064" title="Voltar" onPress={props.gravar}/>
            <Button color="#006064" title="Cadastrar" onPress={props.gravar}/>
          </View>
        </View>
      </View>
    );
  }
}

function Cadastrar(props) {
  return (
    <View style={styles.container}>
        <View style={styles.loginView}>
          <TextInput style={styles.cadastro} placeholder='Insira seu nome...' 
            value={props.cliente.nome} onChangeText={(txt)=>{props.mudarTexto(txt, 'nome')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu peso...' keyboardType='number-pad'
            value={props.cliente.peso} onChangeText={(txt)=>{props.mudarTexto(txt, 'peso')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu altura...' keyboardType='number-pad'
            value={props.cliente.altura} onChangeText={(txt)=>{props.mudarTexto(txt, 'altura')}}/>
          <TextInput style={styles.cadastro} placeholder='Insira seu idade...' keyboardType='number-pad'
            value={props.cliente.idade} onChangeText={(txt)=>{props.mudarTexto(txt, 'idade')}}/>
          <View style={{justifyContent: 'center'}}>
            <Button color="#006064" title="Cadastrar" onPress={props.gravar}/>
          </View>
        </View>
      </View>
  );
};

function ListaClientes(props) {
  console.log("Lista Inicial =>", props.clientes);
  const listaDisplay = props.clientes.map(element => {
    return (
      <View style={styles.listaItem}>
        <Text>{element.nome}</Text>
        <Text>{element.peso}</Text>
        <Text>{element.altura}</Text>
        <Text>{element.idade}</Text>
        <Text>{element.tmb}</Text>
        <Text>{element.imc}</Text>
      </View>
    ); 
  }); 
  console.log("Lista final =>", listaDisplay);

  return (
    <View style={styles.listaPedidos}>
      <Button title="Atualizar Lista" onPress={props.atualizar}/>
      <ScrollView>
        {listaDisplay}
      </ScrollView>
    </View>
  );
}

class App extends React.Component { 
  render () { 
    return (
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login"> 
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="NewUser" component={NewUser}/>
            <Stack.Screen name="Main" component={Main}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  }
}

class Main extends React.Component {

  state = { 
    lista: [],
    token: "",

    clienteAtual: { 
      nome: "",
      peso: "",
      altura: "",
      idade: "",
      tmb: "",
      imc: "",
    }
  }

  constructor(props) { 
    super(props);
    // const token = props.route.param.token;
    const {token} = props.route.params;
    this.state.token = token;
  }

  atualizarLista() { 
    const config = {
      headers: { 
        authorization: "Bearer " + this.state.token,
      }
    };
    axios.get('https://kui-pizza.herokuapp.com/clientes', config)
    .then(
        (resposta)=>{
          const novoState = {...this.state};
          novoState.lista = [...resposta.data];
          this.setState(novoState);
          ToastAndroid.show(
            `Foi carregada a lista com ${novoState.lista.length} clientes`, 
            ToastAndroid.LONG);
          //alert(`Foi carregada a lista com ${novoState.lista.length} clientes`);
        })
    .catch(
        (err)=>{
          ToastAndroid.show("Erro ao carregar a lista", ToastAndroid.LONG);
          //alert("Erro ao carregar a lista");
        })
  }

  cadastrar() { 
    const cfg = { 
      headers: { 
        authorization: "Bearer " + this.state.token,
      }
    }
    axios.post('https://kui-pizza.herokuapp.com/cliente/adicionar', this.state.clienteAtual, cfg)
    .then( (resposta)=> {
      if (resposta.status === 200) { 
        ToastAndroid.show("O cliente foi gravado com sucesso", ToastAndroid.LONG);
        //alert("O cliente foi gravado com sucesso");
      } else { 
        ToastAndroid.show("Erro ao gravar o cliente", ToastAndroid.LONG);
        //alert("Erro ao gravar o cliente");
      }
    })
    .catch( (err) => {
      ToastAndroid.show("Houve um erro no servidor ao gravar o cliente", ToastAndroid.LONG);
      //alert("Houve um erro no servidor ao gravar o cliente");
    })
  }

  inputChange(texto, campo) { 
    const novoState = {...this.state};
    novoState.clienteAtual[campo] = texto;
    this.setState(novoState);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.imageCadastro} source={Logo}/>
        <View style={styles.viewDados}>
            <Tab.Navigator>
              <Tab.Screen name="Cadastrar">
                {()=><Cadastrar cliente={this.state.clienteAtual}
                          mudarTexto={(txt, campo)=>{this.inputChange(txt, campo)}}
                          gravar={()=>{this.cadastrar()}}
                />}
              </Tab.Screen>
              <Tab.Screen name="Lista Clientes">
                {()=><ListaClientes clientes={this.state.lista}
                          atualizar={()=>{this.atualizarLista()}}/>}
              </Tab.Screen>
            </Tab.Navigator>
        </View>
      </View>
    );
  }
}

class Login extends React.Component {

  state = { 
    usuario: "admin",
    senha: "123456",
    token: "",
  }

  atualizarTexto(txt, campo) { 
    const novoState = {...this.state};
    novoState[campo] = txt;
    this.setState(novoState);
  }

  login() { 
    const objLogin = {
      usuario: this.state.usuario,
      senha: this.state.senha
    }
    console.log("Obj Login ==>", objLogin);
    axios.post('https://kui-pizza.herokuapp.com/login', objLogin)
    .then( (res) => {
        if (res.data.token) {
          const token = res.data.token; 
          console.log("Token ==>", token);
          const novoState = {...this.state};
          novoState.token = token;
          this.setState(novoState);
          console.log("State==>", this.state);
          ToastAndroid.show("Autenticado com sucesso", ToastAndroid.LONG);
          //alert("Autenticado com sucesso");
          this.props.navigation.navigate("Main", {token});
        }
      } )
    .catch( (err) => {
      console.log("Erro ==>", err);
      ToastAndroid.show("Usuário ou senha inválidos", ToastAndroid.LONG);
      //alert("Usuário ou senha inválidos");
    } )
  }

  render() { 
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={Logo}/>
        <View style={styles.loginView}>
          <TextInput style={styles.loginUsuarioInput} placeholder='Insira seu login...' 
            value={this.state.usuario} onChangeText={(texto)=>{this.atualizarTexto(texto, 'usuario')}}/>
          <TextInput style={styles.loginSenhaInput} secureTextEntry={true} placeholder='Insira sua senha...' 
            returnKeyType="go" autoCorrect={false} value={this.state.senha}
            onChangeText={(texto)=>{this.atualizarTexto(texto, 'senha')}}/>
          <View style={styles.button}>
            <Button color="#006064" title="Cadastrar"/>
            <Button color="#006064" title="Login" onPress={()=>{this.login()}}/>
          </View>
        </View>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { 
    flex: 2,
    width: '100%',
    resizeMode: 'center',
  },
  imageCadastro: { 
    flex: 1,
    width: '100%',
    resizeMode: 'center',
  },
  loginView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  loginUsuarioInput: {
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 20,
    padding: 1,
  },  
  loginSenhaInput: {
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 1,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    alignContent: "space-between",
    marginBottom: 30,
    borderRadius: 20,
    padding: 1,
  },
  cadastro: {
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 20,
    padding: 1,
    marginBottom: 10,
  },
  listaPedidos: { 
    flex: 1,
  },
  listaItem: { 
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#33F',
  },
  viewDados: { 
    flex: 3,
    marginLeft: 15,
    marginRight: 15,
  }
});