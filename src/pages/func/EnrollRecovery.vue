<template>
  <h1>部门列表恢复</h1>
  <a-table :columns="deptColumns" :dataSource="deptData.data">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key == 'operation'">
        <a @click="recoverDept(record.id)">恢复</a>
      </template>
    </template>
  </a-table>
  <h1>批次列表恢复</h1>
  <a-table :columns="turnColumns" :dataSource="turnData.data">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key == 'operation'">
        <a @click="recoverTurn(record.id)">恢复</a>
      </template>
    </template>
  </a-table>
</template>

<script>
import { reactive } from 'vue'
import { notification } from 'ant-design-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'EnrollRecover',
  setup() {
    const router = useRouter()
    const throwRequestError = (e) => {
      if (e?.response?.status == 463 || e?.response?.status == 401) {
        notification.error({
          message: '出错啦',
          description: '登录过期或权限不足，请重新登录',
        })
        setTimeout(() => {
          window.localStorage.removeItem('auth')
          router.push('/login')
        }, 1000)
      } else {
        notification.error({
          message: '出错啦',
          description: '获取信息失败，请尝试重新登录或联系管理员',
        })
      }
    }

    const deptColumns = [
      {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
      },
    ]
    let deptData = reactive({ data: [] })
    const getDeletedDeptData = () => {
      axios
        .get('/enroll/getDeletedDepts')
        .then((response) => {
          deptData.data = response.data.depts
        })
        .catch((e) => {
          throwRequestError()
        })
    }
    const getDeptById = (id) => {
      let dept = null
      deptData.data.forEach((p) => {
        if (p.id == id) {
          dept = p
        }
      })
      return dept
    }
    getDeletedDeptData()
    const recoverDept = (id) => {
      const dept = getDeptById(id)
      axios
        .post('/enroll/recoverDept', { dept })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              title: '提示',
              description: `已成功恢复记录(${dept.deptName})`,
            })
          } else {
            notification.error({
              title: '提示',
              description: '恢复失败，请联系管理员',
            })
          }
          getDeletedDeptData()
        })
        .catch(() => {
          throwRequestError()
        })
    }

    const turnColumns = [
      {
        title: '批次名称',
        dataIndex: 'turnName',
        key: 'turnName',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
      },
    ]
    let turnData = reactive({ data: [] })
    const getDeletedTurnData = () => {
      axios
        .get('/enroll/getDeletedTurns')
        .then((response) => {
          turnData.data = response.data.turns
        })
        .catch((e) => {
          throwRequestError()
        })
    }
    const getTurnById = (id) => {
      let turn = null
      turnData.data.forEach((p) => {
        if (p.id == id) {
          turn = p
        }
      })
      return turn
    }
    getDeletedTurnData()
    const recoverTurn = (id) => {
      const turn = getTurnById(id)
      axios
        .post('/enroll/recoverTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              title: '提示',
              description: `已成功恢复记录(${turn.turnName})`,
            })
          } else {
            notification.error({
              title: '提示',
              description: '恢复失败，请联系管理员',
            })
          }
          getDeletedTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
    }

    return {
      deptColumns,
      deptData,
      recoverDept,

      turnColumns,
      turnData,
      recoverTurn,
    }
  },
}
</script>

<style scoped>
h1 {
  margin-bottom: 5px;
  padding: 10px;
  text-align: center;
}
</style>
