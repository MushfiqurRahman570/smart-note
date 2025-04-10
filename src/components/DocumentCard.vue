<template>
    <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white">
        <img class="w-full" :src="image" alt="Document image">
        <div class="p-4">
            <h2 class="text-xl font-semibold">{{ document.title }}</h2>
            <p class="text-gray-700">{{ document.description }}</p>
            <button class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">View</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "DocumentCard",
    props: {
        document: Object,
        image: String,
    },
};
</script>

<style scoped>
/* You can add custom styling here */
</style>