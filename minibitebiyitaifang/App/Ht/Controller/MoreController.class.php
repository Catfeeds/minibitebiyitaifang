<?php
// |++++++++++++++++++++++++++++++++++++++++
// |-综合管理
// |---单页管理(lr_web)
// |---用户反馈(lr_fankui)
// |---首页设置
// |------首页banner(lr_guanggao)
// |------新闻栏目设置(lr_config)
// |------推荐分类(lr_category)
// |------推荐产品(lr_product)
// |------推荐商家(lr_shangchang)
// |---城市管理(lr_china_city)
// |+++++++++++++++++++++++++++++++++++++++++
namespace Ht\Controller;
use Think\Controller;
class MoreController extends PublicController{
	//*************************
	//单页设置
	//*************************
	public function pweb_gl(){
		//获取web表的数据进行输出
		$model=M('web');
		$list=$model->select();
		//dump($list);exit;
		//=================
		//将变量进行输出
		//=================
		$this->assign('list',$list);	
		$this->display();
	}

	//*************************
	//单页设置修改
	//*************************
	public function pweb(){
		if(IS_POST){
			if(intval($_POST['id'])){
				$data = array();
				$data['concent'] = $_POST['concent'];
				$data['sort'] = intval($_POST['sort']);
				$data['addtime'] = time();
				$up = M('web')->where('id='.intval($_POST['id']))->save($data);
				if ($up) {
					$this->success('保存成功！');
					exit();
				}else{
					$this->error('操作失败！');
					exit();
				}

			}else{
				$this->error('系统错误！');
				exit();
			}
		}else{
			$this->assign('datas',M('web')->where(M('web')->getPk().'='.I('get.id'))->find());
			$this->display();
		}
	}

	//*************************
	//用户反馈
	//*************************
	public function fankui(){
		//获取搜索框发送过来的数据
		if(!empty($_GET)){
			//dump(I('get.'));exit;
			$message=$this->htmlentities_u8($_GET['message']);
			if($_GET['type']=='del'){
				$this->delete('fankui',(int)$_GET['id']);
			}
		}
		//ajax删除fankui数据表的数据
		//拼装sql语句

		//dump($tsql);exit;
		//搜索
		$where="1=1";
		$message!='' ? $where.=" and message like '%$message%'" : null;
		//dump($tsql);exit;
		//=========================
		//define  每页显示的数量
		//=========================
		define('rows',20);
		$count=M('fankui')->where($where)->count();
		$rows=ceil($count/rows);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$page_index=$this->page_index($count,$rows,$page);
		$fankui=M('fankui')->where($where)->order('id desc')->limit($limit,rows)->select();
		//=============
		//将变量输出
		//=============
		$this->assign('id',$id);
		$this->assign('message',$message);
		$this->assign('page_index',$page_index);
		$this->assign('fankui',$fankui);
		$this->display();
	}

