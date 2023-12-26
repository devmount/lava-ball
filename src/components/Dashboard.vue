<template>
  <div class="flex flex-col justify-center gap-8">
    <div class="flex flex-col items-center text-rose-600">
      <span class="text-3xl font-bungee">Lava</span>
      <span class="text-6xl font-bungee leading-10">Ball</span>
      <span>v{{ $version }}</span>
    </div>
    <div class="flex flex-col gap-4 p-8 bg-stone-900 text-center rounded">
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
      <button @click="emit('restart')">
        {{ t('restartLevel') }}
      </button>
      <button v-if="debug" @click="emit('next')">
        {{ t('nextLevel') }}
      </button>
    </div>
    <div class="flex flex-col gap-4 p-8 bg-stone-900 text-center rounded">
      <div class="text-rose-600 text-center text-4xl font-bungee">
        {{ t('total') }}
      </div>
      <div class="flex gap-2 justify-center text-rose-600">
        <div class="text-4xl font-bungee">{{ score }}</div>
        <div class="uppercase tracking-widest">{{ t('points') }}</div>
      </div>
      <button @click="emit('reset')">
        {{ t('newGame') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps(['level', 'steps', 'score', 'debug']);
const emit = defineEmits(['restart', 'next', 'reset']);
</script>
