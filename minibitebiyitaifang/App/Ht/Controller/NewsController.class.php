<?php
namespace Ht\Controller;
use Think\Controller;
class NewsController extends PublicController{

	/*
	*
	* 构造函数，用于导入外部文件和公共方法
	*/
	public function _initialize(){
		$this->news = M('News');
		$this->category = M('category');
		$this->news_dp = M('news_dp');

		//获取所有新闻分类
		$cate_list = $this->category->where('tid=20')->order('sort desc,id asc')->field('id,name')->select();
		$this->assign('cate_list',$cate_list);
	}

	/*
	*
	* 获取、查询新闻表数据
	*/
	public function index(){

		//搜索
		$cid = intval($_REQUEST['pid']);
		$news_name = trim($_REQUEST['news_name']);
		//构建搜索条件
		$condition = array();
		if ($cid) {
			$condition['cid'] = $cid;
		}
		if ($news_name) {
			$condition['name'] = array('LIKE','%'.$news_name.'%');
		}

		//分页
		$count   = $this->news->where($condition)->count();// 查询满足要求的总记录数
		$Page    = new \Think\Page($count,25);// 实例化分页类 传入总记录数和每页显示的记录数(25)

		//分页跳转的时候保证查询条件
		foreach($condition as $key=>$val) {
		    $Page->parameter[$key]  =  urlencode($val);
		}

		//头部描述信息，默认值 “共 %TOTAL_ROW% 条记录”
		$Page->setConfig('header', '<li class="rows">共<b>%TOTAL_ROW%</b>条&nbsp;第<b>%NOW_PAGE%</b>页/共<b>%TOTAL_PAGE%</b>页</li>');
		//上一页描述信息
	    $Page->setConfig('prev', '上一页');
	    //下一页描述信息
	    $Page->setConfig('next', '下一页');
	    //首页描述信息
	    $Page->setConfig('first', '首页');
	    //末页描述信息
	    $Page->setConfig('last', '末页');
	    /*
	    * 分页主题描述信息 
	    * %FIRST%  表示第一页的链接显示  
	    * %UP_PAGE%  表示上一页的链接显示   
	    * %LINK_PAGE%  表示分页的链接显示
	    * %DOWN_PAGE% 	表示下一页的链接显示
	    * %END%   表示最后一页的链接显示
	    */
	    $Page->setConfig('theme', '%FIRST%%UP_PAGE%%LINK_PAGE%%DOWN_PAGE%%END%%HEADER%');

		$show    = $Page->show();// 分页显示输出
		// 进行分页数据查询 注意limit方法的参数要使用Page类的属性
		$list = $this->news->where($condition)->order('id desc')->limit($Page->firstRow.','.$Page->listRows)->select();
		foreach ($list as $k => $v) {
			$list[$k]['c_name'] = $this->category->where('id='.intval($v['cid']))->getField('name');
		}

		$this->assign('list',$list);// 赋值数据集
		$this->assign('page',$show);// 赋值分页输出

		//搜索内容输出
		$this->assign('name',$news_name);
		$this->assign('cid',$cid);
		$this->display(); // 输出模板

	}


	/*
	*
	* 跳转添加或修改新闻页面
	*/
	public function add(){
		$news_info = $this->news->where('id='.intval($_GET['news_id']))->find();
		if ($news_info) {
			$news_info['cname']=$this->category->where('id='.intval($news_info['cid']))->getField('name');
		}
		$this->assign('news',$news_info);
		$this->display();
	}