	//*************************
	//首页设置
	//*************************
	public function index(){
		//实例化模型，将广告表输出
		$guanggao=M('guanggao')->order('sort desc,id asc')->limit(10)->select();
		foreach ($guanggao as $k => $v) {
			$guanggao[$k]['photo']=__UPLOAD__.$v['photo'];
		}
		//实例化模型，将新闻栏目的东西输出出来
		$config=M('config')->where("type='new_option'")->limit(3)->select();
		foreach ($config as $k => $v) {
			$catname=M('category')->where('id='.$v['pid'])->find();
			$config[$k]['key']=__UPLOAD__.$v['key'];
			$config[$k]['pid']=$catname['name'];
		}
		$config_more=M('config')->where("type='new_option' AND id=4")->find();
		$config_more['key']=__UPLOAD__.$config_more['key'];
		$config_more['pid']="更多";
		//实例化模型，将推荐分类栏目输出出来，其中2是产品分类
		$hot_category=M('category')->where(ltrim($this->product_option(2)))->order('sort desc,id asc')->limit(4)->select();
		foreach ($hot_category as $k => $v) {
			$hot_category[$k]['bz_1']=__DATA__."/".$v['bz_1'];
		}
		//实例化模型，将推荐产品输出出来
		$hot_product=M('product')->field('id,logo,name')->where('del<1 and type=1')->order('sort desc,id asc')->limit(6)->select();
		foreach ($hot_product as $k => $v) {
			$hot_product[$k]['logo']=__UPLOAD__.$v['logo'];
		}
		//实例化模型，将推荐商家输出出来
		$hot_shop=M('shangchang')->where('type = 1')->order('sort desc,id asc')->limit(4)->select();
		foreach ($hot_shop as $k => $v) {
			$hot_shop[$k]['logo']=__UPLOAD__.$v['logo'];
		}
		//中部广告
		$center_banber=M('gg')->where("`place`='center'")->order("sort desc,id asc")->limit(3)->select();
		foreach ($center_banber as $k => $v) {
			$center_banber[$k]['photo']=__UPLOAD__.$v['photo'];
		}
		//底部广告
		$bottom_banber=M('gg')->where("`place`='bottom'")->order("sort desc,id asc")->limit(3)->select();
		foreach ($bottom_banber as $k => $v) {
			$bottom_banber[$k]['photo']=__UPLOAD__.$v['photo'];
		}
		//中部
		//$sql = mysql_query("select * from aaa_pts_gg where place='center' order by sort desc,id asc limit 3");
		//底部
		// $sql = mysql_query("select * from aaa_pts_gg where place='bottom' order by sort desc,id asc limit 3");
		if($_POST['submit']==true){
		    $json['topbanner']=M('guanggao')->order('sort desc,id asc')->limit(10)->select();
			foreach ($json['topbanner'] as $k => $v) {
				$json['topbanner'][$k]['photo']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['photo'];
				$json['topbanner'][$k]['name']=urlencode($v['name']);
			}
			//  $json['midbanner']  首页中部广告
			$json['midbanner']=M('gg')->where("`place`='center'")->order("sort desc,id asc")->limit(3)->select();
			foreach ($json['midbanner'] as $k => $v) {
				$json['midbanner'][$k]['photo']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['photo'];
				$json['midbanner'][$k]['name']=urlencode($v['name']);
			}
			//  $json['btmbanner']  首页底部广告		
			$json['btmbanner']=M('gg')->where("`place`='bottom'")->order("sort desc,id asc")->limit(3)->select();
			foreach ($json['btmbanner'] as $k => $v) {
				$json['btmbanner'][$k]['photo']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['photo'];
				$json['btmbanner'][$k]['name']=urlencode($v['name']);
			}
			//  $json['news']    	首页新闻栏目
			$json['news']=M('config')->where("type='new_option'")->limit(3)->field('pid,key,val')->select();
			foreach ($json['news'] as $k => $v) {
				$json['news'][$k]['name']=M('category')->where('id='.intval($v['pid']))->getField('name');
				$json['news'][$k]['key']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['key'];
			}
			//新闻更多
			$json['news_more']=M('config')->where("type='new_option' AND id=4")->field('pid,key,val')->find();
			$json['news_more']['key']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$json['news_more']['key'];
			$json['news_more']['pid']="更多";
			//  $json['hotshop'] 	今日推荐商家 默认显示4个
			$json['hotshop']=M('shangchang')->field('id,name,logo,guanggaoyu')->where("type=1 and status>0")->order('sort desc,id asc')->limit(4)->select();
			foreach ($json['hotshop'] as $k => $v) {
				// $guanggao=M('img')->field('guanggao,bz_1,bz_2,bz_3')->where('shop_id='.$v['id'])->find();
				$json['hotshop'][$k]['name']=urlencode($v['name']);
				$json['hotshop'][$k]['guanggao']=urlencode($v['guanggaoyu']);
				$json['hotshop'][$k]['bz_1']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['logo'];
				$json['hotshop'][$k]['bz_2']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['logo'];
				$json['hotshop'][$k]['bz_3']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['logo'];
			}
			//  $json['hotprocat']  推荐商品分类 tid=2为产品分类 bz_2=1为推荐
			$json['hotprocat']=M('category')->where('tid=2 and bz_2=1')->limit(4)->select();
			foreach ($json['hotprocat'] as $k => $v) {
				$json['hotprocat'][$k]['bz_1']="http://".$_SERVER['SERVER_NAME'].__DATA__."/".$v['bz_1'];
				$json['hotprocat'][$k]['name']=urlencode($v['name']);
			}
			//  $json['hotpro']     首页推荐商品
			$json['hotpro']=M('product')->where('del<1 and type=1')->order('sort desc,id asc')->field('id,name,logo')->limit(6)->select();
			foreach ($json['hotpro'] as $k => $v) {
				$json['hotpro'][$k]['name']=urlencode(mb_substr($v['name'],0,10,'utf8')."...");
				$json['hotpro'][$k]['logo']="http://".$_SERVER['SERVER_NAME'].__UPLOAD__.$v['logo'];
			}
            $json['returns']=1;
            $json['time']=time();
			//echo app_pash;exit;
			$path='Data/Jsondata/appindex.txt';
			//dump($path);exit;
			if (is_writable($path)) {
				file_put_contents($path,urldecode(json_encode($json)));
				echo '
				<script>
				   alert("更新成功！");
				   history.go(-1);
				</script>
					 ';
			}else{
				echo "更新失败！";
			}
		    return;
		}
		//dump($hot_product);exit;
		//=============
		//将变量输出
		//=============
		$this->assign('guanggao',$guanggao);
		$this->assign('center_banber',$center_banber);
		$this->assign('bottom_banber',$bottom_banber);
		$this->assign('config',$config);
		$this->assign('config_more',$config_more);
		$this->assign('hot_category',$hot_category);
		$this->assign('hot_product',$hot_product);
		$this->assign('hot_shop',$hot_shop);
		$this->display();
	}

