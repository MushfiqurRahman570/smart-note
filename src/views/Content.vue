<template>
    <div class="content-padding">
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-3">All Documents</h2>
          <div v-if="documents.length === 0" class="alert alert-info">No documents found.</div>
  
          <div class="row">
            <div class="col-md-3" v-for="document in documents" :key="document.id">
              <div class="card">
                <img :src="require('@/assets/SMBC-Bank-logos.png')" alt="Image" class="card-img-top">
                <div class="card-body">
                  <h5 class="card-title">{{ document.title }}</h5>
                  <a :href="`http://localhost:5000${document.filepath}`" class="btn btn-primary" target="_blank">Download</a>
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
    }
  };
  </script>
  
  <style scoped>
  .content-padding {
    padding-top: 55px;
  }
  </style>
  