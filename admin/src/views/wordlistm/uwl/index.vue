<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.wordlist"
        placeholder="选择词汇集"
        clearable
        filterable
        style="width: 200px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in wordlistOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.user"
        placeholder="选择用户"
        clearable
        filterable
        style="width: 200px; margin-left: 10px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="`${item.name} | ID - ${item.id}`"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="词汇集ID" prop="wordlist" min-width="150" />
      <el-table-column label="词汇集" prop="wordlistName" min-width="150" />
      <el-table-column label="创建者ID" prop="cuID" min-width="150" />
      <el-table-column label="创建者名称" prop="createUser" min-width="150" />
      <el-table-column label="使用者ID" prop="user" min-width="150" />
      <el-table-column label="使用者名称" prop="userName" min-width="150" />
      <el-table-column label="操作" width="120" align="center">
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

    <!-- 新增对话框 -->
    <el-dialog title="添加单词书到用户账号" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="tempWlw" label-width="100px">
        <el-form-item label="单词书" prop="wordlist">
          <el-select
            v-model="tempUwl.wordlist"
            placeholder="选择单词书"
            filterable
            style="width: 100%"
            @change="handleWordlistChange"
          >
            <el-option
              v-for="item in wordlistOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="user">
          <el-select
            v-model="tempUwl.user"
            placeholder="选择用户"
            filterable
            remote
            :remote-method="searchUsers"
            :loading="userSearchLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in filteredUserOptions"
              :key="item.id"
              :label="`${item.name} | ID - ${item.id}`"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }} | ID - {{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUwlList, createUwl, deleteUwl } from '@/api/uwl'
import { getWordlistList } from '@/api/wordlist'
import { getUserList } from '@/api/user'

export default {
  data() {
    return {
      list: [], // 数据
      total: 0, // 总页数
      listLoading: false, // 是否加载列表
      dialogVisible: false, // 对话框可见
      userSearchLoading: false, // 用户搜索加载
      wordlistOptions: [], // 所有词汇集选项
      userOptions: [], // 所有用户选项
      filteredUserOptions: [], // 对话框内过滤后的用户选项
      listQuery: { // 查询列表
        page: 1,
        limit: 20,
        wordlist: undefined,
        user: undefined
      },
      tempUwl: { // 临时存储修改或添加信息
        wordlist: undefined,
        user: undefined
      }
    }
  },
  created() {
    this.fetchOptions()
    this.fetchData()
  },
  methods: {
    // 加载所有选项数据
    fetchOptions() {
      // 获取词汇集选项
      getWordlistList({ page: 1, limit: 1000 }).then(response => {
        this.wordlistOptions = response.data.list
      })
      // 获取用户信息
      getUserList({ page: 1, limit: 1000 }).then(response => {
        this.userOptions = response.data.list
      })
    },
    // 获取关联列表数据
    fetchData() {
      this.listLoading = true // 开启加载
      getUwlList(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
        })
        .finally(() => {
          this.listLoading = false // 关闭加载
        })
    },
    // 词汇集搜索
    searchWordlists(query) {
      if (query) {
        this.wordlistLoading = true
        getWordlistList({ name: query, page: 1, limit: 50 }).then(response => {
          this.wordlistOptions = response.data.list
        }).finally(() => {
          this.wordlistLoading = false
        })
      }
    },
    // 用户搜索
    searchUsers(query) {
      if (query) {
        this.userSearchLoading = true
        getUserList({ word: query, page: 1, limit: 50 }).then(response => {
          this.filteredUserOptions = response.data.list // 赋值用户列表
        }).finally(() => {
          this.userSearchLoading = false
        })
      }
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
    // 打开新增对话框
    handleCreate() {
      this.dialogVisible = true // 设置开启对话框
      this.tempUwl = {
        wordlist: undefined,
        user: undefined
      }
      this.filteredUserOptions = [...this.userOptions]
    },
    // 词汇集选择变化时过滤用户
    handleWordlistChange() {
      this.tempUwl.user = undefined
    },
    // 创建关联
    createData() {
      createUwl(this.tempUwl).then(() => {
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    // 删除关联
    handleDelete(row) {
      this.$confirm('确认从用户账号中移除该单词书吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteUwl(row.id).then(() => {
          this.$message.success('移除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 根据ID获取词汇集名称
    getWordlistName(wordlistId) {
      const item = this.wordlistOptions.find(item => item.id === wordlistId)
      return item ? item.name : '未知词汇集'
    },
    // 根据ID获取用户对象
    getUser(userId) {
      return this.wordOptions.find(item => item.id === userId)
    },
    // 根据ID获取用户名称
    getUserName(userId) {
      const user = this.getUser(userId)
      return user ? user.name : '未知用户'
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
</style>
