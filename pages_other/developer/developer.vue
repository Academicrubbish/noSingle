<template>
	<view style="height: 100%">
		<cu-custom bgColor="bg-black" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">开发人员</view>
		</cu-custom>
		<view class="margin-xl" v-for="(item,index) in developerList" :key="index">
			<view class="margin-top text-lg text-bold">{{item.version}}</view>
			<view class="padding-left-sm margin-top-sm">
				<view v-for="(citem,cindex) in item.Personnel" :key="cindex">
					<text class="text-grey">{{citem.position}}</text>
					{{citem.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	export default {
		data() {
			return { developerList: [] }
		},
		onLoad() { this.databaseFunc() },
		methods: {
			//云数据库用户表新增
			databaseFunc() {
				db.collection('developer')
					.get()
					.then(res => {
						this.developerList = res.result.data
					})
			},
		}
	}
</script>
<style>
	page {
		background-color: white;
	}
</style>