	//*************************
	//城市管理
	//*************************
	public function city(){
		$id=(int)$_GET['id'];
		//一级列表
		$city=M('ChinaCity')->where("tid=".$id)->select();
		foreach ($city as $k => $v) {
			$city[$k]['priv']=$v['tid']<1 ? '省级' : M('ChinaCity')->where('id='.$v['tid'])->getField('name');
		}
		//dump($city);exit;
		//省市区面包屑，此调用函数在楼下
		$nav=$id>0 ? $this->city_jibie($id) : NULL;
		//dump($_GET);
		//如果有GET到type=del就执行删除
		if($_GET['type']=='del'){
			$this->delete('ChinaCity',$id);
		}
		
		//=============
		//将变量输出
		//=============
		$this->assign('id',$id);
		$this->assign('city',$city);
		$this->assign('nav',$nav);
		$this->display();
	}

	//*************************
	//城市管理  面包屑功能
	//*************************
	public function city_jibie($id){
	   $re=M('ChinaCity')->field('name,tid,id')->where('id='.$id)->find();
	   //dump($re);
	   $text = '<a href="?id='.$re['id'].'">'.$re['name'].'</a>';
	   if($re['tid']>0){
		   $text = $this->city_jibie($re['tid']) .' -> '. $text;   
	   }
	   return $text;
	}


