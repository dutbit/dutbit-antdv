<template>
  <div style="font-size: 30px; margin: 10px 20px">
    <span> 志愿时长查询记录编辑 </span>
    <a href="/static/example.csv" style="font-size: 20px"> 样表下载 </a>
    <span style="float: right"><a href="#">查询页面</a></span>
    <span style="float: right">/</span>
    <span style="float: right"><a href="#">数据修改</a></span>
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
  >
  </a-table>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import axios from 'axios'

export default defineComponent({
  setup() {
    const searchText = ref('')
    const funService = (params) => axios.get('/voltime-man/get-records', { params })
    const {
      data: dataAxios,
      loading: isLoading,
      current,
      pageSize,
      run,
    } = usePagination(funService, { formatResult: (res) => res.data })

    // computed
    const lstRecords = computed(() => dataAxios.value?.rows) // ?. 是必需的
    const pagination = computed(() => ({
      total: dataAxios.value?.total,
      current: current.value,
      pageSize: pageSize.value,
      showSizeChanger: true,
      showQuickJumper: true,
    }))

    // methods
    const onTableChange = (pag, filters) =>
      run({ current: pag.current, pageSize: pag.pageSize, searchText: searchText.value, ...filters })

    return { searchText, isLoading, lstRecords, pagination, onTableChange }
  },
  data() {
    return {
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '性别', dataIndex: 'sex' },
        { title: '学院', dataIndex: 'faculty' },
        { title: '学号', dataIndex: 'stu_id' },
        { title: '时长(h)', dataIndex: 'duration' },
        { title: '任务名称', dataIndex: 'activity_name' },
        { title: '组织学院', dataIndex: 'activity_faculty' },
        { title: '队伍名称', dataIndex: 'team' },
        { title: '时间', dataIndex: 'activity_DATE' },
        { title: '组织人', dataIndex: 'duty_person' },
        { title: '备注', dataIndex: 'remark' },
      ],
    }
  },
  methods: {
    onSearch() {
      this.pagination.current = 1
      this.onTableChange(this.pagination)
    },
  },
})
</script>