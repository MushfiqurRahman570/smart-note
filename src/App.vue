<template>
  <div>
    <Navbar />
    <router-view />
    <!-- Footer Component -->
    <SmartNotesFooter />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import SmartNotesFooter from './components/Footer.vue'; // Updated name

export default {
  name: 'App',
  components: {
    Navbar,
    SmartNotesFooter,  // Updated name
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
