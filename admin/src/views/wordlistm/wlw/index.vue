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
        v-model="listQuery.word"
        placeholder="选择词汇"
        clearable
        filterable
        style="width: 200px; margin-left: 10px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in wordOptions"
          :key="item.id"
          :label="`${item.word} (${item.translate})`"
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
      <el-table-column label="词汇ID" prop="word" min-width="150" />
      <el-table-column label="词汇" prop="wordName" min-width="150" />
      <el-table-column label="释义" prop="translate" min-width="150" />
      <el-table-column label="词性" prop="clazzName" min-width="150" />
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
    <el-dialog title="添加词汇到单词书" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="tempWlw" label-width="100px">
        <el-form-item label="词汇集" prop="wordlist">
          <el-select
            v-model="tempWlw.wordlist"
            placeholder="选择词汇集"
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
        <el-form-item label="词汇" prop="word">
          <el-select
            v-model="tempWlw.word"
            placeholder="选择词汇"
            filterable
            remote
            :remote-method="searchWords"
            :loading="wordSearchLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in filteredWordOptions"
              :key="item.id"
              :label="`${item.word} (${item.translate})`"
              :value="item.id"
            >
              <span style="float: left">{{ item.word }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.translate }} | {{ getClazzName(item.clazz) }}
              </span>
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
import { getWlwList, createWlw, deleteWlw } from '@/api/wlw'
import { getWordlistList } from '@/api/wordlist'
import { getWordList } from '@/api/word'
import { getClazzList } from '@/api/clazz'

export default {
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      dialogVisible: false,
      wordSearchLoading: false,
      wordlistOptions: [], // 所有词汇集选项
      wordOptions: [], // 所有词汇选项
      filteredWordOptions: [], // 对话框内过滤后的词汇选项
      clazzOptions: [], // 词性选项
      listQuery: {
        page: 1,
        limit: 20,
        wordlist: undefined,
        word: undefined
      },
      tempWlw: {
        wordlist: undefined,
        word: undefined
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
      // 获取词汇选项
      getWordList({ page: 1, limit: 1000 }).then(response => {
        this.wordOptions = response.data.list
      })
      // 获取词性选项
      getClazzList({ page: 1, limit: 100 }).then(response => {
        this.clazzOptions = response.data.list
      })
    },
    // 获取关联列表数据
    fetchData() {
      this.listLoading = true
      getWlwList(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
        })
        .finally(() => {
          this.listLoading = false
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
    // 词汇搜索
    searchWords(query) {
      if (query) {
        this.wordSearchLoading = true
        getWordList({ word: query, page: 1, limit: 50 }).then(response => {
          this.filteredWordOptions = response.data.list
        }).finally(() => {
          this.wordSearchLoading = false
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
      this.dialogVisible = true
      this.tempWlw = {
        wordlist: undefined,
        word: undefined
      }
      this.filteredWordOptions = [...this.wordOptions]
    },
    // 词汇集选择变化时过滤词汇
    handleWordlistChange() {
      this.tempWlw.word = undefined
    },
    // 创建关联
    createData() {
      createWlw(this.tempWlw).then(() => {
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    // 删除关联
    handleDelete(row) {
      this.$confirm('确认从单词书中移除该词汇吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteWlw(row.id).then(() => {
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
    // 根据ID获取词汇对象
    getWord(wordId) {
      return this.wordOptions.find(item => item.id === wordId)
    },
    // 根据ID获取词汇名称
    getWordName(wordId) {
      const word = this.getWord(wordId)
      return word ? word.word : '未知词汇'
    },
    // 根据词性ID获取词性名称
    getClazzName(clazzId) {
      const item = this.clazzOptions.find(item => item.id === clazzId)
      return item ? item.name : '未知'
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
</style>
