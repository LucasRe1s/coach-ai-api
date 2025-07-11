// Teste dos Middlewares de Erro - Coach AI API
// Execute este arquivo para testar os middlewares

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testMiddlewares() {
  console.log('🧪 Testando Middlewares de Erro\n');

  try {
    // Teste 1: Rota não encontrada
    console.log('1️⃣ Testando rota não encontrada...');
    try {
      await axios.get(`${BASE_URL}/rota-inexistente`);
    } catch (error) {
      console.log('✅ Erro 404 capturado corretamente');
      console.log('Status:', error.response.status);
      console.log('Mensagem:', error.response.data.error.message);
    }

    // Teste 2: Validação de dados inválidos
    console.log('\n2️⃣ Testando validação de dados inválidos...');
    try {
      await axios.post(`${BASE_URL}/users`, {
        name: '', // Nome vazio
        email: 'email-invalido', // Email inválido
        password: '123' // Senha muito curta
      });
    } catch (error) {
      console.log('✅ Erro de validação capturado corretamente');
      console.log('Status:', error.response.status);
      console.log('Código:', error.response.data.error.code);
      console.log('Detalhes:', error.response.data.error.details);
    }

    // Teste 3: JSON inválido
    console.log('\n3️⃣ Testando JSON inválido...');
    try {
      await axios.post(`${BASE_URL}/users`, 'json-invalido', {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log('✅ Erro de JSON inválido capturado corretamente');
      console.log('Status:', error.response.status);
      console.log('Mensagem:', error.response.data.error.message);
    }

    // Teste 4: Autenticação sem token
    console.log('\n4️⃣ Testando autenticação sem token...');
    try {
      await axios.get(`${BASE_URL}/users`);
    } catch (error) {
      console.log('✅ Erro de autenticação capturado corretamente');
      console.log('Status:', error.response.status);
      console.log('Código:', error.response.data.error.code);
    }

    // Teste 5: Criação de usuário válida
    console.log('\n5️⃣ Testando criação de usuário válida...');
    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        name: 'João Silva',
        email: 'joao@example.com',
        password: '123456'
      });
      console.log('✅ Usuário criado com sucesso');
      console.log('Status:', response.status);
      console.log('Dados:', response.data);
    } catch (error) {
      console.log('❌ Erro inesperado na criação de usuário');
      console.log('Status:', error.response?.status);
      console.log('Mensagem:', error.response?.data?.error?.message);
    }

    // Teste 6: Conversa não encontrada
    console.log('\n6️⃣ Testando conversa não encontrada...');
    try {
      await axios.get(`${BASE_URL}/conversation/999`);
    } catch (error) {
      console.log('✅ Erro de conversa não encontrada capturado corretamente');
      console.log('Status:', error.response.status);
      console.log('Código:', error.response.data.error.code);
    }

    // Teste 7: Criação de mensagem válida
    console.log('\n7️⃣ Testando criação de mensagem válida...');
    try {
      const response = await axios.post(`${BASE_URL}/conversation`, {
        message: 'Olá, como você pode me ajudar com música?'
      });
      console.log('✅ Mensagem criada com sucesso');
      console.log('Status:', response.status);
      console.log('Dados:', response.data);
    } catch (error) {
      console.log('❌ Erro inesperado na criação de mensagem');
      console.log('Status:', error.response?.status);
      console.log('Mensagem:', error.response?.data?.error?.message);
    }

    console.log('\n🎉 Todos os testes concluídos!');

  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Servidor está rodando');
    return true;
  } catch (error) {
    console.log('❌ Servidor não está rodando. Inicie o servidor primeiro:');
    console.log('npm run dev');
    return false;
  }
}

// Executar testes
async function runTests() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testMiddlewares();
  }
}

runTests(); 