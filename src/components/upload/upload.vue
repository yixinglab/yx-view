<template>
    <section>
        <el-row>
            <el-col :span="24">
                <!--上传-->
                <el-upload name="files"
                    :action="actionUpload" 
                    :show-file-list="false" 
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload">
                    <el-button type="info"><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-table 
            :data="items"
            v-loading.body="loading"
            element-loading-text="拼命加载中"
            max-height="400"
            style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column type="expand">
                <template scope="scope">
                    <el-table
                        :border="false"
                        :data="tableItemsData(scope.row)"
                        style="width: 100%" row-class-name="info-row">
                        <el-table-column type="index" label="序号" width="80"></el-table-column>
                        <el-table-column prop="file" label="文件名称" width="200"></el-table-column>
                        <el-table-column prop="date" label="上传日期" width="120"></el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{scope.row.status === 1 ? '成功' : '失败'}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="file" label="文件名称" width="200"></el-table-column>
            <el-table-column prop="start" label="开始年月" width="120"></el-table-column>
            <el-table-column prop="end" label="结束年月" width="120"></el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <el-steps :space="100" :active="rowStaus(scope.row)" finish-status="success">
                        <el-step title="已上传"></el-step>
                        <el-step :title="scope.row.status === 1 ? '已处理' : '处理中'"></el-step>
                        <el-step title="已完成"></el-step>
                    </el-steps>
                </template>
           </el-table-column>
            <el-table-column fixed="right" label="操作" width="240">
                <template scope="scope">
                    <section>
                    <el-row>
                        <el-col :span="8">
                            <el-upload name="files"
                                :action="actionUpload + '&pfid=' + scope.row.pfid" 
                                :show-file-list="false" 
                                :on-success="handleReplaceSuccess"
                                :on-error="handleAvatarError"
                                :before-upload="beforeAvatarUpload">
                                <el-button type="danger" size="small"><i class="el-icon-upload el-icon--left"></i>替换</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="info" size="small" @click="handleInfo()"><i class="el-icon-information el-icon--left"></i>详情</el-button>
                        </el-col>
                        <el-col :span="8">
                            <a :href="actionDownload + '&fid=' + scope.row.fid " :download="scope.row.file">
                            <el-button type="info" size="small"><i class="el-icon-document el-icon--left"></i>下载</el-button>
                            </a>
                        </el-col>
                    </el-row>
                    </section>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import ElementUI from 'element-ui';
    import axios from 'axios';

    export default {
        name: 'uploader',
        components: {
            ElementUI
        },
        mounted() {
            this.tableRowInit();
        },
        data() {
            return {
                loading: true,
                allItems: [],
                items: [
                    {
                        fid: 0,
                        pfid: 86,
                        start: '2016-01-02',
                        end: '2016-12-31',
                        file: '2016年度的流水.xlsx',
                        status: 0,
                    }
                ]
            };
        },
        props: {
            actionInit: {
                type: String,
                default: ""
            },
            actionUpload: {
                type: String,
                default: ""
            },
             actionDownload: {
                type: String,
                default: ""
            },
            // onSuccess: Function,
            // onError: Function,
        },
        methods: {
            tableRowInit() {
                let postUrl = this.actionInit;
                let params = {};
                
                this.allItems = [];
                this.loading = true;
                axios.post(postUrl, params).then(res => {
                    // debugger;
                    this.items = [];
                    if (res.data.code === 200) {
                        this.allItems = res.data.data;
                        for (let i = 0; i < this.allItems.length; i++) {
                            let item = this.allItems[i];
                            if (item.fid === item.pfid) {
                                this.items.push(item);
                                for(let j = i + 1; j < this.allItems.length; j++) {
                                    let itemJ = this.allItems[j];
                                    if (item.pfid == itemJ.pfid && itemJ.status === 1) {
                                        item.status = itemJ.status;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        const h = this.$createElement;
                        this.$notify({
                            title: '提示',
                            message: h('i', { style: 'color: teal'}, res.data.desc)
                        });
                    }
                    this.loading = false;
                });
            },
            tableRowClassName(row, index) {
                // let self = this;
                // let _staus = self.items[index].staus;
                // for (let i = 0; i<self.tags.length; i++) {
                //     let tag = self.tags[i];
                //     if (tag.value == _staus) {
                //         return tag.type;
                //     }
                // }
                return '';
            },
            tableItemsData(row) {
                let _items = [];
                let curitem = row;
                if (!curitem) return _items;

                for (let i = 0; i < this.allItems.length; i++) {
                    debugger;
                    let item = this.allItems[i];
                    if (item.fid === item.pfid ) continue;
                    if (curitem.pfid === item.pfid) {
                        _items.push(item);
                    }
                }
                return _items;
            },
            rowStaus(row) {
                if (row.status == 1) {
                    return 3;
                }
                return 1;
            },
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                if (res.code == 200) {
                    // this.$message.error('success it is');
                    if (res.data.length > 0) {
                        this.items.push(res.data[0]);
                        this.allItems.push(res.data[0]);
                    }
                    // this.onSuccess(err, rawFile);
                    if (res.data[0].code !== 200) {
                        this.$message.error(res.data[0].desc);
                    }
                } else {
                    this.$message.error(res.desc);
                    // this.onError(err, rawFile);
                }
            },
            handleReplaceSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                if (res.code == 200) {
                    if (res.data.length > 0) {
                        let res_item  = res.data[0];
                        // this.items.push(res.data[0]);
                        for (let i = 0; i < this.items.length; i++) {
                            let item = this.items[i];
                            if (res_item.pfid === item.pfid) {
                                item.status = res_item.status;
                                break;
                            }
                        }
                        this.allItems.push(res_item);
                    }
                } else {
                    this.$message.error(res.desc);
                    // this.onError(err, rawFile);
                }
            },
            handleAvatarError(err, file, fileList) {
                this.$message.error(err);
            },
            handleDownload() {
                
            },
            handleInfo() {
                this.$alert('功能正在开发中。。。', '提示', {
                        confirmButtonText: '确定'
                    });
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 50;
                if (!isLt2M) {
                    this.$alert('上传的文件大小不能超过 50MB!', '提示', {
                        confirmButtonText: '确定'
                    });
                }
                return isLt2M;
            }
        }
    }
</script>
<style>
    .el-row {
        margin-bottom: 5px;
    }
    .el-table .info-row {
        background: #C0CCDA;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }
</style>
