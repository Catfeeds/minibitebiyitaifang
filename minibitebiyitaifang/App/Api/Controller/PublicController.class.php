<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class PublicController extends Controller {
    
    //构造函数
    public function _initialize(){
	    //php 判断http还是https
    	$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://'; 
    	//所有图片路径
	    define(__DATAURL__, $http_type.$_SERVER['SERVER_NAME'].__DATA__.'/');
	    define(__PUBLICURL__, $http_type.$_SERVER['SERVER_NAME'].__PUBLIC__.'/');
	    define(__HTTP__, $http_type);
    }
   
    //查找二级分类下的所有子分类id，用逗号拼接
    public function catid_tree($id=2){
		$Category = M('category');
		$list=$Category->where("tid=".$id)->order('sort desc,id asc')->select();
		//dump($list);exit;
		$cidstr='';
		foreach($list as $v){
			$json[]=$v['id'];
			$num=$Category->where("tid=".$v['id'])->field('id')->count();
			if($num>0){
				$json[]=$this->catid_tree($v['id']);
			}
		}
		$cidstr.=implode(',',$json);
		return $cidstr;		
	}
	//一次性查出产品分类的所有分类
	public function cat_tree($id=2){
		$Category = M('category');
		$list=$Category->where("tid=".$id)->field('id,tid,name')->order('sort desc,id asc')->select();
		//echo '<pre>';print_r($list);exit;
		foreach($list as $v){
			$num = $Category->where("tid=".$v['id'])->count();
			$subclass=array();
			if($num>0)
			{
				$subclass=$this->cat_tree($v['id']);
			}
			$json[]=array(
				'id' => $v['id'] ,
				'name' => $v['name'] ,
				'num' => $num ,
				'subclass' => $subclass,
			);
		}
		return $json;		
	}
	//导航部分  查找父级分类
    function getAllFcateIds($categoryID)
    {
        //初始化ID数组
        $array[] = $categoryID;
         
        do
        {
            $ids = '';
            $where['id'] = array('in',$categoryID);
            $cate = M('category')->where($where)->field('id,tid,name')->select();
           // echo M('aaa_cpy_category')->_sql();
            foreach ($cate as $v)
            {
                $array[] = $v['tid'];
                $ids .= ',' . $v['tid'];
            }
            $ids = substr($ids, 1, strlen($ids));
            $categoryID = $ids;
        }
        while (!empty($cate));
       // $cates=array();
        foreach ($array as $key=>$va){
           $cates[] = M('category')->where('id='.$va)->field('id,tid,name')->find();
          // echo M('aaa_cpy_category')->_sql();
		  //echo $cates[$key]['name'];
		   $cates[$key]['name']=str_replace('（系统分类，不要删除）','',$cates[$key]['name']);
        }
        array_pop($cates);
        $ca=array_reverse($cates);
		//echo "<pre>";
	   // print_r($ca);
        return $ca; //返回数组
    }
    
	public function ispc($val){
		//$val = 1850;//这个为admin_app的id
		$app = M('admin_app');
		$val=$app->getField('id');
		//$url = $app->db(2,DB)->where('id='.$val)->field('ispcshop,end_time,name,pcnav_color,ahover_color')->find();
		$url = $app->where('id='.$val)->field('ispcshop,end_time,name,pcnav_color,ahover_color')->find();
		//print_r($url);exit;
		//return $url;
		
		if($url['end_time'] > time()){
			return $url;
		}else{
			return 0;
		}
    }
    /**针对涂屠生成唯一订单号
	*@return int 返回16位的唯一订单号
	*/
	public function build_order_no(){
		return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
	}

	/**
     * [checkshopmoney 检查店铺的保证金]
     * @return [type] [description]
     */
    public function checkshopmoney($shopid){
        $user=M("user");
        @$re=$user->where("shop_id=".$shopid." AND del=0")->find();
        if($re){
        	if($re['shop_money']>0){
				return $re['shop_money'];
        	}else{
				return false;
        	}           
        }else{
            return false;
        }
    }
    /**
     * [getaccess_token 获得access_token值]
     * @return [type] [description]
     */
	public function getaccess_token(){
		$wx_config = C('weixin');
    	$appid = $wx_config['appid'];
    	$secret = $wx_config['secret'];
		if (!$appid || !$secret) {
			echo json_encode(array('status'=>0,'err'=>'非法操作！'.__LINE__));
			exit();
		}

		$get_token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$secret;
		$ch = curl_init();
		curl_setopt($ch,CURLOPT_URL,$get_token_url);
		curl_setopt($ch,CURLOPT_HEADER,0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
		$res = curl_exec($ch);  
		curl_close($ch);  
		echo $res;
		exit();
	}
	public function getercode(){
		//生成图片  
	    $uid=I("request.uid");
	    $xiaochengxu_path = I("request.path");
	    $width = I("request.width");
	    $imgDir = 'Data/UploadFiles/Uploads/index.html'; 
	    $post_url = "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=$access_token";
	    
	    $post_data='{"path":"'.$xiaochengxu_path.'","width":'.$width.'}';
	    $opts = array('http' =>
	        array(
	            'method'  => 'POST',
	            'header'  => 'Content-type: application/json',
	            'content' => $post_data
	        )
	    );
	    $context = stream_context_create($opts);
	    $result = file_get_contents($post_url, false, $context);
	    $file_path = $imgDir;
	    $bytes = file_put_contents($file_path, $result);
	    echo $bytes;
	}
	/**
    * 验证手机号是否正确
    * @author honfei
    * @param number $mobile
    */
    function isMobile($mobile) {
        if (!is_numeric($mobile)) {
            return false;
        }
        return preg_match('#^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$#', $mobile) ? true : false;
    }
	
	
}