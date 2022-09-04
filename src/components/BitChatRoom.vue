<template>
  <div :class="['bit-chat-Room']">
    <header></header>
    <main>
      <template v-for="record in lstRecords" :key="record.id">
        <BitChatRecord v-bind="record" />
      </template>
    </main>
    <footer>
      <textarea></textarea>
    </footer>
  </div>
</template>

<script>
import BitChatRecord from './BitChatRecord.vue'
export default {
  components: { BitChatRecord },
  props: {
    text: String,
    isSelf: Boolean,
  },
  data() {
    return {
      lstRecords: [
        {
          text: '注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态',
          isSelf: false,
        },
        {
          text: '我们可以为组件的 prop 指定验证要求，例如你知道的这些类型。如果有一个要求没有被满足，则 Vue 会在浏览器控制台中警告你。',
          isSelf: false,
        },
        { text: '是我', isSelf: true },
      ],
    }
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
.bit-chat-Room {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.bit-chat-Room header {
  height: 48px;
}
.bit-chat-Room main {
  flex: auto;
  padding: 0 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.bit-chat-Room footer {
  height: 120px;
}
.bit-chat-Room textarea {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: none;
  outline: none;
  resize: none;
}
</style>