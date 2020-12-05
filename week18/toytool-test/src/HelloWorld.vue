<template>
  <div>{{ greeting }}</div>
</template>
<script>
export default {
  data () {
    return {
      greeting: 'Hello'
    }
  }
}
</script>
<style scoped>
div {
  font-size: 20px;
  color: #FF0000;
}
</style>
