<template>
  <div class="container my-5">
    <h1 class="text-center mb-4">Upload Document</h1>

    <!-- Upload Form -->
    <form class="mx-auto" @submit.prevent="uploadDocument" style="max-width: 600px;">
      <div class="mb-3">
        <label for="documentTitle" class="form-label">Document Title</label>
        <input v-model="title" type="text" id="documentTitle" class="form-control" placeholder="Enter Document Title" />
      </div>

      <div class="mb-3">
        <label for="documentDescription" class="form-label">Document Description</label>
        <textarea v-model="description" id="documentDescription" class="form-control" rows="4" placeholder="Enter Document Description"></textarea>
      </div>

      <div class="mb-3">
        <label for="documentFile" class="form-label">Choose Document File</label>
        <input type="file" id="documentFile" class="form-control" @change="onFileChange" />
      </div>

      <button type="submit" class="btn btn-primary w-100">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "upload",
  data() {
    return {
      title: '',
      description: '',
      file: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadDocument() {
      if (!this.file || !this.title || !this.description) {
        alert("Please fill in all fields and choose a file.");
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
          alert('Document uploaded successfully');
          this.title = '';
          this.description = '';
          this.file = null;
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Upload failed. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 55px;
}
</style>
