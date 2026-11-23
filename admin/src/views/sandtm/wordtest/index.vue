<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.testclazz"
        placeholder="测试类型"
        clearable
        style="width: 200px"
      >
        <el-option
          v-for="item in testClazzOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="用户" width="150">
        <template slot-scope="{row}">
          {{ row.userName }} (ID: {{ row.user }})
        </template>
      </el-table-column>
      <el-table-column label="测试类型" width="150">
        <template slot-scope="{row}">
          {{ row.tcName }} (ID: {{ row.testclazz }})
        </template>
      </el-table-column>
      <el-table-column label="测试词汇" min-width="200">
        <template slot-scope="{row}">
          <div>{{ row.word }}</div>
          <div style="color: #909399; font-size: 12px">{{ row.wordTranslate }}</div>
        </template>
      </el-table-column>
      <el-table-column label="测试结果" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.guo ? 'success' : 'danger'">
            {{ row.guo ? '通过' : '未通过' }}
          </el-tag>
          <div style="margin-top: 5px">
            <span style="color: #67C23A">{{ row.right }}✓</span> /
            <span style="color: #F56C6C">{{ row.error }}✗</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.guo"
            :active-value="true"
            :inactive-value="false"
            active-text="通过"
            inactive-text="未过"
            @change="handleStatusChange(row)"
          />
          <el-button
            size="mini"
            type="danger"
            style="margin-left: 10px"
            @click="handleDelete(row)"
          >
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
import { getTestList, updateTest, deleteTest } from '@/api/wordtest'
import { getTestclazzList } from '@/api/testclazz'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      testClazzOptions: [], // 测试类型选项
      listQuery: {
        page: 1,
        limit: 20,
        testclazz: undefined
      }
    }
  },
  created() {
    this.fetchTestClazzOptions()
    this.fetchData()
  },
  methods: {
    // 获取测试类型选项
    fetchTestClazzOptions() {
      getTestclazzList().then(response => {
        this.testClazzOptions = response.data.list
      })
    },
    // 获取测试记录列表
    fetchData() {
      this.listLoading = true
      getTestList(this.listQuery)
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
    // 修改通过状态
    handleStatusChange(row) {
      updateTest(row.id, { guo: row.guo })
        .then(() => {
          this.$message.success('状态更新成功')
        })
        .catch(() => {
          // 失败时恢复原状态
          row.guo = !row.guo
        })
    },
    // 删除记录
    handleDelete(row) {
      this.$confirm('确认删除该测试记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteTest(row.id).then(() => {
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
