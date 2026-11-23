<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.word" placeholder="词汇" style="width: 200px;" clearable />
      <el-select v-model="listQuery.clazz" placeholder="词性" clearable style="width: 120px;margin-left: 10px;">
        <el-option v-for="item in clazzOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column label="词汇" prop="word" width="150" />
      <el-table-column label="假名" prop="kana" width="150" />
      <el-table-column label="释义" prop="translate" />
      <el-table-column label="词性" width="120">
        <template slot-scope="{row}">
          {{ getClazzName(row.clazz) }}
        </template>
      </el-table-column>
      <el-table-column label="片假名" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.iskana ? 'success' : 'info'">
            {{ row.iskana ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button
            v-if="row.sound"
            size="mini"
            type="info"
            icon="el-icon-headset"
            @click="playAudio(row.sound)"
          />
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
      <el-form ref="form" :model="tempWord" :rules="rules" label-width="100px">
        <el-form-item label="词汇" prop="word">
          <el-input v-model="tempWord.word" />
        </el-form-item>
        <el-form-item label="假名" prop="kana">
          <el-input v-model="tempWord.kana" />
        </el-form-item>
        <el-form-item label="释义" prop="translate">
          <el-input v-model="tempWord.translate" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="词性" prop="clazz">
          <el-select v-model="tempWord.clazz" placeholder="请选择词性">
            <el-option
              v-for="item in clazzOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="片假名" prop="iskana">
          <el-switch
            v-model="tempWord.iskana"
            :active-value="true"
            :inactive-value="false"
            active-text="是"
            inactive-text="否"
          />
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
import { getWordList, deleteWord, createWord, updateWord } from '@/api/word'
import { getClazzList } from '@/api/clazz'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false, // 是否开启编辑窗口
      dialogStatus: '', // 创建更新
      dialogTitle: '', // 编辑标题
      clazzOptions: [], // 词性下拉选项
      listQuery: {
        page: 1,
        limit: 20,
        word: '',
        clazz: undefined
      },
      tempWord: {
        id: undefined,
        word: '',
        kana: '',
        translate: '',
        clazz: undefined,
        sound: '',
        iskana: 0
      },
      rules: {
        word: [
          { required: true, message: '请输入词汇', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ],
        translate: [
          { required: true, message: '请输入释义', trigger: 'blur' }
        ],
        clazz: [
          { required: true, message: '请选择词性', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchClazzOptions()
    this.fetchData()
  },
  methods: {
    // 获取词性下拉选项
    fetchClazzOptions() {
      getClazzList({ page: 1, limit: 1000 }).then(response => {
        this.clazzOptions = response.data.list
      })
    },
    // 根据词性ID获取名称
    getClazzName(clazzId) { // 函数名
      // 在clazzOptions数组中查找与传入clazzId匹配的词性项
      // Array.prototype.find方法会返回第一个符合条件的元素，若无则返回undefined
      const item = this.clazzOptions.find(item => item.id === clazzId)
      return item ? item.name : '未知'
    },
    // 获取词汇列表
    fetchData() {
      this.listLoading = true
      getWordList(this.listQuery)
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
      this.dialogTitle = '新增词汇'
      // 重置表单数据
      this.tempWord = { // 赋值为空
        id: undefined,
        word: '',
        kana: '',
        translate: '',
        clazz: undefined,
        sound: '',
        iskana: 0
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
      this.dialogTitle = '编辑例句'
      const wordItem = this.list.find(item => item.id === row.id)
      this.tempWord = wordItem
      this.dialogVisible = true
    },
    // 创建词汇
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createWord(this.tempWord).then(() => {
            this.$message.success('创建成功')
            this.dialogVisible = false // 隐藏编辑框
            this.fetchData() // 更新数据
          })
        }
      })
    },
    // 更新词汇
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const action = updateWord(this.tempWord.id, this.tempWord)
          action.then(() => {
            this.$message.success('更新成功')
            this.dialogVisible = false // 隐藏编辑框
            this.fetchData() // 更新数据
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该词汇吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteWord(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 播放音频
    playAudio(url) {
      new Audio(url).play()
    }
  }
}
</script>
