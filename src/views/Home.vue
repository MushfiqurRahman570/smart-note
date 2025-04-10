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
            <form class="d-flex justify-content-center">
              <input
                class="form-control me-2"
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

    <!-- Featured Documents Section -->
    <section class="bg-light py-5">
  <div class="container">
    <h2 class="text-center mb-4">Featured Documents</h2>
    <!-- No documents available message -->
    <div v-if="documents.length === 0" class="alert alert-info">No documents available.</div>
    
    <!-- Display documents if available -->
    <div class="row">
      <div class="col-md-4" v-for="document in documents" :key="document.id">
        <div class="card">
          <!-- Display a static sample image for now -->
          <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Image" class="card-img-top">
          
          <div class="card-body">
            <!-- Display document title and description -->
            <h5 class="card-title">{{ document.title }}</h5>
            <p class="card-text">{{ document.description }}</p>
            
            <!-- Download button linked to document's file path -->
            <a :href="`http://localhost:5000${document.filepath}`" class="btn btn-primary" target="_blank">Download</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- Upload Section -->
    <section class="py-5 bg-secondary text-white">
      <div class="container">
        <h2 class="text-center mb-4">Upload Your Documents in 3 Clicks</h2>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form>
              <div class="mb-3">
                <label for="documentTitle" class="form-label">Document Title</label>
                <input type="text" class="form-control" id="documentTitle" placeholder="Enter document title">
              </div>
              <div class="mb-3">
                <label for="documentFile" class="form-label">Choose File</label>
                <input type="file" class="form-control" id="documentFile">
              </div>
              <button type="submit" class="btn btn-light w-100">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="bg-dark text-white py-4">
      <div class="container text-center">
        <p>&copy; 2025 SmartNotes. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      documents: [],
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
}
  },
};
</script>

<style scoped>
.content-padding {
  padding-top: 55px;
}
</style>
