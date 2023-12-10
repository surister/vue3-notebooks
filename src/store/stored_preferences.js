import {defineStore} from "pinia";
import {reactive, toRefs, watch} from "vue";
import {useTheme} from "vuetify";

export const use_stored_preferences = defineStore('preferences', () => {
  const state = reactive({
    theme: 'dark'
  })
  const theme = useTheme()
  theme.global.name.value = state.theme

  watch(
    () => state.theme, async (value) => {
      theme.global.name.value = value
    }
  )
  return {
    ...toRefs(state)
  }
}, {
  persist: true
})
