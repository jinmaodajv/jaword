<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="测试类型名称"
        style="width: 200px;"
        clearable
        @clear="handleFilter"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button type="success" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="测试类型名称" prop="name" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="tempTestClazz" :rules="rules" label-width="120px">
        <el-form-item label="测试类型名称" prop="name">
          <el-input v-model="tempTestClazz.name" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTestclazzList, deleteTestclazz, createTestclazz, updateTestclazz } from '@/api/testclazz'

export default {
  data() {
    return {
      list: [], // 存储表格数据列表
      total: 0, // 数据总条数（用于分页）
      listLoading: false,
      dialogVisible: false, // 是否开启编辑窗口
      dialogStatus: '',
      dialogTitle: '', // 编辑标题
      tempTestClazz: {
        id: undefined,
        name: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入测试类型名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.listLoading = true
      getTestclazzList(this.listQuery) // 调用API获取数据
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

    // 新增
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogTitle = '新增测试类型'
      this.tempTestClazz = {
        id: undefined,
        name: ''
      }
      this.dialogVisible = true
      // 等待 DOM 更新后，再清除验证错误
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    // 编辑
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '编辑测试类型'
      this.tempTestClazz = this.list.find(item => item.id === row.id)
      this.dialogVisible = true
    },

    // 创建测试类型
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createTestclazz(this.tempTestClazz).then(() => {
            this.$message.success('创建成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 更新测试类型
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateTestclazz(this.tempTestClazz).then(() => {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该测试类型吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteTestclazz(row.id).then(() => {
            this.$message.success('删除成功')
            this.fetchData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
