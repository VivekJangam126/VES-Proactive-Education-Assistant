#!/usr/bin/env node

/**
 * Authentication API Test Script
 * Tests login and registration endpoints
 * 
 * Run with: node auth-test.js
 */

const BASE_URL = 'http://localhost:5000/api';

const testEndpoints = async () => {
  console.log('\n=== Authentication API Test ===\n');

  // Test 1: Admin Registration
  console.log('1. Testing Admin Registration...');
  try {
    const adminRegResponse = await fetch(`${BASE_URL}/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgName: 'Test School ' + Date.now(),
        orgType: 'School',
        name: 'Test Admin',
        email: 'admin' + Date.now() + '@test.org',
        password: 'TestPass123'
      })
    });
    
    const adminRegData = await adminRegResponse.json();
    if (adminRegResponse.ok) {
      console.log('✅ Admin Registration SUCCESS');
      console.log('   Token:', adminRegData.token ? 'Generated' : 'Not generated');
      console.log('   Organization ID:', adminRegData.organisation?._id || 'Not found');
      
      // Test 2: Admin Login
      console.log('\n2. Testing Admin Login...');
      const adminEmail = adminRegData.admin.email;
      const adminLoginResponse = await fetch(`${BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: 'TestPass123'
        })
      });
      
      const adminLoginData = await adminLoginResponse.json();
      if (adminLoginResponse.ok) {
        console.log('✅ Admin Login SUCCESS');
        console.log('   Token:', adminLoginData.token ? 'Generated' : 'Not generated');
      } else {
        console.log('❌ Admin Login FAILED');
        console.log('   Error:', adminLoginData.message);
      }

      // Test 3: Teacher Registration
      console.log('\n3. Testing Teacher Registration...');
      const teacherRegResponse = await fetch(`${BASE_URL}/auth/teacher/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Teacher',
          email: 'teacher' + Date.now() + '@test.org',
          password: 'TestPass123',
          orgId: adminRegData.organisation._id
        })
      });
      
      const teacherRegData = await teacherRegResponse.json();
      if (teacherRegResponse.ok) {
        console.log('✅ Teacher Registration SUCCESS');
        console.log('   Status:', teacherRegData.teacher?.status || 'Not set');
        console.log('   Teacher ID:', teacherRegData.teacher?._id || 'Not found');
        
        // Test 4: Teacher Login (should fail - not approved)
        console.log('\n4. Testing Teacher Login (PENDING - should fail)...');
        const teacherLoginResponse = await fetch(`${BASE_URL}/auth/teacher/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: teacherRegData.teacher.email,
            password: 'TestPass123'
          })
        });
        
        const teacherLoginData = await teacherLoginResponse.json();
        if (!teacherLoginResponse.ok && teacherLoginData.message.includes('not approved')) {
          console.log('✅ Teacher Login Blocked (CORRECT - account not approved)');
          console.log('   Message:', teacherLoginData.message);
        } else if (teacherLoginResponse.ok) {
          console.log('❌ Teacher Login SUCCEEDED (INCORRECT - should be blocked for PENDING)');
        } else {
          console.log('❌ Teacher Login Error:', teacherLoginData.message);
        }
      } else {
        console.log('❌ Teacher Registration FAILED');
        console.log('   Error:', teacherRegData.message);
      }
    } else {
      console.log('❌ Admin Registration FAILED');
      console.log('   Error:', adminRegData.message);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('   Make sure backend server is running at http://localhost:5000');
  }

  console.log('\n=== Test Complete ===\n');
};

testEndpoints();
