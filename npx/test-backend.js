// Script to test backend connection
const testBackendConnection = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  console.log('🔍 Testing backend connection...');
  console.log('📍 API URL:', apiUrl);
  
  try {
    const response = await fetch(apiUrl);
    console.log('✅ Backend is reachable!');
    console.log('📊 Status:', response.status);
  } catch (error) {
    console.error('❌ Backend is NOT reachable!');
    console.error('💥 Error:', error.message);
    console.log('\n⚠️  Make sure your backend is running on:', apiUrl);
  }
};

// Run test
testBackendConnection();

export default testBackendConnection;
