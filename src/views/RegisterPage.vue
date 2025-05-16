<template>
  <div class="register-page d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow register-card">
      <h2 class="text-center mb-4">Registeration</h2>

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

        <button type="submit" class="btn btn-primary w-100">Register</button>
      </form>

      <div class="text-center mt-3">
        <p>Already have an account?</p>
        <router-link to="/login" class="btn btn-outline-primary w-100">Login</router-link>
      </div>
    </div>
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
        const response = await axios.post('${process.env.VUE_APP_API_URL}/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        alert(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Registration failed!');
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  padding-top: 80px;
}

.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}
</style>
