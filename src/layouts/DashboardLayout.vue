<template>
    <v-app full-height>
        <v-layout full-height>
            <v-app-bar class="!fixed">
                <router-link to="/home" class="px-8 flex items-center w-64">
                    <Logo :width="50" :height="40" />
                </router-link>

                <v-btn icon @click="drawer = !drawer">
                    <span class="i-iconoir-menu text-2xl"></span>
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn icon variant="text" color="inherit">
                    <span class="i-iconoir-bell text-2xl"></span>
                </v-btn>
                <LocaleToggler />
                <ThemeToggler />
            </v-app-bar>
            <v-navigation-drawer rounded v-model="drawer" class="m-2 max-h-[calc(100%-82px)] !fixed" :rail="rail"
                :location="isRTL ? 'end' : 'start'">
                <template v-slot:prepend>
                    <div class="p-2 flex" :class="{ 'justify-center': rail }">
                        <v-btn icon size="sm" variant="text" @click="rail = !rail">
                            <span :class="rail ? 'rotate-180' : 'rotate-0'"
                                class="i-iconoir-fast-arrow-left text-xl rtl:transform rtl:rotate-180 transition-transform duration-300"></span>
                        </v-btn>
                    </div>
                </template>

                <v-list density="compact" nav>
                    <v-list-item height="100"
                        :prepend-avatar="`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`"
                        :title="user.username" :subtitle="user.email" class="me-4"></v-list-item>

                    <v-divider></v-divider>
                    <v-list-item v-for="item in sidebarItems" :key="item.value" :value="item.value" :to="item.path">
                        <template v-slot:prepend>
                            <v-icon>{{ item.iconClass }}</v-icon>
                        </template>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item>
                </v-list>
                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn :block="!rail" :icon="rail" :size="rail ? 'small' : undefined" @click="logout">
                            <v-icon class="i-iconoir-log-out text-xl"></v-icon>
                            <span v-show="!rail">
                                {{ $t('dashboard.sidebar.logout') }}
                            </span>
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
            <v-main class="text-slate-700 dark:text-slate-300">
                <v-container>
                    <RouterView />
                </v-container>
            </v-main>
        </v-layout>
    </v-app>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";

const { t, locale } = useI18n()
import { useUserStore } from "../stores/users";

const user = ref<any>(null);
onBeforeMount(() => {
    if (typeof localStorage !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                user.value = parsedUser && parsedUser[0] ? parsedUser[0] : {};
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }
});

const userStore = useUserStore();
function logout() {
    userStore.logout()
}
// papers: Papers
// poster: Posters
// poll: Poll
// news: News
const drawer = ref(true)
const rail = ref(false)
const isRTL = computed(() => locale.value === 'ar')
const sidebarItems = computed(() => [
    {
        title: t('dashboard.sidebar.dashboard-overview'),
        value: 'dashboard-overview',
        iconClass: 'i-iconoir-dashboard-speed me-4 text-xl',
        path: '/dashboard/overview',
    },
    {
        title: t('dashboard.sidebar.papers'),
        value: 'papers',
        iconClass: 'i-iconoir-google-docs me-4 text-xl',
        path: '/dashboard/papers',
    },
    {
        title: t('dashboard.sidebar.poster'),
        value: 'poster',
        iconClass: 'mdi-image-frame me-4 text-xl',
        path: '/dashboard/poster',
    },
    {
        title: t('dashboard.sidebar.poll'),
        value: 'poll',
        iconClass: 'i-iconoir-user-cart me-4 text-xl',
        path: '/dashboard/poll',
    },
    {
        title: t('dashboard.sidebar.news'),
        value: 'news',
        iconClass: 'i-iconoir-doc-star me-4 text-xl',
        path: '/dashboard/news',
    },
    {
        title: t('dashboard.sidebar.settings'),
        value: 'settings',
        iconClass: 'i-iconoir-settings me-4 text-xl',
        path: '/dashboard/settings',
    },
    {
        title: t('dashboard.sidebar.help'),
        value: 'help',
        iconClass: 'i-iconoir-help-circle me-4 text-xl',
        path: '/dashboard/help',
    },
])
</script>
<style scoped></style>
