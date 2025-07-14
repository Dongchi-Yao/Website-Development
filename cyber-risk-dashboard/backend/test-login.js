import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing login with non-existent user...');
    
    const response = await fetch('http://localhost:50003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    console.log('\nTesting login with existing user but wrong password...');
    
    const response2 = await fetch('http://localhost:50003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'constructioncyberdashboard.app@gmail.com',
        password: 'wrongpassword'
      }),
    });

    const data2 = await response2.json();
    console.log('Response status:', response2.status);
    console.log('Response data:', data2);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin(); 