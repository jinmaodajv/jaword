<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.userId"
        placeholder="用户ID"
        style="width: 200px"
        clearable
      />
      <el-input
        v-model="listQuery.wordlistword"
        placeholder="单词书词汇ID"
        style="width: 200px; margin-left: 10px"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="用户" width="180">
        <template slot-scope="{row}">
          {{ row.userName }} (ID: {{ row.user }})
        </template>
      </el-table-column>
      <el-table-column label="词汇集" prop="wordlistName" width="150" />
      <el-table-column label="词汇" min-width="200">
        <template slot-scope="{row}">
          {{ row.wordName }}
          <el-tag size="mini" style="margin-left: 5px">{{ row.clazzName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="释义" prop="translate" />
      <el-table-column label="学习状态" width="180" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.study"
            :active-value="true"
            :inactive-value="false"
            active-text="已学"
            inactive-text="未学"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
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
import { getStudyList, updateStudy, deleteStudy } from '@/api/study'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        wordlistword: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取学习记录列表
    fetchData() {
      this.listLoading = true
      getStudyList(this.listQuery)
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
    // 修改学习状态
    handleStatusChange(row) {
      updateStudy(row.id, { study: row.study })
        .then(() => {
          this.$message.success('状态更新成功')
        })
        .catch(() => {
          // 失败时恢复原状态
          row.study = row.study === 1 ? 0 : 1
        })
    },
    // 删除记录
    handleDelete(row) {
      this.$confirm('确认删除该学习记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteStudy(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
</style>
