<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <a class="navbar-brand" href="#">SmartNotes</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/upload" active-class="active-link">Upload</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
          <li class="nav-item">
            <a class="btn btn-light ms-2" href="#">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Navbar",
};
</script>

<style scoped>
/* Custom Navbar styles if needed */
</style>
