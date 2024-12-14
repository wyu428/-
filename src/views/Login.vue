<script setup>
import router from '@/router/index';
import { ref } from 'vue';

const input = ref('');
const onEnter = () => {
  if (input.value) {
    localStorage.setItem('token', input.value);
    router.push('/home');
  }
};
const onChange = (val) => {
  // console.log(val);
};
</script>

<template>
  <div>
    <t-input v-model="input" placeholder="请输入token" @enter="onEnter" @change="onChange" />
  </div>
</template>