	/*
	*
	* 添加或修改新闻信息
	*/
	public function save(){
		//构建数组
		$this->news->create();
		$this->news->cid = intval($_POST['pid']);

		if (!empty($_FILES["file"]["tmp_name"])) {
			//文件上传
			$upload = new \Think\Upload();// 实例化上传类
		    $upload->maxSize   =  10485760 ;// 设置附件上传大小
		    $upload->exts      =  array('jpg', 'png', 'jpeg');// 设置附件上传类型
		    $upload->rootPath  =  './Data/UploadFiles/'; // 设置附件上传根目录
		    $upload->savePath  =  ''; // 设置附件上传（子）目录
		    $upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
		    $upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
			$upload->subName  = array('date','Ymd'); //子目录创建方式，采用数组或者字符串方式定义
		    // 上传文件 
		    $info = $upload->upload();
		    if(!$info) {// 上传错误提示错误信息
		        $this->error($upload->getError());
		    }else{// 上传成功 获取上传文件信息
			    foreach($info as $file){
			        $this->news->photo = 'UploadFiles/'.$file['savepath'].$file['savename'];
			    }
		    }
		}else{
			if (!$_POST['photo']) {
				$this->error('请上传新闻图片');
			}
		}
		//保存操作时间
		$this->news->addtime = strtotime($_POST['addtime']);
		$this->news->content = $_POST['content'];
		//保存数据
		if (intval($_POST['news_id'])) {
			$result = $this->news->where('id='.intval($_POST['news_id']))->save();
		}else{
			$result = $this->news->add();
		}
		//判断数据是否更新成功
		if ($result) {
			$this->success('操作成功.','index');
		}else{
			$this->error('操作失败.');
		}
	}


	/*
	*
	* 获取单个新闻评论数据
	*/
	public function review(){
		$news_id = intval($_GET['news_id']);
		if (!$news_id) {
			$this->error('查看失败.');
		}

		//分页
		$count   = $this->news_dp->where('news_id='.intval($news_id))->count();// 查询满足要求的总记录数
		$Page    = new \Think\Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数(25)

		//头部描述信息，默认值 “共 %TOTAL_ROW% 条记录”
		$Page->setConfig('header', '<li class="rows">共<b>%TOTAL_ROW%</b>条&nbsp;第<b>%NOW_PAGE%</b>页/共<b>%TOTAL_PAGE%</b>页</li>');
		//上一页描述信息
	    $Page->setConfig('prev', '上一页');
	    //下一页描述信息
	    $Page->setConfig('next', '下一页');
	    //首页描述信息
	    $Page->setConfig('first', '首页');
	    //末页描述信息
	    $Page->setConfig('last', '末页');
	    $Page->setConfig('theme', '%FIRST%%UP_PAGE%%LINK_PAGE%%DOWN_PAGE%%END%%HEADER%');

		$show  = $Page->show();// 分页显示输出

		$dp_list = $this->news_dp->where('news_id='.intval($news_id))->order('id asc')->limit($Page->firstRow.','.$Page->listRows)->select();
		foreach ($dp_list as $k => $v) {
			$user_info = M('user')->where('id='.intval($v['uid']))->field('photo,name')->find();
			$dp_list[$k]['u_name'] = $user_info['name'];
			$dp_list[$k]['u_photo'] = $user_info['photo'];
		}
		$this->assign('page',$show);// 赋值分页输出
		$this->assign('dp_list',$dp_list);
		$this->display();
	}


	/*
	*
	* 管理员回复新闻评论功能
	*/
	public function reply(){
		//接收ajax传过来的值
		$reply_id = intval($_POST['reply_id']);
		$reply_content= trim($_POST['reply_content']);
		$arr = array();
		if ($reply_id && !empty($reply_content)) {
			$data = array();
			$data['reply_content'] = $reply_content;
			$data['reply_status'] = 1;
			$data['reply_time'] = time();

			$up=$this->news_dp->where('id='.intval($reply_id))->save($data);
			if ($up) {
				$arr['info']="回复成功.";
				$arr['status']=1;
			}else{
				$arr['info']="操作失败.";
				$arr['status']=0;
			}
		}else{
			$arr['info']="系统错误.";
			$arr['status']=0;
		}
		echo json_encode($arr);
		exit();
	}


	/*
	*
	* 新闻删除、新闻评论删除
	*/
	public function del(){

		$type = trim($_GET['type']);
		if ($type == 'news') {
			//以后删除还要加权限登录判断
			$id = intval($_GET['did']);
			if (!$id) {
				$this->error('非法操作.');
			}
			$res = $this->news->where('id='.intval($id))->delete();
		}elseif ($type == 'reply') {
			//以后删除还要加权限登录判断
			$rid = intval($_GET['rid']);
			if (!$rid) {
				$this->error('非法操作.');
			}
			$res = $this->news_dp->where('id='.intval($rid))->delete();
		}else{
			$this->error('系统繁忙，请稍后再试.');
		}
		if ($res) {
			$this->success('操作成功.');
		}else{
			$this->error('操作失败.');
		}
	}
}