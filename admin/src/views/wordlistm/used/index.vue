<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.userId"
        placeholder="用户ID"
        style="width: 200px"
        clearable
        @clear="handleFilter"
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
      <el-table-column label="当前学习单词书" min-width="250">
        <template slot-scope="{row}">
          <span v-if="row.userwordlist">
            {{ getUserWordlistName(row.userwordlist) }}
          </span>
          <span v-else class="text-muted">未设置</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row)">修改</el-button>
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

    <!-- 修改对话框 -->
    <el-dialog title="修改学习单词书" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="tempUsed" label-width="100px">
        <el-form-item label="用户">
          {{ tempUsed.userName }} (ID: {{ tempUsed.user }})
        </el-form-item>
        <el-form-item label="选择单词书" prop="userwordlist">
          <el-select
            v-model="tempUsed.userwordlist"
            placeholder="请选择单词书"
            filterable
            style="width: 100%"
            loading-text="加载中..."
            :loading="wordlistLoading"
          >
            <el-option
              v-for="item in userWordlistOptions"
              :key="item.id"
              :label="`${item.userName} | ID - ${item.id}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsedList, updateUsed, deleteUsed } from '@/api/used'
import { getUwlList } from '@/api/uwl'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false,
      wordlistLoading: false,
      userWordlistOptions: [], // 用户可选的单词书列表
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined // 选填的用户ID查询条件
      },
      tempUsed: {
        id: undefined,
        user: undefined,
        userName: '',
        userwordlist: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getUsedList(this.listQuery)
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
    // 打开编辑对话框
    handleEdit(row) {
      this.tempUsed = Object.assign({}, row)
      this.dialogVisible = true
      this.fetchUserWordlists(row.user)
    },
    // 获取用户可选的单词书列表
    fetchUserWordlists(userId) {
      this.wordlistLoading = true
      getUwlList({
        userId,
        page: 1,
        limit: 1000
      }).then(response => {
        this.userWordlistOptions = response.data.list
      }).finally(() => {
        this.wordlistLoading = false
      })
    },
    // 更新数据
    updateData() {
      if (!this.tempUsed.userwordlist) {
        this.$message.warning('请选择单词书')
        return
      }
      updateUsed(this.tempUsed.id, {
        userwordlist: this.tempUsed.userwordlist
      }).then(() => {
        this.$message.success('更新成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    // 删除记录
    handleDelete(row) {
      this.$confirm('确认移除该学习记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteUsed(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 根据ID获取单词书名称
    getUserWordlistName(id) {
      const item = this.userWordlistOptions.find(item => item.id === id) ||
                   this.list.find(item => item.userwordlist === id)?.userWordlistName
      return item?.name || `单词书ID: ${id}`
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
.text-muted {
  color: #909399;
  font-style: italic;
}
</style>
