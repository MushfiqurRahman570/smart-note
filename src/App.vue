<template>
  <div id="app">
    <Navbar />
    <div id="main-content">
      <router-view />
    </div>
    <SmartNotesFooter />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import SmartNotesFooter from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    SmartNotesFooter,
  },
};
</script>

<style>
/* 1. Make html, body, and #app take full height */
html, body, #app {
  height: 100%;
  margin: 0;
}

/* 2. Make #app a flex column */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 3. Make the main content area grow to fill available space */
#main-content {
  flex: 1;
}

/* Optional: style your footer if needed */
footer {
  background-color: #f1f1f1;
  padding: 20px;
}
</style>
