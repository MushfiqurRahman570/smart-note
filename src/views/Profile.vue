<template>
  <div class="container mt-5 profile-page text-center content-padding">
    <div class="container mt-5 profile-page text-center content-padding position-relative">
    <button @click="logout" class="btn btn-danger logout-btn">Logout</button>
  </div>
    <img
      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
      alt="Profile"
      class="profile-img mb-3"
    />
    <h3>{{ user.name }}</h3>
    <p class="text-muted">{{ user.email }}</p>
    
    <!-- User's Uploaded Documents -->
    <section class="bg-light py-2 mt-2" v-if="userDocuments.length > 0">
      <div class="container">
        <h4 class="mb-4">Your Uploaded Documents</h4>
        <div class="row">
          <div class="col-md-3 mb-4" v-for="doc in userDocuments" :key="doc.id">
            <div class="card h-100">
              <router-link :to="`/document/${doc.id}`">
                <img src="@/assets/SMBC-Bank-logos.png" alt="Doc" class="card-img-top">
              </router-link>
              <div class="card-body">
                <h5 class="card-title">
                  <router-link :to="`/document/${doc.id}`" class="text-dark text-decoration-none">
                    {{ doc.title }}
                  </router-link>
                </h5>
                <p class="card-text">
                  <i class="fas fa-download"></i> {{ doc.download_count || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- If no uploads -->
    <div class="mt-4" v-else>
      <p class="text-muted">You have not uploaded any documents yet.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import emitter from "@/eventBus";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: {
        name: '',
        email: ''
      },
      allDocuments: [],
    };
  },
  computed: {
    userDocuments() {
      return this.allDocuments.filter(doc => doc.uploaderName === this.user.name);
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        this.user.name = parsedUser.username || 'SmartNotes User';
        this.user.email = parsedUser.email || '';
        this.fetchDocuments(); // fetch all documents after setting user
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  },
  methods: {
    async fetchDocuments() {
      try {
        const response = await axios.get('${process.env.VUE_APP_API_URL}/documents');
        this.allDocuments = response.data || [];
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
      emitter.emit("authChanged", false);
    },
    async downloadDocument(filePath, fileName) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/download/${filePath}`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Download failed.");
      }
    }
  }
};
</script>

<style scoped>
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}
.content-padding {
  padding-top: 1px;
}
.card-img-top {
  height: 160px;
  object-fit: cover;
}
.logout-btn {
  position: absolute;
  right: 10px;
}
</style>
