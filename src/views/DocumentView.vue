<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">{{ document.title }}</h2>
    <p class="text-center text-muted">{{ document.description }}</p>

    <!-- Display PDF -->
    <div class="d-flex justify-content-center">
      <iframe
        v-if="document.filePath"
        :src="`https://smart-note-production.up.railway.app${encodeURI(document.filePath)}`"
        width="350px"
        height="300px"
        frameborder="0"
      ></iframe>
      <div v-else class="alert alert-warning">Loading document...</div>
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
      } catch (error) {
        console.error("Error fetching document:", error);
        alert("Failed to load document.");
      }
    },
  },
};
</script>

<style scoped>
iframe {
  border: 1px solid #ccc;
  border-radius: 8px;
}
.content-padding {
  padding-top: 55px;
}
</style>
