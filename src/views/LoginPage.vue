<template>
    <div class="container mt-5">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p class="mt-3">
      Don't have an account?
      <router-link to="/register" class="btn btn-outline-secondary ms-2">Register</router-link>
    </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await axios.post('http://localhost:5000/login', {
            email: this.email,
            password: this.password,
          });
          localStorage.setItem('token', response.data.token); // Store JWT token in localStorage
          alert(response.data.message);
          this.$router.push('/'); // Redirect to home page after login
        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed!');
        }
      },
    },
  };
  </script>
  