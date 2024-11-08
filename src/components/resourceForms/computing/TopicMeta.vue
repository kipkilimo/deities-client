<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="metaDialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-edit-not-outline"
          text="Add article programming language"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card prepend-icon="mdi-edit-not-outline" title="User Profile">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="['R', 'Python', 'STATA']"
                label="Interests"
                auto-select-first
              ></v-autocomplete>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="metaDialog = false"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
