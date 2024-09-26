<!-- CommentMarkers.vue -->
<template>
  <div>
    <div
      v-for="(commentData, index) in filteredComments"
      :key="index"
      :style="commentStyle(commentData)"
      :id="'comment-' + index"
      class="comment-marker z-index-common"
      @mouseover="showTooltip = index; hoverIndex = index; moveActiveCardToSecondPosition(commentData.id)"
      @mouseleave="resetTooltip"
    >
      <div class="tooltip-wrapper">
        <v-tooltip bottom v-if="showTooltip === index">
          <template #activator="{ on, attrs }">
            <v-row>
              <v-col>
                <v-icon class="ml-44" size="50">mdi-menu-up</v-icon>
                <v-card
                  color="#e7f2fb"
                  v-bind="attrs"
                  v-on="on"
                  :style="computedCardStyle(index)"
                  class="tooltip-card custom-tooltip"
                >
                  <div class="ma-4 text-h6">{{ commentData.title }}</div>
                  <div class="ma-4 text-h7">
                    <i>{{ commentData.text }}</i>
                  </div>
                  <v-divider />
                  <v-card-actions>
                    <v-card-subtitle class="ml-11" align-right>
                      Added {{ reactiveTimeAgo(Number(commentData.timestamp)) }} by {{ commentData.author }}
                    </v-card-subtitle>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['filteredComments', 'commentStyle', 'computedCardStyle', 'showTooltip', 'hoverIndex', 'resetTooltip']);
</script>
