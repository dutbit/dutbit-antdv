<template>
  <div style="font-size: 30px; margin: 10px 20px">
    <span> 积分查询-记录展示 </span>
    <a href="/example-point.csv" style="font-size: 20px"> 样表下载 </a>
  </div>
  <div style="padding: 0 14px 14px">
    <a-input-search
      v-model:value="searchText"
      placeholder="搜索姓名或学号"
      style="width: 200px"
      allowClear
      @search="onSearch"
    />
  </div>
  <a-table
    size="middle"
    :columns="columns"
    :dataSource="lstRecords"
    :pagination="pagination"
    :loading="isLoading"
    row-key="id"
    @change="onTableChange"
  ></a-table>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import axios from 'axios'
export default defineComponent({
  setup() {
    const searchText = ref('')
    const funService = (params) => axios.post('/point-man/', { ...params })
    const {
      data: dataAxios,
      loading: isLoading,
      current,
      pageSize,
      run,
    } = usePagination(funService, { formatResult: (res) => res.data })

    // computed
    const lstRecords = computed(() => dataAxios.value?.lstPoints ) // ?. 是必需的
    const pagination = computed(() => ({
      total: dataAxios.value?.total,
      pageNum: current.value,
      pageSize: pageSize.value,
      showSizeChanger: true,
      showQuickJumper: true,
    }))

    // methods
    const onTableChange = (pag, filters) => {
      run({ pageNum: pag.current, pageSize: pag.pageSize, searchText: searchText.value, ...filters })
    }
      
    return { searchText, isLoading, lstRecords, pagination, onTableChange }
  },
  data() {
    return {
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '学号', dataIndex: 'stu_id' },
        { title: '积分', dataIndex: 'points' },
      ],
    }
  },
  methods: {
    onSearch() {
      this.pagination.pageNum = 1
      this.onTableChange(this.pagination)
    },
  },
})
</script>
