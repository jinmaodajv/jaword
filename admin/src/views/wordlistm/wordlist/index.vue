<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="单词书名" style="width: 200px;" clearable />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <!-- <el-table-column label="用户ID" prop="user" width="100" align="center" /> -->
      <el-table-column label="单词书名" prop="name" />
      <el-table-column label="分享码" prop="code" width="150" />
      <el-table-column label="词汇数" prop="wordcount" width="100" align="center" />
      <el-table-column label="当前使用" prop="now" width="100" align="center" />
      <el-table-column label="累计使用" prop="cumulative" width="100" align="center" />
      <el-table-column label="分享状态" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state ? 'success' : 'info'">
            {{ row.state ? '已分享' : '未分享' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="mini"
            :type="row.state ? 'danger' : 'success'"
            @click="handleChangeState(row)"
          >
            {{ row.state ? '取消分享' : '确认分享' }}
          </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="tempWordlist" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="user">
          <el-input-number
            v-model="tempWordlist.user"
            :min="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="单词书名" prop="name">
          <el-input v-model="tempWordlist.name" />
        </el-form-item>
        <el-form-item label="分享状态" prop="state">
          <el-switch
            v-model="tempWordlist.state"
            :active-value="1"
            :inactive-value="0"
            active-text="已分享"
            inactive-text="未分享"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWordlistList, createWordlist, updateWordlist, changeWordlistState, deleteWordList } from '@/api/wordlist'
import { checkUserExists } from '@/api/user'

export default {
  data() {
    // 用户ID验证规则
    const validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户ID'))
      } else {
        checkUserExists(value).then(response => {
          if (!response.data) {
            callback(new Error('用户不存在'))
          } else {
            callback()
          }
        })
      }
    }

    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      tempWordlist: {
        id: undefined,
        user: undefined,
        name: '',
        code: '',
        wordcount: 0,
        now: 1,
        cumulative: 1,
        state: 0
      },
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        code: '',
        state: undefined
      },
      rules: {
        user: [
          { required: true, validator: validateUser, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入单词书名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取单词书列表
    fetchData() {
      this.listLoading = true
      getWordlistList(this.listQuery)
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
    // 打开新增对话框
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogTitle = '新增单词书'
      this.tempWordlist = {
        id: undefined,
        user: undefined,
        name: '',
        code: undefined,
        wordcount: 0,
        now: 1,
        cumulative: 1,
        state: 0
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 打开编辑对话框
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '编辑单词书'
      this.tempWordlist = Object.assign({}, row)
      this.dialogVisible = true
    },
    // 创建单词书
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createWordlist(this.tempWordlist).then(() => {
            this.$message.success('创建成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 更新单词书
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { id, ...updateData } = this.tempWordlist
          updateWordlist(id, updateData).then(() => {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 修改分享状态
    handleChangeState(row) {
      const action = row.state ? '取消分享' : '确认分享'
      this.$confirm(`确定要${action}该单词书吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        changeWordlistState(row.id).then(() => {
          this.$message.success(`${action}成功`)
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该单词书吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteWordList(row.id).then(() => {
            this.$message.success('删除成功')
            this.fetchData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
