<template>
  <div class="container my-5">
    <h1 class="text-center mb-4">Upload Document</h1>

    <!-- Upload Form -->
    <form class="mx-auto shadow p-4 bg-white rounded" @submit.prevent="uploadDocument" style="max-width: 600px;">
      <div class="mb-3">
        <label for="documentTitle" class="form-label">Document Title</label>
        <input
          v-model="title"
          type="text"
          id="documentTitle"
          class="form-control"
          placeholder="Enter Document Title"
          required
        />
      </div>

      <div class="mb-3">
        <label for="documentCategory" class="form-label">Document Category</label>
        <select v-model="category" id="documentCategory" class="form-select" required>
          <option disabled value="">Select Category</option>
          <option>Education</option>
          <option>Technology</option>
          <option>Business</option>
          <option>Health</option>
          <option>Finance</option>
          <option>Entertainment</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="documentDescription" class="form-label">Document Description</label>
        <textarea
          v-model="description"
          id="documentDescription"
          class="form-control"
          rows="4"
          placeholder="Enter Document Description"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="documentFile" class="form-label">Choose Document File</label>
        <input type="file" id="documentFile" class="form-control" @change="onFileChange" required />
      </div>

      <button type="submit" class="btn btn-primary w-100">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { upload } from '@vercel/blob/client';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "upload",
  data() {
    return {
      title: '',
      description: '',
      category: '',
      file: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadDocument() {
      if (!this.file || !this.title || !this.description || !this.category) {
        alert('Please fill in all fields and choose a file.');
        return;
      }

      const storedUser = localStorage.getItem('user');
      const parsedUser = JSON.parse(storedUser);
      const uploaderName = parsedUser?.username || 'SmartNotes User';

      try {
        // 1. Upload file to Vercel Blob
        const { url: blobUrl } = await upload(this.file.name, this.file, {
          access: 'public',
        });

        // 2. Send metadata to your backend
        const metadata = {
          title: this.title,
          description: this.description,
          category: this.category,
          uploaderName,
          fileSize: this.file.size,
          blobUrl: blobUrl,
          fileName: this.file.name,
        };

        const response = await axios.post('http://localhost:5000/upload', metadata);

        if (response.status === 200) {
          alert('✅ Document uploaded successfully!');
          this.resetForm();
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Upload failed. Please try again.');
      }
    },

    resetForm() {
      this.title = '';
      this.description = '';
      this.category = '';
      this.file = null;
      document.getElementById('documentFile').value = null;
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 55px;
}
</style>
