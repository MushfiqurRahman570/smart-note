<template>
    <div class="container mt-5">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter your username" required>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password" required>
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <p class="mt-3">
      Already have an account?
      <router-link to="/login" class="btn btn-outline-primary ms-2">Login</router-link>
    </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('http://localhost:5000/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          });
          alert(response.data.message);
          this.$router.push('/login'); // Redirect to login page after registration
        } catch (error) {
          console.error('Registration error:', error);
          alert('Registration failed!');
        }
      },
    },
  };
  </script>
  