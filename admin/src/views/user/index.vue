<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="用户名" style="width: 200px;" clearable />
      <el-select v-model="listQuery.state" placeholder="状态" clearable style="width: 100px;margin-left: 10px;">
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="用户名" prop="name" width="120" />
      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="{row}">
          <el-avatar :src="row.avatar" shape="square" :size="50" />
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone" width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state ? 'success' : 'danger'">
            {{ (row.state == 1) ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="mini"
            :type="(row.state == 1) ? 'danger' : 'success'"
            @click="handleChangeState(row)"
          >
            {{ (row.state == 1) ? '禁用' : '启用' }}
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

    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="tempUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="tempUser.name" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/jaword/uploadPath"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 如果有头像则显示 -->
            <img v-if="isavatar" :src="tempUser.avatar" class="avatar">
            <!-- 没有头像时显示 -->
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, updateUser, changeUserState } from '@/api/user'

export default {
  data() {
    return {
      list: [],
      total: 0,
      path: '',
      name: '',
      listLoading: false,
      dialogVisible: false, // 是否开启编辑窗口
      isavatar: false,
      tempUser: { id: null, name: '', avatar: '' },
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        state: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取用户列表
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery)
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
      this.tempUser = { ...row }
      this.dialogVisible = true
    },
    // 头像上传成功
    handleAvatarSuccess(res) {
      this.tempUser.avatar = 'http://localhost:8080/jaword/images/' + res
      this.path = 'D:\\BCData\\java\\jaword\\target\\classes\\static\\images'
      this.name = res
      this.isavatar = true
      console.log('上传后的路径为：' + this.tempUser.avatar)
    },
    // 头像上传校验
    beforeAvatarUpload(file) {
      const isImage = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('只能上传JPG/PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('头像大小不能超过2MB!')
      }
      return isImage && isLt2M
    },
    // 提交用户修改
    updateUser() {
      updateUser(this.tempUser.id, {
        name: this.tempUser.name,
        avatar: this.path + '/' + this.name + '*',
        openid: this.tempUser.openid,
        code: 'aaa'
      }).then(() => {
        this.$message.success('更新成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    // 修改用户状态
    handleChangeState(row) {
      this.$confirm(`确认${(row.state === '1') ? '禁用' : '启用'}该用户吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        changeUserState(row.id, (row.state === '1') ? 0 : 1).then(() => {
          this.$message.success('状态已更新')
          this.fetchData()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
