<template>
  <div class="content-padding">
    <!-- Hero Section -->
    <header class="bg-primary text-white text-center py-5">
      <div class="container">
        <h1 class="display-4 fw-bold">SmartNotes</h1>
        <p class="lead">Find and share documents easily</p>

        <!-- Search -->
        <form @submit.prevent="goToSearchPage" class="d-flex justify-content-center mt-4">
          <input
            v-model="searchQuery"
            class="form-control w-50 me-2"
            type="search"
            placeholder="Search documents..."
            aria-label="Search"
          />
          <button class="btn btn-light" type="submit">Search</button>
        </form>
      </div>
    </header>

    <!-- Featured Documents -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">Featured Documents</h2>
        <div v-if="documents.length === 0" class="alert alert-info text-center">No documents available.</div>
        <div class="row g-4">
          <div v-for="doc in documents.slice(0, 8)" :key="doc.id" class="col-md-3">
            <div class="card h-100 shadow-sm">
              <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Document" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title text-truncate">{{ doc.title }}</h5>
                <p class="card-text text-muted small"><i class="fas fa-download me-1"></i>{{ doc.download_count || 0 }} downloads</p>
                <button class="btn btn-primary w-100" @click="downloadDocument(doc.filePath, doc.fileName, doc.id)">Download</button>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/content" class="btn btn-outline-secondary">See All Documents</router-link>
        </div>
      </div>
    </section>

    <!-- Upload Section -->
    <section class="py-5 bg-white border-top">
      <div class="container">
        <h2 class="text-center mb-4">Upload Your Document</h2>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form @submit.prevent="uploadDocument" class="shadow p-4 rounded bg-light">
              <div class="mb-3">
                <label for="documentTitle" class="form-label">Title</label>
                <input v-model="title" type="text" id="documentTitle" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="documentDescription" class="form-label">Description</label>
                <textarea v-model="description" id="documentDescription" rows="3" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="documentFile" class="form-label">File</label>
                <input type="file" class="form-control" id="documentFile" @change="onFileChange" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      documents: [],
      title: '',
      description: '',
      file: null,
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    async fetchDocuments() {
      try {
        const response = await axios.get('http://localhost:5000/documents');
        this.documents = response.data;
      } catch (error) {
        console.error('Error fetching documents:', error);
        alert('Failed to fetch documents');
      }
    },
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadDocument() {
      if (!this.title || !this.description || !this.file) {
        alert("Please fill in all fields.");
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('title', this.title);
      formData.append('description', this.description);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          alert("✅ Upload successful!");
          this.title = '';
          this.description = '';
          this.file = null;
          this.fetchDocuments();
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("❌ Upload failed!");
      }
    },
    async downloadDocument(filePath, fileName, documentId) {
      try {
        const response = await axios.get(`http://localhost:5000${filePath}`, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await axios.post('http://localhost:5000/increment-download', { id: documentId });
      } catch (error) {
        console.error('Download error:', error);
      }
    },
    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } });
      }
    }
  }
};
</script>

<style scoped>
.content-padding {
  padding-top: 55px;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
