<template>
  <div :class="[{ 'is-self': isSelf }, 'bit-chat-Record']">
    <img class="avatar" src="/avatar.png" alt="" />
    <div class="bubble">{{ text }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    text: String,
    isSelf: Boolean,
  },
  data() {
    return {}
  },
  computed: {},
  inject: [],
  provide() {
    return {}
  },
  methods: {},
  mounted() {},
}
</script>

<style scoped>
.bit-chat-Record {
  display: flex;
  align-items: flex-start;
}
.bit-chat-Record.is-self {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  margin: 10px;
  border-radius: 5px;
}
.bit-chat-Record .bubble {
  max-width: 60%;
  padding: 10px;
  margin: 10px 5px;
  border: 1px solid hsl(225, 100%, 87%);
  border-radius: 5px;
  background-color: hsl(225, 100%, 95%);
}
.bit-chat-Record.is-self .bubble {
  border: 1px solid hsl(132, 77%, 68%);
  border-radius: 5px;
  background-color: hsl(132, 100%, 92%);
}
</style>