<?php
namespace Api\Controller;
use Think\Controller;
class IndexController extends PublicController {
	//***************************
	//  首页数据接口
	//***************************
    public function index(){
    	//如果缓存首页没有数据，那么就读取数据库
    	/***********获取首页顶部轮播图************/
    	$ggtop=M('guanggao')->order('sort desc,id asc')->field('id,name,photo,type,action')->limit(10)->select();
		foreach ($ggtop as $k => $v) {
			$ggtop[$k]['photo']=__DATAURL__.$v['photo'];
			$ggtop[$k]['name']=urlencode($v['name']);
		}
    	/***********获取首页顶部轮播图 end************/

    	//======================
    	//首页推荐分类前四个
    	//======================
    	// $procat = M('category')->where('bz_2=1 AND tid!=0')->order('bz_2 desc,sort desc')->field('id,name,bz_1')->limit(4)->select();
    	// foreach ($procat as $k => $v) {
    	// 	$procat[$k]['bz_1'] = __DATAURL__.$v['bz_1'];
    	// }
        //推荐4个资讯分类
        $newslist=M("category")->where("bz_2=1 AND tid=20")->order("sort desc")->limit(4)->select(); 
        foreach ($newslist as $k => $v) {
            $newslist[$k]['bz_3'] = __DATAURL__.$v['bz_3'];
        }

        //======================
        //首页推荐品牌六个
        //======================
        // $brand = M('brand')->where('type=1')->field('id,name,photo')->select();
        // foreach ($brand as $k => $v) {
        //     $brand[$k]['photo'] = __DATAURL__.$v['photo'];
        // }
        $brand=M("category")->where("bz_2 is null AND tid=20")->order("sort desc")->select(); 
        foreach ($brand as $k => $v) {
            $brand[$k]['bz_3'] = __DATAURL__.$v['bz_3'];
        }


    	//======================
    	//首页推荐产品
    	//======================
    	$pro_list = M('product')->where('del=0 AND pro_type=1 AND is_down=0 AND type=1')->order('sort desc,id desc')->field('id,name,photo_x,price_yh,shiyong')->limit(8)->select();
    	foreach ($pro_list as $k => $v) {
    		$pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
    	}

        //======================
        //首页 供应内容
        //======================
        $supply = M('supply');
        $gong = $supply->where('state=0 AND type=1')->order('addtime desc')->limit(8)->select();
        foreach ($gong as $k => $v) {
            $userinfo=M('user')->where('id='.intval($v['uid']))->field("photo,weixin")->find();
            $gong[$k]['catname']= M("category")->where("id=".$v['cid'])->getField("name");
            $gong[$k]['addtime'] = date("Y-m-d",$v['addtime']);
            $gong[$k]['photo'] = $userinfo['photo'];
            $gong[$k]['weixin'] = $userinfo['weixin'];
        }

        //======================
        //首页 求购内容
        //======================
        $qiu = $supply->where('state=0 AND type=2')->order('addtime desc')->limit(8)->select();
        foreach ($qiu as $k => $v) {
            $userinfo2=M('user')->where('id='.intval($v['uid']))->field("photo,weixin")->find();
            $qiu[$k]['catname']= M("category")->where("id=".$v['cid'])->getField("name");
            $qiu[$k]['addtime'] = date("Y-m-d",$v['addtime']);
            $qiu[$k]['photo'] = $userinfo2['photo'];
            $qiu[$k]['weixin'] = $userinfo2['weixin'];
        }

        $catlist=M("category")->where("id in(".$this->catid_tree(1).")")->field('id,name,tid')->select();
        foreach ($catlist as $k => $v) {
            if($v['tid']!=0 && $v['tid']!=1){
                $pre="-".M("category")->where("id=".$v['tid'])->getField("name")."-";
            }else{
                $pre="-";
            }
            $category[$k]=$v['id'].$pre.$v['name'];
        }
    	echo json_encode(array('ggtop'=>$ggtop,'procat'=>$procat,'prolist'=>$pro_list,'brand'=>$brand,'gong'=>$gong,'qiu'=>$qiu,'category'=>$category,"newslist"=>$newslist));
    	exit();
    }
    /**
     * [getlist 加载更多]
     * @return [type] [description]
     */
    public function getlist(){
        $page = intval($_REQUEST['page']);
        $limit = intval($page*8)-8;

        $pro_list = M('product')->where('del=0 AND pro_type=1 AND is_down=0 AND type=1')->order('sort desc,id desc')->field('id,name,photo_x,price_yh,shiyong')->limit($limit.',8')->select();
        foreach ($pro_list as $k => $v) {
            $pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }

        echo json_encode(array('prolist'=>$pro_list));
        exit();
    }
    //***************************
    //  首页供求 上一页
    //***************************
    public function getpage(){
        $page = intval($_REQUEST['page']);
        if (!$page) {
           $page=2;
        }
        $limit = intval($page*8)-8;

        $condition = array();
        $condition['state'] = 0;
        $ptype = intval($_REQUEST['ptype']);
        if ($ptype==1) {
            $condition['type'] = 1;
        }else{
            $condition['type'] = 2;
        }

        //======================
        //首页 供应内容
        //======================
        $supply = M('supply');
        $list = $supply->where($condition)->order('addtime desc')->limit($limit.',8')->select();
        foreach ($list as $k => $v) {
            $list[$k]['addtime'] = date("Y-m-d",$v['addtime']);
            $list[$k]['photo'] = M('user')->where('id='.intval($v['uid']))->getField('photo');
        }

        echo json_encode(array('list'=>$list));
        exit();
    }

}