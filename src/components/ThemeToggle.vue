<script setup>
import {useTheme} from 'vuetify'


// Utilities
import {computed} from 'vue'
import {use_stored_preferences} from "@/store/stored_preferences";

const theme = useTheme()
const stored_preferences = use_stored_preferences()
const icon = computed(() => theme.global.name.value === 'dark'
  ? 'mdi-weather-night'
  : 'mdi-weather-sunny'
)
const has_toggle = computed(() => !['dark', 'light'].includes(theme.name.value))


</script>

<template>
  <v-btn
    v-if="!has_toggle"
    :icon="icon"
    color="medium-emphasis"
    path="theme"
    @click="stored_preferences.theme = stored_preferences.theme === 'dark' ? 'light' : 'dark'"
  />
</template>


