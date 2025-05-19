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
            
              <div class="card-body">
                <div class="position-relative">
                  <div @click="incrementViewCount(doc.id)">
              <router-link :to="`/document/${doc.id}`">
                <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Document" class="card-img-top" />
              </router-link>
              </div>  
              <div class="overlay-info d-flex justify-content-between px-2 py-1">
                <small class="text-white">
                  <i class="fas fa-file-alt me-1"></i> {{ formatFileSize(doc.fileSize || doc.file_size) }}
                </small>
              <small class="text-white">
                <i class="fas fa-calendar-alt me-1"></i> {{ formatDate(doc.upload_date) }}
              </small>
            </div>
          </div>
                <h5 class="fw-bold text-truncate mb-1">{{ doc.title }}</h5>
                <p class="text-muted small mb-0">
                  <i class="fas fa-user me-2"></i> {{ doc.uploaderName || 'Unknown Author' }}
                </p>
                <p class="card-text text-muted small">
                  <i class="fas fa-eye me-2"></i>{{ doc.view_count || 0 }} views &nbsp;&nbsp;
                  <i class="fas fa-download me-2"></i>{{ doc.download_count || 0 }} downloads
                </p>
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
        const response = await axios.get('https://smart-note-production.up.railway.app/documents');
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
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/upload`, formData, {
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
        const response = await axios.get(`https://smart-note-production.up.railway.app${filePath}`, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await axios.post('https://smart-note-production.up.railway.app/increment-download', { id: documentId });
      } catch (error) {
        console.error('Download error:', error);
      }
    },
    async incrementViewCount(documentId) {
    try {
      await axios.post('https://smart-note-production.up.railway.app/increment-view', { id: documentId });
        } catch (error) {
      console.error('View increment error:', error);
      }
     },
    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } });
      }
    },
     formatFileSize(bytes) {
      if (!bytes && bytes !== 0) return 'N/A';
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Utility method to format upload date (YYYY-MM-DD or ISO string)
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
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
.overlay-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(83, 81, 81, 0.6); /* semi-transparent dark background */
  font-size: 0.75rem;
}
</style>
