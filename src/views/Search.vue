<template>
  <div class="content-padding">
    <!-- Header Search -->
    <header class="text-white py-4 mb-5">
      <div class="container">
        <form @submit.prevent="searchAgain" class="search-bar">
          <input
            v-model="query"
            type="search"
            class="form-control search-input"
            placeholder="Search again..."
          />
          <button class="btn btn-light search-btn" type="submit">Search</button>
        </form>
      </div>
    </header>

    <!-- Search Results -->
    <div class="container pb-5">
      <h2 class="text-center mb-4">Search Results</h2>
      <div v-if="documents.length === 0" class="alert alert-info text-center">
        No documents found.
      </div>

      <div class="row">
        <div class="col-md-3 mb-4" v-for="doc in documents" :key="doc.id">
          <div class="card shadow-sm border-0 h-100 doc-card">
          <router-link :to="`/document/${doc.id}`">
            <img
              :src="require('@/assets/SMBC-Bank-logos.png')"
              alt="Document"
              class="card-img-top"
            />
          </router-link>
            <div class="card-body d-flex flex-column">
            <router-link :to="`/document/${doc.id}`">
              <h5 class="card-title">{{ doc.title }}</h5>
            </router-link>
              <small class="text-muted mb-2">
                <i class="fas fa-download me-1"></i>{{ doc.download_count || 0 }} downloads
              </small>
              <a
                :href="`https://smart-note-production.up.railway.app${doc.filepath}`"
                class="btn btn-outline-primary mt-auto"
                target="_blank"
              >
                Download
              </a>
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
.content-padding {
  padding-top: 55px;
}
.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.search-input {
  max-width: 400px;
  border-radius: 20px;
  padding: 10px 15px;
}
.search-btn {
  border-radius: 20px;
  padding: 8px 20px;
}
.doc-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
}
.card-img-top {
  height: 150px;
  object-fit: contain;
  background-color: #fff;
}
</style>
