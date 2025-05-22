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
        <label for="priceInput" class="form-label">Price (USD)</label>
        <input
          v-model="priceInput"
          type="text"
          id="priceInput"
          class="form-control"
          placeholder="Enter Price (e.g., 10.00)"
          @input="formatPrice"
          required
        />
    <small v-if="priceDisplay" class="text-muted">Price: {{ priceDisplay }}</small>
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

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "upload",
  data() {
    return {
      title: '',
      description: '',
      category: '',
      file: null,
      priceInput: '',
      priceDisplay: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
     formatPrice() {
    // Remove any characters except digits and dot
    let val = this.priceInput.replace(/[^0-9.]/g, '');

    this.priceInput = val;

    // Check if value is 0 or 00.00 or empty -> display "Free"
    if (val === '' || parseFloat(val) === 0) {
      this.priceDisplay = 'Free';
    } else {
      this.priceDisplay = `৳${val}`;
    }
  },
    async uploadDocument() {
      if (!this.file || !this.title || !this.description || !this.category|| !this.priceInput) {
        alert('Please fill in all fields and choose a file.');
        return;
      }

      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const parsedUser = JSON.parse(storedUser);
      const uploaderName = parsedUser?.username || 'SmartNotes User';
      const price = parseFloat(this.priceInput);

      if (!token || !storedUser) {
        alert('⚠️ Please log in to upload documents.');
        this.$router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('title', this.title);
      formData.append('description', this.description);
      formData.append('category', this.category);
      formData.append('uploaderName', uploaderName);
      formData.append('fileSize', this.file.size);
      formData.append('price', price);

        try {
          const response = await axios.post(`https://smart-note-production.up.railway.app/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          });

        if (response.status === 200) {
          alert('Document uploaded successfully');
          this.title = '';
          this.description = '';
          this.file = null;
          this.resetForm();
        }
      } catch (error) {
        console.error('Upload error:', error);
        console.error('Error response:', error.response);
        alert('❌ Upload failed. Please try again.');
      }
    },
    resetForm() {
      this.title = '';
      this.description = '';
      this.category = '';
      this.file = null;
      this.priceInput = '';
      this.priceDisplay = '';
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
