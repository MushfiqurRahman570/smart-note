<template>
    <div class="container mx-auto">
        <h1 class="text-3xl font-bold my-8">Search Documents</h1>
        <input type="text" v-model="searchQuery" placeholder="Search by title..." class="p-2 border rounded w-full" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <DocumentCard v-for="doc in filteredDocuments" :key="doc.id" :document="doc" :image="doc.image" />
        </div>
    </div>
</template>

<script>
import DocumentCard from "../components/DocumentCard.vue";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Search",
    components: {
        DocumentCard,
    },
    data() {
        return {
            searchQuery: "",
            documents: [
                { id: 1, title: "Business Plan", description: "Sample document 1", image: "path/to/image1.jpg" },
                { id: 2, title: "JavaScript Guide", description: "Sample document 2", image: "path/to/image2.jpg" },
                // Add more documents
            ],
        };
    },
    computed: {
        filteredDocuments() {
            return this.documents.filter(doc =>
                doc.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
};
</script>

<style scoped>
/* You can add custom styling here */
</style>