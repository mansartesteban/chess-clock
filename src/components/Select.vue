<template>
  <form class="max-w-sm mx-auto">
    <label
      v-if="label"
      :for="uniqueId"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }}</label
    >
    <select
      v-model="model"
      :id="uniqueId"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option
        v-for="option in options"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </form>
</template>

<script setup>
  const props = defineProps({
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: "Choisir une option",
    },
  });

  const model = defineModel();

  let componentIdCounter = 0;

  // Génère un identifiant unique basé sur le nom du composant
  const generateUniqueId = (prefix) => {
    componentIdCounter += 1;
    return `${prefix}-${componentIdCounter}`;
  };

  // Identifiant unique pour ce composant
  const uniqueId = generateUniqueId("Select");
</script>