	//*************************
	//城市管理  添加下级县市
	//*************************
	public function city_add(){
		//这是点击添加下级是获取
	    $tid=(int)$_GET['tid'];
	    //这是点击修改时获取
		$id=(int)$_GET['id'];
		$priv=M('ChinaCity')->where('id='.$tid)->find();
		$city=M('ChinaCity')->where('id='.$id)->find();
		//dump($priv);
		//修改时获取post过来的东西，然后进行判断插入或者更新
		if($_POST['submit']){
			 //dump($_POST);exit;
			  $array = array(
			             'tid' => $tid ,
						 'name' => $this->htmlentities_u8($_POST['name']) ,
			               );
			  //此处为添加下级
			  if($id<1)
			  {
				 $id =M('ChinaCity')->add($array);
				 echo '<script>alert("操作成功！");location="?tid='.$tid.'&id='.$id.'";</script>';
			  }else{
			  	 //此处为修改
				 $sql = M('ChinaCity')->where('id='.$id)->save($array);  
			  }
			  //修改后的后续行为
			  if($sql){			  
				  echo '<script>alert("操作成功！");location="?tid='.$tid.'&id='.$id.'";</script>';
			   }else{
				  echo '<script>alert("操作失败！");history.go(-1);</script>';
			   }
			  
		}
		//此处为添加新的下级的后续操作
		if($id>0){
		  $tid = M('ChinaCity')->where('id='.$id)->getField('tid');
		}
		//=============
		//将变量输出
		//=============
		$this->assign('id',$id);
		$this->assign('priv',$priv);
		$this->assign('city',$city);
		$this->display();
	}

	//*************************
	// 新闻栏目设置
	//*************************
	public function new_option(){
		$id=(int)$_GET['id'];
		$option=$_GET['option'];
		if($_POST['submit']==true){
		   
		   try{
			   
			   $array['sort']=(int)$_POST['sort'];
			   $array['name']=$this->htmlentities_u8($_POST['name']);
			   $array['photo']=$this->htmlentities_u8($_POST['photo']);
			   $array= array(
						'pid' => (int)$_POST['pid'],
						'sort' => (int)$_POST['sort'],
						'key' => $this->htmlentities_u8($_POST['key']),
						'val' => $this->htmlentities_u8($_POST['val']),
						  );
				foreach ($array as $k => $v) {
					if(!$v){
						unset($array[$k]);
					}
				}	  
				if(strlen($array['val'])!=6){
					throw new \Exception('颜色不正确！');
				}
			   
				$sql=M('config')->where("id=$id")->save($array);
				
				if(!$sql) throw new \Exception('操作失败！');
				
				echo '<script>
						  alert("操作成功！");
						  location.href="new_option?id='.$id.'"
						  window.opener.location.reload();
					   </script>';
			
		   }catch(\Exception $e){
			   echo '<script>
				      alert("'.$e->getMessage().'");
					  history.go(-1);
				    </script>';
		   }
		   return ;
		}

		if($option=="more"){
			$more="more";//设置标示
		}else{$more="";}
		$config= $id>0 ? M('config')->where("id=$id")->find() : ""; 
		//将栏目分类遍历出来
		$newscat= M('category')->where('tid=23')->select();
		foreach ($newscat as $k => $v) {
		  $config['pid']==$v['id'] ? $select="selected=selected" : $select="";
		  $newscat[$k]['id'] = "value='".$v['id']."' $select";  
		}
		//dump($newscat);exit;
		//=============
		//将变量输出
		//=============
		$this->assign('id',$id);
		$this->assign('config',$config);
		$this->assign('more',$more);
		$this->assign('newscat',$newscat);
		$this->display();
	}

	//*************************
	// 小程序配置 设置页面
	//*************************
	public function setup(){
		if(IS_POST){
			//构建数组
			M('program')->create();
			//上传产品分类缩略图
			if (!empty($_FILES["file2"]["tmp_name"])) {
				//文件上传
				$info2 = $this->upload_images($_FILES["file2"],array('jpg','png','jpeg'),"logo");
			    if(!is_array($info2)) {// 上传错误提示错误信息
			        $this->error($info2);
			    }else{// 上传成功 获取上传文件信息
				    M('program')->logo = 'UploadFiles/'.$info2['savepath'].$info2['savename'];
			    }
			}
			M('program')->uptime=time();

			$check = M('program')->where('id=1')->getField('id');
			if (intval($check)) {
				$up = M('program')->where('id=1')->save();
			}else{
				M('program')->id=1;
				$up = M('program')->add();
			}

			if ($up) {
				$this->success('保存成功！');
				exit();
			}else {
				$this->error('操作失败！');
				exit();
			}
			
		}else{
			$this->assign('info',M('program')->where('id=1')->find());
			$this->display();
		}

	}

}