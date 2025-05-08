<template>
  <nav class="navbar navbar-expand-lg shadow-sm fixed-top custom-navbar">
    <div class="container">
      <!-- Brand Logo -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/logo.png" alt="SmartNotes Logo" height="40" class="me-2" />
        <span class="fw-bold text-dark">SmartNotes</span>
      </router-link>

      <!-- Toggle Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center gap-2">
          <li class="nav-item">
            <router-link class="nav-link custom-link" to="/" exact-active-class="active-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link custom-link" to="/upload" active-class="active-link">Upload</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link custom-link" to="/content" active-class="active-link">Content</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link custom-link" to="/about" active-class="active-link">About</router-link>
          </li>

          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="btn btn-outline-primary rounded-pill px-3" to="/login">Login</router-link>
          </li>

          <li class="nav-item" v-else>
            <router-link to="/profile" class="nav-link p-0">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Profile"
                class="rounded-circle profile-icon"
              />
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script>
import emitter from "@/eventBus";
export default {
  name: "NavBarComponent",
  data() {
    return {
      loggedIn: localStorage.getItem('token') !== null
    };
  },
  created() {
    emitter.on("authChanged", (status) => {
      this.loggedIn = status;
    });
  },
  computed: {
    isLoggedIn() {
      return this.loggedIn;
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: #ffffff !important;
  border-bottom: 1px solid #eaeaea;
}

.navbar-brand span {
  font-size: 1.25rem;
  color: #333;
}

.custom-link {
  color: #333 !important;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 20px;
  transition: background 0.3s;
}

.custom-link:hover,
.active-link {
  background-color: #f0f0f0;
  color: #007bff !important;
}

.profile-icon {
  width: 36px;
  height: 36px;
  transition: transform 0.3s;
}

.profile-icon:hover {
  transform: scale(1.1);
}
</style>

