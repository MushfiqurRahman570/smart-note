<template>
  <div class="content-padding">
    <!-- Header Section -->
    <header class="bg-primary text-white p-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <h1 class="display-4 text-center">SmartNotes</h1>
            <p class="lead text-center mb-4">Find and share documents easily</p>

            <!-- Search Bar Form -->
            <form @submit.prevent="goToSearchPage" class="d-flex justify-content-center">
              <input
                v-model="searchQuery"
                class="form-control me-1"
                type="search"
                placeholder="Search for documents..."
                aria-label="Search"
              />
              <button class="btn btn-light" type="submit">Search</button>
            </form>

          </div>
        </div>
      </div>
    </header>

    <!-- Search Documents Section -->
    <section v-if="searchQuery && document.length > 0" class="bg-light py-5">
      <div class="container">
        <h2 class="text-center mb-4">Search Results</h2>
        <div v-if="document.length === 0" class="alert alert-info">No documents found.</div>
        <div class="row">
          <div class="col-md-3" v-for="document in document.slice(0, 8)" :key="document.id">
            <div class="card">
              <!-- Display a static sample image for now -->
              <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Image" class="card-img-top">
              
              <div class="card-body">
                <!-- Display document title -->
                <h5 class="card-title">{{ document.title }}</h5>
                <a :href="`http://localhost:5000${document.filepath}`" class="btn btn-primary" target="_blank">Download</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Documents Section -->
    <section class="bg-light py-5" v-if="document.length === 0 || !searchQuery">
      <div class="container">
        <h2 class="text-center mb-4">Featured Documents</h2>
        <div v-if="documents.length === 0" class="alert alert-info">No documents available.</div>
        <div class="row">
          <div class="col-md-3 mb-4" v-for="document in documents.slice(0, 8)" :key="document.id">
            <div class="card">
              <router-link :to="`/document/${document.id}`">
                <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Image" class="card-img-top">
              </router-link>
              
              <div class="card-body">
                <!-- Display document title -->
              <h5 class="card-title">
                  <router-link :to="`/document/${document.id}`"
                  class="text-dark text-decoration-none">
                  {{ document.title }}
                  </router-link>
              </h5>     
              <p class="card-text">
                <i class="fas fa-download"></i> {{ document.download_count || 0 }}
              </p>              
              <button
                class="btn btn-primary"
                @click="downloadDocument(document.filePath, document.fileName, document.id)">
                Download
              </button>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/content" class="btn btn-secondary mt-3">See All Documents</router-link>
      </div>
    </section>

    <!-- Upload Section -->
    <section class="py-5 bg-secondary text-white">
      <div class="container">
        <h2 class="text-center mb-4">Upload Your Documents in 3 Clicks</h2>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form @submit.prevent="uploadDocument">
          <div class="mb-3">
          <label for="documentTitle" class="form-label">Document Title</label>
              <input v-model="title" type="text" class="form-control" id="documentTitle" placeholder="Enter document title">
          </div>
        <div class="mb-3">
          <label for="documentDescription" class="form-label">Description</label>
            <textarea v-model="description" class="form-control" id="documentDescription" placeholder="Enter document descriptions" rows="3"></textarea>
        </div>
      <div class="mb-3">
          <label for="documentFile" class="form-label">Choose File</label>
          <input type="file" class="form-control" id="documentFile" @change="onFileChange">
          </div>
        <button type="submit" class="btn btn-light w-100">Upload</button>
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
    document: [],
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
  goToSearchPage() {
    if (this.searchQuery.trim()) {
      this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } });
    }
  },
  async downloadDocument(filePath, fileName, documentId) {
  try {
    // 2. Download the file after incrementing the download count
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert("Upload successful!");
        this.title = '';
        this.description = '';
        this.file = null;
        this.fetchDocuments(); // Refresh list
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    }
  }
},
};
</script>

<style scoped>
.content-padding {
  padding-top: 55px;
}
</style>
