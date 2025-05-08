<template>
    <div class="container about-page">
      <div class="text-center mb-5">
        <h1 class="fw-bold mb-3">SmartNotes</h1>
        <p class="lead text-muted">
          SmartNotes is your go-to platform for sharing, accessing, and managing academic and professional documents. Our goal is to simplify knowledge sharing for everyone.
        </p>
      </div>
  
      <div class="text-center mb-4">
        <h3 class="fw-semibold">Meet the Developer</h3>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-4 d-flex justify-content-center">
          <div class="card border-0 shadow text-center p-4" style="width: 100%; max-width: 320px;">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Developer"
              class="rounded-circle mb-3 developer-img"
            />
            <h5 class="fw-bold mb-1">Rahman Md. Moshfiqur</h5>
            <p class="text-muted">Software Engineer | Web & Mobile Developer</p>
            <p class="small text-muted">
              Passionate about building digital solutions that improve lives. Specialized in Laravel, Vue.js, Android, and full-stack systems.
            </p>
          </div>
        </div>
      </div>
    <!-- Trusted By Section -->
    <div class="trusted-by-section text-center mt-5">
      <h4 class="fw-semibold mb-4">Trusted By</h4>
      <div class="logo-slider">
        <div class="slide-track">
          <div class="slide" v-for="n in 2" :key="n">
            <img v-for="(logo, index) in companyLogos" :key="index" :src="logo" alt="Company Logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: "AboutPage",
    data() {
    return {
      companyLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
        "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "https://cdn.worldvectorlogo.com/logos/twitter-6.svg",
        "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
      ]
    };
  }
  };
  </script>
  
  <style scoped>
  .about-page {
    padding-top: 80px;
    padding-bottom: 20px;
    min-height: 100vh;
  }
  
  .developer-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: auto;
  }
  /* Trusted By Slider */
.trusted-by-section {
  margin-top: 60px;
  padding-bottom: 40px;
}

.logo-slider {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.slide-track {
  display: flex;
  width: calc(250px * 52); /* 10 logos repeated twice */
  animation: scroll 60s linear infinite;
}

.slide {
  display: flex;
}

.slide img {
  height: 50px;
  width: 150px;
  margin: 0 20px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.slide img:hover {
  filter: grayscale(0%);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
  </style>
  