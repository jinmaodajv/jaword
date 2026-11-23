<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="反馈内容" style="width: 200px;" clearable />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="用户ID" prop="user" width="100" align="center" />
      <el-table-column label="反馈内容" prop="text" />
      <el-table-column label="反馈时间" prop="time" width="150" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { getFeedbackList, deleteFeedback } from '@/api/feedback'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        code: '',
        state: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取反馈列表
    fetchData() {
      this.listLoading = true
      getFeedbackList(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 分页变化
    handlePageChange(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    // 搜索过滤
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该反馈信息吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteFeedback(row.id).then(() => {
            this.$message.success('删除成功')
            this.fetchData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
