<template>
  <div class="flex flex-col justify-center gap-8">
    <brand />
    <div class="flex flex-col gap-4 p-8 text-center block">
      <div class="text-rose-600 text-center text-4xl font-bungee">
        {{ t('level') }} {{ level }}
      </div>
      <div class="flex gap-2 justify-center text-rose-600">
        <div class="text-4xl font-bungee">
          {{ steps }}
        </div>
        <div class="uppercase tracking-widest">
          {{ t('steps') }}
        </div>
      </div>
      <button @click="restart()">
        {{ t('restartLevel') }}
      </button>
      <button v-if="debug" @click="next()">
        {{ t('nextLevel') }}
      </button>
    </div>
    <div class="flex flex-col gap-4 p-8 text-center block">
      <div class="text-rose-600 text-center text-4xl font-bungee">
        {{ t('total') }}
      </div>
      <div class="flex gap-2 justify-center text-rose-600">
        <div class="text-4xl font-bungee">{{ score }}</div>
        <div class="uppercase tracking-widest">{{ t('points') }}</div>
      </div>
      <button @click="reset()">
        {{ t('newGame') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import Brand from "@/components/Brand.vue";

const { t } = useI18n();
const restart = inject('restart');
const reset = inject('reset');
const next = inject('next');

defineProps(['level', 'steps', 'score', 'debug']);
</script>
