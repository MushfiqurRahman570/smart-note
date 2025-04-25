<!-- src/views/Search.vue -->
<template>
    <div class="content-padding">
      <header class=" text-white p-4">
        <div class="container">
          <form @submit.prevent="searchAgain" class="d-flex justify-content-center">
            <input v-model="query" type="search" class="form-control me-1" placeholder="Search again..." />
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </header>
  
      <div class="container py-5">
        <div v-if="documents.length === 0" class="alert alert-info text-center">No documents found.</div>
        <div class="row">
          <div class="col-md-3" v-for="doc in documents" :key="doc.id">
            <div class="card mb-4">
              <img :src="require('@/assets/SMBC-Bank-logos.png')" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title">{{ doc.title }}</h5>
                <a :href="`http://localhost:5000${doc.filepath}`" class="btn btn-primary" target="_blank">Download</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'SearchPage',
    data() {
      return {
        documents: [],
        query: this.$route.query.q || '',
      };
    },
    mounted() {
      this.fetchSearchResults();
    },
    methods: {
      async fetchSearchResults() {
        if (!this.query) return;
        try {
          const res = await axios.get('http://localhost:5000/documentsbySearch', {
            params: { search: this.query },
          });
          this.documents = res.data;
        } catch (err) {
          console.error('Error fetching search results:', err);
          alert('Failed to fetch search results.');
        }
      },
      searchAgain() {
        this.$router.push({ path: '/search', query: { q: this.query } });
        this.fetchSearchResults();
      },
    },
  };
  </script>
  <style scoped>
.container {
  padding-top: 55px;
}
  </style>