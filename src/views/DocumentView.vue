<template>
  <div class="container py-5 content-padding">
    <!-- Document Title and Description -->
    <h2 class="text-center mb-3 fw-bold">{{ document.title }}</h2>
    <p class="text-center text-muted fs-5">{{ document.description }}</p>

    <!-- PDF Viewer -->
    <div class="d-flex justify-content-center my-4">
      <iframe
        v-if="document.filePath"
        :src="`https://smart-note-production.up.railway.app${encodeURI(document.filePath)}`"
        width="90%"
        height="600px"
        frameborder="0"
        class="shadow rounded"
      ></iframe>
      <div v-else class="alert alert-warning">Loading document...</div>
    </div>

    <!-- Related Documents Section -->
    <div v-if="relatedDocuments.length" class="mt-5">
      <h4 class="mb-4 text-center">📚 Related Documents</h4>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        <div v-for="related in relatedDocuments" :key="related.id" class="col">
          <div class="card h-100 shadow-sm border-0">
           <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Document" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ related.title }}</h5>
              <p class="card-text text-muted">{{ related.category }}</p>
              <button @click="goToDocument(related.id)" class="btn btn-outline-primary btn-sm">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentView",
  data() {
    return {
      document: {},
      relatedDocuments: [],
    };
  },
  mounted() {
    const documentId = this.$route.params.id;
    this.fetchDocumentById(documentId);
  },
  methods: {
    async fetchDocumentById(id) {
      try {
        const response = await axios.get(`https://smart-note-production.up.railway.app/document/${id}`);
        this.document = response.data;

        // Fetch related documents (limit 8)
        this.fetchRelatedDocuments(this.document.category, id);
      } catch (error) {
        console.error("Error fetching document:", error);
        alert("Failed to load document.");
      }
    },
    async fetchRelatedDocuments(category, currentId) {
      try {
        const response = await axios.get(`https://smart-note-production.up.railway.app/documents`);
        const allDocs = response.data;

        // Filter by category and exclude current document
        this.relatedDocuments = allDocs
          .filter(doc => doc.category === category && doc.id !== parseInt(currentId))
          .slice(0, 8); // Limit to 8
      } catch (error) {
        console.error("Error fetching related documents:", error);
      }
    },
    goToDocument(id) {
    if (id !== this.$route.params.id) {
      this.$router.push(`/document/${id}`);
    } else {
    this.fetchDocumentById(id);
    }
  },
    watch: {
    '$route.params.id'(newId) {
      this.fetchDocumentById(newId);
    }
  }
  },
};
</script>

<style scoped>
iframe {
  border: 1px solid #ccc;
  border-radius: 12px;
}
.content-padding {
  padding-top: 80px;
}
.card-title {
  font-size: 1rem;
}
</style>
