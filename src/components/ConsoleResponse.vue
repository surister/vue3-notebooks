<script setup>
import TracebackDialog from "@/components/ConsoleResponseTracebackDialog.vue";

const props = defineProps(
    {
      data: {
        type: Object,
        default: null
      }
    }
)
</script>

<template>
  <v-card v-if="data.type" class="rounded-0 border-s-sm border-e-sm">
    <template #text>
      <span :class="[ data.type === 'success' ? 'text-green-accent-3' : 'text-red-accent-4', 'text-h5' ]">
        {{ data.title }}
      </span> -
      <span class="text-h6">{{ data.subtitle }}</span>
    </template>

    <v-card-actions v-if="data.error_trace">

      <traceback-dialog  :text="data.error_trace"/>

    </v-card-actions>
  </v-card>


</template>

<style scoped>

</style>
