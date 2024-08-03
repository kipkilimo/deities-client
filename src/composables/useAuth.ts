// src/composables/useAuth.js
import { ref } from 'vue';

const user = ref(null);

export function useAuth() {
    // Simulate authentication
    const login = (userInfo: null) => {
        user.value = userInfo;
    };

    const logout = () => {
        user.value = null;
    };

    return { user, login, logout };
}
