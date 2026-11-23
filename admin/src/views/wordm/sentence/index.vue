<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.wordId"
        placeholder="词汇ID"
        style="width: 200px"
        clearable
        @clear="handleFilter"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <!-- 数据表格（按词汇分组） -->
    <el-table
      v-loading="listLoading"
      :data="groupedList"
      border
      fit
      highlight-current-row
      row-key="wordId"
      :row-class-name="tableRowClassName"
    >
      <!-- 词汇分组标题列 -->
      <el-table-column label="词汇" width="200">
        <template slot-scope="{row}">
          <div class="word-header">
            <strong>{{ row.word }}</strong>
            <el-tag size="mini" style="margin-left: 5px">{{ row.wordTranslate }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- 例句内容列 -->
      <el-table-column label="例句内容">
        <template slot-scope="{row}">
          <div v-for="(sent, index) in row.sentences" :key="sent.id" class="sentence-item">
            <div class="sentence-content">
              <p><strong>{{ index + 1 }}.</strong> {{ sent.sentence }}</p>
              <p class="translate">{{ sent.sentenceTranslate }}</p>
            </div>
            <div class="sentence-actions">
              <el-button size="mini" @click="handleEdit(sent)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(sent)">删除</el-button>
              <el-button
                v-if="sent.sound"
                size="mini"
                type="info"
                icon="el-icon-headset"
                @click="playAudio(sent.sound)"
              />
            </div>
          </div>
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
      <el-form ref="form" :model="tempSentence" :rules="rules" label-width="100px">
        <el-form-item v-if="dialogStatus === 'create'" label="关联词汇" prop="wordId">
          <el-select
            v-model="tempSentence.wordId"
            placeholder="选择词汇"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in wordOptions"
              :key="item.id"
              :label="`${item.word} (${item.translate})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="词汇">
          {{ tempSentence.word }} ({{ tempSentence.wordTranslate }})
        </el-form-item>
        <el-form-item label="例句" prop="sentence">
          <el-input
            v-model="tempSentence.sentence"
            type="textarea"
            :rows="3"
            placeholder="请输入完整例句"
          />
        </el-form-item>
        <el-form-item label="例句翻译" prop="sentenceTranslate">
          <el-input
            v-model="tempSentence.sentenceTranslate"
            type="textarea"
            :rows="3"
            placeholder="请输入例句翻译"
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
import { getSentenceList, createSentence, updateSentence, deleteSentence } from '@/api/sentence'
import { getWordList } from '@/api/word'

export default {
  data() {
    return {
      list: [],
      groupedList: [], // 按词汇分组后的数据
      total: 0,
      listLoading: false,
      dialogVisible: false, // 是否开启编辑窗口
      dialogStatus: '',
      dialogTitle: '', // 编辑标题
      wordOptions: [], // 词汇下拉选项
      listQuery: {
        page: 1,
        limit: 20,
        wordId: undefined
      },
      tempSentence: {
        id: undefined,
        wordId: undefined,
        word: '',
        wordTranslate: '',
        sentence: '',
        sentenceTranslate: ''
      },
      rules: {
        wordId: [
          { required: true, message: '请选择关联词汇', trigger: 'change' }
        ],
        sentence: [
          { required: true, message: '请输入例句', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在5到200个字符', trigger: 'blur' }
        ],
        sentenceTranslate: [
          { required: true, message: '请输入例句翻译', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchWordOptions()
    this.fetchData()
  },
  methods: {
    // 获取词汇选项
    fetchWordOptions() {
      getWordList({ page: 1, limit: 1000 }).then(response => {
        this.wordOptions = response.data.list
      })
    },
    // 获取例句列表
    fetchData() {
      this.listLoading = true
      getSentenceList(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.groupDataByWord()
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 按词汇分组数据
    groupDataByWord() {
      const groups = {}
      this.list.forEach(item => {
        if (!groups[item.wordId]) {
          groups[item.wordId] = {
            wordId: item.wordId,
            word: item.word,
            wordTranslate: item.wordTranslate,
            sentences: []
          }
        }
        groups[item.wordId].sentences.push({
          id: item.id,
          sentence: item.sentence,
          sentenceTranslate: item.sentenceTranslate,
          sound: item.sound
        })
      })
      this.groupedList = Object.values(groups)
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
      this.dialogTitle = '新增例句'
      this.tempSentence = {
        wordId: undefined,
        sentence: '',
        sentenceTranslate: ''
      }
      this.dialogVisible = true
      // 等待 DOM 更新后，再清除验证错误
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 打开编辑对话框
    handleEdit(sentence) {
      this.dialogStatus = 'update'
      this.dialogTitle = '编辑例句'
      const wordItem = this.list.find(item => item.id === sentence.id)
      this.tempSentence = {
        id: sentence.id,
        wordId: wordItem.wordId,
        word: wordItem.word,
        wordTranslate: wordItem.wordTranslate,
        sentence: sentence.sentence,
        sentenceTranslate: sentence.sentenceTranslate
      }
      this.dialogVisible = true
    },
    // 创建例句
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createSentence({
            word: this.tempSentence.wordId,
            sentence: this.tempSentence.sentence,
            translate: this.tempSentence.sentenceTranslate
          }).then(() => {
            this.$message.success('创建成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 更新例句
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { id, ...updateData } = this.tempSentence
          updateSentence(id, {
            sentence: updateData.sentence,
            translate: updateData.sentenceTranslate
          }).then(() => {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    // 删除例句
    handleDelete(sentence) {
      this.$confirm('确认删除该例句吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteSentence(sentence.id).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 播放音频
    playAudio(url) {
      new Audio(url).play()
    },
    // 表格行样式
    tableRowClassName({ row }) {
      return 'word-group-row'
    }
  }
}
</script>

<style scoped>
.word-header {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.sentence-item {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.sentence-item:last-child {
  border-bottom: none;
}

.sentence-content {
  margin-bottom: 8px;
}

.translate {
  color: #909399;
  font-size: 13px;
  margin-top: 5px;
}

.sentence-actions {
  text-align: right;
}

/* 分组行样式 */
::v-deep .word-group-row {
  background-color: #f5f7fa;
}

::v-deep .word-group-row + .word-group-row {
  border-top: 2px solid #dcdfe6;
}
</style>
