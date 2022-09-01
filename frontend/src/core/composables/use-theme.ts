import {
  ref, watchEffect, onMounted,
} from 'vue'

export type ThemeColor = 'light' | 'dark'

const themeColor = ref<ThemeColor>('light')

const useTheme = () => {
  const setThemeColor = (color: ThemeColor) => {
    window.localStorage.setItem('themeColor', color)
    themeColor.value = color
  }

  onMounted(() => {
    const savedThemeColor = window.localStorage.getItem('themeColor') as ThemeColor | undefined
    setThemeColor(savedThemeColor || 'light')
  })

  watchEffect(() => {
    document.body.setAttribute('data-theme-color', themeColor.value)
  })

  return { themeColor, setThemeColor }
}

export default useTheme
