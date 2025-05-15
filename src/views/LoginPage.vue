<template>
  <div class="login-page d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow login-card">
      <h2 class="text-center mb-4">Login</h2>
      
      <form @submit.prevent="loginUser">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email" required>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password" required>
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>

      <div class="text-center mt-3">
        <p>Don't have an account?</p>
        <router-link to="/register" class="btn btn-outline-secondary w-100">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import emitter from "@/eventBus";

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('https://smart-note-production.up.railway.app/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        emitter.emit("authChanged", true);
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        } else {
          console.warn("No user object in login response!");
        }

        alert(response.data.message);
        this.$router.push('/profile');
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed!');
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  padding-top: 80px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}
</style>
