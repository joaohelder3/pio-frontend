import React from 'react';
import { Text, StyleSheet, View, Image, TextInput, Button, ToastAndroid, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import axios from 'axios';
import Logo from './assets/logo02.png';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CadastrarClientes(props) {
  return (
    <View style={styles.container}>
      <View style={styles.loginView}>
        <Text>Cadastrar Clientes</Text>
        <TextInput style={styles.cadastro} placeholder='Insira seu nome...' 
          value={props.cliente.cliente} onChangeText={(txt)=>{props.mudarTexto(txt, 'cliente')}}/>
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
        <Text>Cliente = {element.cliente}</Text>
        <Text>Peso = {element.peso}</Text>
        <Text>Altura = {element.altura}</Text>
        <Text>Idade = {element.idade}</Text>
        <Text>TMB = {element.tmb}</Text>
        <Text>IMC = {element.imc}</Text>
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

function CadastrarEquipamentos(props) {
  return (
    <View style={styles.container}>
      <View style={styles.loginView}>
        <Text>Cadastrar Equipamentos</Text>
        <TextInput style={styles.cadastro} placeholder='Insira o nome do equipamento...' 
          value={props.equipamento.nome} onChangeText={(txt)=>{props.mudarTexto(txt, 'nome')}}/>
        <TextInput style={styles.cadastro} placeholder='Insira o tipo do equipamento...'
          value={props.equipamento.tipo} onChangeText={(txt)=>{props.mudarTexto(txt, 'tipo')}}/>
        <TextInput style={styles.cadastro} placeholder='Insira a quantidade...' keyboardType='number-pad'
          value={props.equipamento.quantidade} onChangeText={(txt)=>{props.mudarTexto(txt, 'quantidade')}}/>
        <View style={{justifyContent: 'center'}}>
          <Button color="#006064" title="Cadastrar" onPress={props.gravar}/>
        </View>
      </View>
    </View>
  );
};

function ListaEquipamentos(props) {
  console.log("Lista Inicial =>", props.equipamentos);
  const listaDisplay = props.equipamentos.map(element => {
    return (
      <View style={styles.listaItem}>
        <Text>Equipamento = {element.nome}</Text>
        <Text>Tipo = {element.tipo}</Text>
        <Text>Quantidade = {element.quantidade}</Text>
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

function CadastrarAcademias(props) {
  return (
    <View style={styles.container}>
      <View style={styles.loginView}>
        <Text>Cadastrar Academias</Text>
        <TextInput style={styles.cadastro} placeholder='Insira o nome da academia...' 
          value={props.academia.nome} onChangeText={(txt)=>{props.mudarTexto(txt, 'nome')}}/>
        <TextInput style={styles.cadastro} placeholder='Insira o bairro da academia...'
          value={props.academia.bairro} onChangeText={(txt)=>{props.mudarTexto(txt, 'bairro')}}/>
        <TextInput style={styles.cadastro} placeholder='Insira o endereço...'
          value={props.academia.logradouro} onChangeText={(txt)=>{props.mudarTexto(txt, 'logradouro')}}/>
        <View style={{justifyContent: 'center'}}>
          <Button color="#006064" title="Cadastrar" onPress={props.gravar}/>
        </View>
      </View>
    </View>
  );
};

function ListaAcademias(props) {
  console.log("Lista Inicial =>", props.academias);
  const listaDisplay = props.academias.map(element => {
    return (
      <View style={styles.listaItem}>
        <Text>Nome = {element.nome}</Text>
        <Text>Bairro = {element.bairro}</Text>
        <Text>Endereço = {element.logradouro}</Text>
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

class Clientes extends React.Component {

  state = { 
    lista: [],
    token: "",
  
    clienteAtual: { 
      cliente: "",
      peso: "",
      altura: "",
      idade: "",
      tmb: "",
      imc: "",
    }
  }

  constructor(props) { 
    super(props);
    //const token = props.route.param.token;
    //const token = props.route.params;
    this.state.token = props.route.params.token;
    console.log("State token ==> ", this.state.token);
  }

  imcCalc(){
    // Dividindo o peso pela altura ao quadrado
    const p = this.state.clienteAtual.peso;
    const alt = this.state.clienteAtual.altura;
    const calculo = (p / (alt*alt));
    const arredondado = parseFloat(calculo.toFixed(2));
    this.inputChange(arredondado, 'imc');
  }

  tmbCalc(){
    //Homens devem utilizar a seguinte a fórmula:
    //66,5 + (13,75 x Peso) + (5,0 x Altura em cm) – (6,8 x Idade).
    //Enquanto isso, mulheres devem realizar a fórmula seguinte:
    //665,1 + (9,56 x Peso) + (1,8 x Altura em cm) – (4,7 x Idade).
    const p = this.state.clienteAtual.peso;
    const alt = this.state.clienteAtual.altura * 100;
    const id = this.state.clienteAtual.idade;
    const calculo = 66.5 + (13.75 * p) + (5.0 * alt) - (6.8 * id);
    const arredondado = parseFloat(calculo.toFixed(2));
    this.inputChange(arredondado, 'tmb');
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

    this.imcCalc();
    this.tmbCalc();

    console.log("State Cliente Atual ==>", this.state.clienteAtual);
    console.log("CFG ==> ", cfg);
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
      console.log("Error ==> ", err);
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
              {()=><CadastrarClientes cliente={this.state.clienteAtual}
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

class Equipamentos extends React.Component {

  state = { 
    lista: [],
    token: "",
  
    equipamentoAtual: { 
      nome: "",
      tipo: "",
      quantidade: "",
    }
  }
  
  constructor(props) { 
    super(props);
    // const token = props.route.param.token;
    //const {token} = props.route.params;
    this.state.token = props.route.params.token;
  }
  
  atualizarLista() { 
    const config = {
      headers: { 
        authorization: "Bearer " + this.state.token,
      }
    };
    axios.get('https://kui-pizza.herokuapp.com/equipamentos', config)
    .then(
        (resposta)=>{
          const novoState = {...this.state};
          novoState.lista = [...resposta.data];
          this.setState(novoState);
          ToastAndroid.show(
            `Foi carregada a lista com ${novoState.lista.length} equipamentos`, 
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
    axios.post('https://kui-pizza.herokuapp.com/equipamento/adicionar', this.state.equipamentoAtual, cfg)
    .then( (resposta)=> {
      if (resposta.status === 200) { 
        ToastAndroid.show("O equipamento foi gravado com sucesso", ToastAndroid.LONG);
        //alert("O cliente foi gravado com sucesso");
      } else { 
        ToastAndroid.show("Erro ao gravar o equipamento", ToastAndroid.LONG);
        //alert("Erro ao gravar o cliente");
      }
    })
    .catch( (err) => {
      ToastAndroid.show("Houve um erro no servidor ao gravar o equipamento", ToastAndroid.LONG);
      //alert("Houve um erro no servidor ao gravar o cliente");
    })
  }
  
  inputChange(texto, campo) { 
    const novoState = {...this.state};
    novoState.equipamentoAtual[campo] = texto;
    this.setState(novoState);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.imageCadastro} source={Logo}/>
        <View style={styles.viewDados}>
          <Tab.Navigator>
            <Tab.Screen name="Cadastrar">
              {()=><CadastrarEquipamentos equipamento={this.state.equipamentoAtual}
                        mudarTexto={(txt, campo)=>{this.inputChange(txt, campo)}}
                        gravar={()=>{this.cadastrar()}}
              />}
            </Tab.Screen>
            <Tab.Screen name="Lista Equipamentos">
              {()=><ListaEquipamentos equipamentos={this.state.lista}
                        atualizar={()=>{this.atualizarLista()}}/>}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </View>
    );
  }
}

class Academias extends React.Component {

  state = { 
    lista: [],
    token: "",
  
    academiaAtual: { 
      nome: "",
      bairro: "",
      logradouro: "",
    }
  }
  
  constructor(props) { 
    super(props);
    // const token = props.route.param.token;
    //const {token} = props.route.params;
    this.state.token = props.route.params.token;
  }
  
  atualizarLista() { 
    const config = {
      headers: { 
        authorization: "Bearer " + this.state.token,
      }
    };
    axios.get('https://kui-pizza.herokuapp.com/academias', config)
    .then(
        (resposta)=>{
          const novoState = {...this.state};
          novoState.lista = [...resposta.data];
          this.setState(novoState);
          ToastAndroid.show(
            `Foi carregada a lista com ${novoState.lista.length} academias`, 
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
    console.log("State Token ==> ", this.state.token);
    console.log("State Academia Atual ==> ", this.state.academiaAtual);
    console.log("CFG ==> ", cfg);
    axios.post('https://kui-pizza.herokuapp.com/academia/adicionar', this.state.academiaAtual, cfg)
    .then( (resposta)=> {
      if (resposta.status === 200) { 
        ToastAndroid.show("A academia foi gravada com sucesso", ToastAndroid.LONG);
        //alert("O cliente foi gravado com sucesso");
      } else { 
        ToastAndroid.show("Erro ao gravar a academia", ToastAndroid.LONG);
        //alert("Erro ao gravar o cliente");
      }
    })
    .catch( (err) => {
      ToastAndroid.show("Houve um erro no servidor ao gravar a academia", ToastAndroid.LONG);
      console.log("ERROR ==> ", err);
      //alert("Houve um erro no servidor ao gravar o cliente");
    })
  }
  
  inputChange(texto, campo) { 
    const novoState = {...this.state};
    novoState.academiaAtual[campo] = texto;
    this.setState(novoState);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.imageCadastro} source={Logo}/>
        <View style={styles.viewDados}>
          <Tab.Navigator>
            <Tab.Screen name="Cadastrar">
              {()=><CadastrarAcademias academia={this.state.academiaAtual}
                        mudarTexto={(txt, campo)=>{this.inputChange(txt, campo)}}
                        gravar={()=>{this.cadastrar()}}
              />}
            </Tab.Screen>
            <Tab.Screen name="Lista Academias">
              {()=><ListaAcademias academias={this.state.lista}
                        atualizar={()=>{this.atualizarLista()}}/>}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </View>
    );
  }
}

class App extends React.Component { 
  render () { 
    return (
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login"> 
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Menu" component={Menu}/>
            <Stack.Screen name="Clientes" component={Clientes}/>
            <Stack.Screen name="Equipamentos" component={Equipamentos}/>
            <Stack.Screen name="Academias" component={Academias}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  }
}

class Menu extends React.Component {

  state = {
    token: "",
  }

  constructor(props) { 
    super(props);
    // const token = props.route.param.token;
    //const {token} = props.route.params;
    this.state.token = props.route.params;
  }

  clientes() {
    this.props.navigation.navigate("Clientes", this.state.token);
  }

  equipamentos(){
    this.props.navigation.navigate("Equipamentos", this.state.token);
  }

  academias(){
    this.props.navigation.navigate("Academias", this.state.token);
  }

  render(){
    return(
      <View style={styles.container}>
        <Image style={styles.imageCadastro} source={Logo}/>
        <View style={styles.title}>
          <Text>CADASTRO</Text>
        </View>
        <View style={styles.button}>
          <Button color="#006064" title="clientes" onPress={()=>{this.clientes()}}/>
          <Button color="#006064" title="equipamentos" onPress={()=>{this.equipamentos()}}/>
          <Button color="#006064" title="academias" onPress={()=>{this.academias()}}/>
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
          ToastAndroid.show("Autenticado com sucesso", ToastAndroid.SHORT);
          //alert("Autenticado com sucesso");
          this.props.navigation.navigate("Menu", {token});
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
    alignItems: "center",
    alignContent: 'space-between',
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
  title: { 
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  viewDados: { 
    flex: 1,
    width: '100%',
    marginLeft: 15,
    marginRight: 15,
  }
});