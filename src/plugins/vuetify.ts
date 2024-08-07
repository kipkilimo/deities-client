import { md3 } from 'vuetify/blueprints'

// Vuetify
import * as directives from 'vuetify/directives'
import * as components from 'vuetify/components'
import { createVuetify, type ThemeDefinition } from 'vuetify'

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Theme
const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#efefef",
    surface: "#fff",
    primary: "#1867c0",
    "primary-darken-1": "#0c0c0c",
    secondary: "#08b5ed",
    "secondary-darken-1": "#177fd4",
    error: "#B00020",
    info: "#4496F3",
    success: "#16DB93",
    warning: "#CB8C00",
  },
};

const dark: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#181833',
        surface: '#161644',
        primary: '#f9c22e',
        'primary-darken-1': '#f39f0d',
        secondary: '#2ec4ff',
        'secondary-darken-1': '#03adf4',
        error: '#B00020',
        info: '#4496F3',
        success: '#16DB93',
        warning: '#CB8C00',
    },
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            light,
            dark,
        },
    },
    blueprint: md3,
})

export default vuetify
