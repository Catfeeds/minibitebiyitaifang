<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class ShangchangController extends PublicController {

	//***************************
	//  获取所有商场的数据
	//***************************
    public function index(){
    	//查询条件
    	//根据店铺分类id查询
    	$condition = array();
    	$condition['status']=1;
    	$cid = intval($_REQUEST['cid']);
    	if ($cid) {
    		$condition['cid']=intval($cid);
    	}

    	//根据店铺名称查询
    	$keyword = trim($_REQUEST['keyword']);
    	if ($keyword) {
    		$condition['name']=array('LIKE','%'.$keyword.'%');
    	}

    	//获取页面显示条数
    	$page = intval($_REQUEST['page']);
    	if (!$page) {
    		$page = 1;
    	}
        $limit=($page*10)-10;
    	//获取所有的商家数据
    	$store_list = M('shangchang')->where($condition)->order('sort desc,type desc')->field('id,name,uname,logo,tel,sheng,city,quyu')->limit($limit.',10')->select();
        if(!$store_list){
            echo json_encode(array('status'=>0,'err'=>"没有更多的数据了!"));exit;
        }
    	foreach ($store_list as $k => $v) {
            $shopmoney= $this->checkshopmoney($v['id']);
            $store_list[$k]['shopmoney'] = $shopmoney ? "￥".$shopmoney : false;
    		$store_list[$k]['sheng'] = M('china_city')->where('id='.intval($v['sheng']))->getField('name');
    		$store_list[$k]['city'] = M('china_city')->where('id='.intval($v['city']))->getField('name');
    		$store_list[$k]['quyu'] = M('china_city')->where('id='.intval($v['quyu']))->getField('name');
    		$store_list[$k]['logo'] = __DATAURL__.$v['logo'];
    		$pro_list = M('product')->where('del=0 AND pro_type=1 AND is_down=0 AND shop_id='.intval($v['id']))->field('id,photo_x,price_yh')->limit(4)->select();
    		foreach ($pro_list as $key => $val) {
    			$pro_list[$key]['photo_x'] = __DATAURL__.$val['photo_x'];
    		}
    		$store_list[$k]['pro_list'] = $pro_list;
    	}

    	echo json_encode(array('status'=>1,'store_list'=>$store_list));
    	exit();
    }

    //***************************
	//  获取所有商场分类的数据
	//***************************
	public function store_cat(){
		
		$cat_list = M('category')->where('tid=3')->field('id,name')->order('sort desc,id asc')->select();
		echo json_encode(array('status'=>1,'cat'=>$cat_list));
		exit();
	}

    //***************************
	//  获取商铺详情信息接口
	//***************************
    public function shop_details(){

    	$shop_id = intval($_REQUEST['shop_id']);
    	$shop_info = M('shangchang')->where('id='.intval($shop_id))->field('id,name,uname,tel,logo,address,content')->find();
    	if (!$shop_info) {
    		echo json_encode(array('status'=>0,'err'=>'没有找到商铺信息.'));
    		exit();
    	}
        $shopmoney= $this->checkshopmoney($shop_id);
        $shop_info['shopmoney']=$shopmoney ? "￥".$shopmoney : false;
    	$shop_info['logo']=__DATAURL__.$shop_info['logo'];
        $content = str_replace(C('content.dir'), __DATAURL__, $shop_info['content']);
        $shop_info['content']= html_entity_decode($content, ENT_QUOTES ,'utf-8');
    	//$shop_info['content']=html_entity_decode($shop_info['content'], ENT_QUOTES ,'utf-8');
    	//获取8个商品
    	$pro_list = M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0')->order('addtime desc,sort desc')->field('id,name,intro,price_yh,photo_x,shiyong')->limit(20)->select();
    	foreach ($pro_list as $k => $v) {
    		$pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
    	}

    	echo json_encode(array('status'=>1,'shop_info'=>$shop_info,'pro'=>$pro_list));
    	exit();
    }
    /**
     * [get_shoppro 获取更多店铺商品]
     * @return [type] [description]
     */
    public function get_shoppro(){
        $shop_id = intval($_REQUEST['shop_id']);
        $shop_info = M('shangchang')->where('id='.intval($shop_id))->field('id')->find();
        if (!$shop_info) {
            echo json_encode(array('status'=>0,'err'=>'没有找到商铺信息.'));
            exit();
        }
        $page=I("request.page");
        if(!$page){
            $page=1;
        }
        $limit=($page*20)-20;
        $pro_list = M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0')->order('addtime desc,sort desc')->field('id,name,intro,price_yh,photo_x,shiyong')->limit($limit,20)->select();
        if(!$pro_list){
            echo json_encode(array('status'=>0,'err'=>'没有更多的数据了'));
            exit();
        }
        foreach ($pro_list as $k => $v) {
            $pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }
        echo json_encode(array('status'=>1,'pro'=>$pro_list));
        exit();
    }
    /**
     * [my_shop_details 个人店铺信息]
     * @return [type] [description]
     */
    public function my_shop_details(){

        $uid=I("request.uid");
        if(!$uid){
            echo json_encode(array('status'=>0,'err'=>'提供参数不足'));
            exit();
        }

        $shop_id = M("user")->where("id=".$uid)->getField("shop_id");
        $shop_info = M('shangchang')->where('id='.intval($shop_id))->field('id,name,tel,logo,address')->find();
        if (!$shop_info) {
            echo json_encode(array('status'=>0,'err'=>'没有找到商铺信息.'));
            exit();
        }
        $shopmoney= $this->checkshopmoney($shop_id);
        $shop_info['shopmoney']=$shopmoney ? "￥".$shopmoney : false;
        $shop_info['logo']=__DATAURL__.$shop_info['logo'];
        echo json_encode(array('status'=>1,'shop_info'=>$shop_info));
        exit();
    }


	//***************************
	//  会员店铺收藏接口
	//***************************
	public function shop_collect(){
		$uid = intval($_REQUEST['uid']);
		$shop_id = intval($_REQUEST['shop_id']);
		if (!$uid || !$shop_id) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$check = M('shangchang_sc')->where('uid='.intval($uid).' AND shop_id='.intval($shop_id))->getField('id');
		if ($check) {
			echo json_encode(array('status'=>1,'succ'=>'您已收藏该店铺.'));
			exit();
		}
		$data = array();
		$data['uid'] = intval($uid);
		$data['shop_id'] = intval($shop_id);
		$res = M('shangchang_sc')->add($data);
		if ($res) {
			echo json_encode(array('status'=>1,'succ'=>'收藏成功！'));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'网络错误.'));
			exit();
		}
	}

	//***************************
	//  公共获取省市区名称方法
	//***************************
	public function get_city_name($id){
		$cityModel = M('china_city');
		$city_name = $cityModel->where('id='.intval($id))->getField('name');
		return $city_name;
	}

    public function get_addpro_info(){
        $uid=I("request.uid");
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'参数不足'));
            exit();
        }
        $proid=I("request.proid")?I("request.proid"):0;
        $category=M("category");
        $brand=M("brand");
        $product=M("product");
        $shopid=M('user')->where("id=$uid")->getField("shop_id");
        $list['shopname']=M("shangchang")->where("id=".$shopid)->getField("name");
        // 分类列表
        $catlist=$category->where("id in(".$this->catid_tree(1).")")->field('id,name,tid')->select();
        foreach ($catlist as $k => $v) {
            if($v['tid']!=0 && $v['tid']!=1){
                $pre="-".$category->where("id=".$v['tid'])->getField("name")."-";
            }else{
                $pre="-";
            }
            $list['category'][$k]=$v['id'].$pre.$v['name'];
        }
        // 品牌列表
        $bralist=$brand->where("shop_id=".$shopid)->select();
        foreach ($bralist as $k => $v) {
            $list['brand'][$k]=$v['id']."-".$v['name'];
        }

        $list['pro']=array();
        if($proid>0){
            $pro=$product->where("id=$proid")->find();
            $pro['photomin']=__DATAURL__.$pro['photo_x'];
            $pro['photobig']=__DATAURL__.$pro['photo_d'];
            if($pro['photo_string']){
                $pro['uploadarr']=explode(",",trim($pro['photo_string'],","));
                foreach ($pro['uploadarr'] as $k => $v) {
                    $pro['uploadarr'][$k]=__DATAURL__.$v;
                }
            }
            $pro['category']=$pro['cid']."-".$category->where("id=".$pro['cid'])->getField("name");
            $pro['brand']=$pro['brand_id']."-".$brand->where("id=".$pro['brand_id'])->getField("name");
            $list["pro"]=$pro;
        }

        echo json_encode(array('status'=>1,"err"=>$list));

    }
    /**
     * [get_brand 获取品牌列表]
     * @return [type] [description]
     */
    public function get_brand(){
        $uid=I("request.uid");
        $brand=M("brand");
        $shopid=M('user')->where("id=$uid")->getField("shop_id");
        // 品牌列表
        $bralist=$brand->where("shop_id=".$shopid)->select();
        foreach ($bralist as $k => $v) {
            $list['brand'][$k]=$v['id']."-".$v['name'];
        }
        echo json_encode(array('status'=>1,"err"=>$list));
    }

    public function addbrand(){
        $uid=I('request.uid');
        $fdata=I('request.');
        if($uid){
            $shopid=M('user')->where("id=$uid")->getField("shop_id");
            $data['name']=$fdata['name'];
            $data['photo']=$fdata['photo'];
            $data['addtime']=time();
            $data['digest']=$fdata['digest'];
            $data['shop_id']=$shopid;
            $re=M('brand')->add($data);
            if($re){
                echo json_encode(array('status'=>1,'err'=>"提交成功!"));
            }else{
                echo json_encode(array('status'=>0,'err'=>'提交失败'));
            }

        }else{
           echo json_encode(array('status'=>0,'err'=>'提供参数不足')); 
        }
    }
    public function addpro(){
        $uid=I('request.uid');
        $fdata=I('request.');
        if($uid){
            $product=M("product");
            $shopid=M('user')->where("id=$uid")->getField("shop_id");
            if(!$shopid){
                echo json_encode(array('status'=>0,'err'=>'提供参数不足!'));exit; 
            }
            $data['name']=$fdata['name'];
            $data['intro']=$fdata['intro'];
            $brandid=explode("-", $fdata['brand']);
            $data['brand_id']=$brandid[0];
            $catid=explode("-",$fdata['category']);
            $data['cid']=$catid[0];
            $data['content']=$fdata['content'];
            $data['company']=$fdata['company'];
            $data['pro_number']=$fdata['pro_number'];
            $data['price']=$fdata['price'];
            $data['price_yh']=$fdata['price_yh'];
            $data['price_jf']=$fdata['price_jf']?$fdata['price_jf']:0;
            $data['photo_x']=$fdata['photomin'];
            $data['photo_d']=$fdata['photobig'];
            $data['photo_string']=trim($fdata['uploadarr'],",");
            $data['addtime']=time();
            $data['num']=$fdata['num'];
            $data['is_down']=1;//前端上架了产品默认是下架状态
            $data['shop_id']=$shopid;
            // dump($data);
            if($fdata['proid']>0){
                $re=$product->where("id=".$fdata['proid'])->save($data);
            }else{
                $re=M('product')->add($data);
            }
            if($re){
                echo json_encode(array('status'=>1,'err'=>"提交成功!"));
            }else{
                echo json_encode(array('status'=>0,'err'=>'提交失败'));
            }

        }else{
           echo json_encode(array('status'=>0,'err'=>'提供参数不足')); 
        }
    }
    
    public function uploadbrand(){
        //文件上传
        $width= I("request.width") ? I("request.width") : 400;
        $height= I("request.height") ? I("request.height") : 400;
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =  31457280 ;// 设置附件上传大小
        $upload->exts      =  array('jpg', 'png', 'jpeg');// 设置附件上传类型
        $upload->rootPath  =  './Data/UploadFiles/brand/'; // 设置附件上传根目录
        $upload->savePath  =  ''; // 设置附件上传（子）目录
        $upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
        $upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
        $upload->subName  = array('date','Ymd'); //子目录创建方式，采用数组或者字符串方式定义
        // 上传文件 
        $info = $upload->upload();
        foreach($info AS $k=>$v){
            $img='UploadFiles/brand/'.$info[$k]['savepath'].$info[$k]['savename'];                  
        }
        $image = new \Think\Image();
        $image->open('./Data/'.$img);
        $image->thumb($width, $height)->save('./Data/'.$img);
        echo $img;
    }
    public function uploadpro(){
        //文件上传
        $width= I("request.width") ? I("request.width") : 600;
        $height= I("request.height") ? I("request.height") : 600;
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =  31457280 ;// 设置附件上传大小
        $upload->exts      =  array('jpg', 'png', 'jpeg');// 设置附件上传类型
        $upload->rootPath  =  './Data/UploadFiles/product/'; // 设置附件上传根目录
        $upload->savePath  =  ''; // 设置附件上传（子）目录
        $upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
        $upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
        $upload->subName  = array('date','Ymd'); //子目录创建方式，采用数组或者字符串方式定义
        // 上传文件 
        $info = $upload->upload();
        foreach($info AS $k=>$v){
            $img='UploadFiles/product/'.$info[$k]['savepath'].$info[$k]['savename'];                  
        }
        $image = new \Think\Image();
        $image->open('./Data/'.$img);
        $image->thumb($width, $height)->save('./Data/'.$img);
        echo $img;
    }
    public function uploadlogo(){
        //文件上传
        $width= I("request.width") ? I("request.width") : 200;
        $height= I("request.height") ? I("request.height") : 200;
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =  31457280 ;// 设置附件上传大小
        $upload->exts      =  array('jpg', 'png', 'jpeg');// 设置附件上传类型
        $upload->rootPath  =  './Data/UploadFiles/shop/'; // 设置附件上传根目录
        $upload->savePath  =  ''; // 设置附件上传（子）目录
        $upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
        $upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
        $upload->subName  = array('date','Ymd'); //子目录创建方式，采用数组或者字符串方式定义
        // 上传文件 
        $info = $upload->upload();
        foreach($info AS $k=>$v){
            $img='UploadFiles/shop/'.$info[$k]['savepath'].$info[$k]['savename'];                  
        }
        $image = new \Think\Image();
        $image->open('./Data/'.$img);
        $image->thumb($width, $height)->save('./Data/'.$img);
        echo $img;
    }
    /**
     * [editshoppwd 修改商家后台的登陆密码]
     * @return [type] [description]
     */
    public function editshoppwd(){
        $uid=I("request.uid");
        $pwd=I("request.pwd");
        if(!$uid){
            echo json_encode(array('status'=>0,'err'=>'提供参数不足'));
            exit;
        }
        $user=M("user");
        $re=$user->where("id=$uid")->setField("pwd",md5(md5($pwd)));
        if($re){
           echo json_encode(array('status'=>1,'err'=>'修改成功')); 
        }else{
           echo json_encode(array('status'=>0,'err'=>'修改失败'));
        }
    }


}