<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="@/assets/logo.png" alt="SmartNotes Logo" height="35" />
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/" exact-active-class="active-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/upload" active-class="active-link">Upload</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/content" active-class="active-link">Content</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" style="color: white;">About</a>
          </li>

          <!-- Conditional Rendering for Login/Logout -->
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="btn btn-light ms-2" to="/login">Login</router-link>
          </li>

          <!-- Profile Dropdown if Logged In -->
          <li class="nav-item" v-if="isLoggedIn">
            <div class="dropdown">
              <button class="btn btn-light dropdown-toggle ms-2" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                {{ userProfile.email }} <!-- or any profile information -->
              </button>
              <ul class="dropdown-menu" aria-labelledby="profileDropdown">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBarComponent", 
    data() {
    return {
      userProfile: JSON.parse(localStorage.getItem('user')) || {}, // Get user profile from localStorage
    };
  },
  computed: {
    // Check if user is logged in by checking the token in localStorage
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    },
  },
  methods: {
    logout() {
      // Remove token and user profile from localStorage and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
/* Custom Navbar styles if needed */
</style>
