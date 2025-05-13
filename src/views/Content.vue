<template>
  <div class="content-padding">
    <section class="bg-light py-5">
      <div class="container">
        <!-- Search Bar -->
        <form @submit.prevent="goToSearchPage" class="search-bar mb-5">
          <input
            v-model="searchQuery"
            class="form-control search-input"
            type="search"
            placeholder="Search for documents..."
            aria-label="Search"
          />
          <button class="btn btn-primary search-btn" type="submit">Search</button>
        </form>

        <h2 class="text-center mb-4">All Documents</h2>

        <div v-if="documents.length === 0" class="alert alert-info text-center">
          No documents found.
        </div>

        <div class="row">
          <div class="col-md-3 mb-4" v-for="document in documents" :key="document.id">
            <div class="card shadow-sm border-0 h-100 doc-card">
            <router-link :to="`/document/${document.id}`">
              <img
                :src="require('@/assets/SMBC-Bank-logos.png')"
                alt="Doc Image"
                class="card-img-top"
              />
            </router-link>
              <div class="card-body d-flex flex-column">
              <router-link :to="`/document/${document.id}`">
                <h5 class="card-title mb-2">{{ document.title }}</h5>
              </router-link>
                <small class="text-muted mb-3">
                  <i class="fas fa-download me-1"></i>{{ document.download_count || 0 }} downloads
                </small>
                <a class="btn btn-outline-primary mt-auto"
                  @click="downloadDocument(document.filepath, document.title + '.pdf', document.id)"> Download </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ContentPage',
  data() {
    return {
      documents: [],
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    async fetchDocuments() {
      try {
        const response = await axios.get('https://smartnotes-backend-cxul.onrender.com/documents');
        this.documents = response.data;
      } catch (error) {
        console.error('Error fetching documents:', error);
        alert('Failed to fetch documents');
      }
    },
    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } });
      }
    },
    async downloadDocument(filePath, fileName, documentId) {
      try {
        const response = await axios.get(`https://smartnotes-backend-cxul.onrender.com${filePath}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await axios.post('https://smartnotes-backend-cxul.onrender.com/increment-download', { id: documentId });
      } catch (error) {
        console.error('Download error:', error);
      }
    }
  }
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
